/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    difference = pastry.difference,
    each = pastry.each,
    extend = pastry.extend,
    isArray = pastry.isArray,
    isString = pastry.isString,
    map = pastry.map,
    trim = pastry.trim,
    uuid = pastry.uuid;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');

var CONST = require('./CONST');
var utils = require('./utils');

var NS = 'topic-';

var tmplLabels = require('./template/labels');
var tmplMarker = require('./template/marker');
var tmplMarkers = require('./template/markers');
var tmplNotes = require('./template/notes');
var tmplTopic = require('./template/topic');

function getTopicsType(topic) {
    // FIXME is this official?
    var REGEXP_FLOATING = new RegExp(CONST.TOPIC_FLOATING + '$', 'i');
    if (
        topic.type === CONST.TOPIC_DETACHED ||
        (topic.structure || '').match(REGEXP_FLOATING)
    ) {
        return CONST.TOPIC_DETACHED;
    }
    return CONST.TOPIC_ATTACHED;
}

var Topic = declare('Topic', DomMixin, {
    constructor: function(options) {
        /*
         * options:
         *   - sheet(required)
         *   - parent
         *   - type
         *   // when creating a new one {
         *      - title
         *      - structure
         *   // }
         *   // when loading from an existing one {
         *      - doc
         *   // }
         */
        var sheet = options.sheet;

        extend(this, {
            isRootTopic: !options.parent,
            parent: options.parent,
            structure: options.structure,
            type: options.type,
            sheet: sheet,
            children: [],
            childById: {},
        });
        if (options.doc) {
            this.doc = options.doc;
            this._loadSubTopics();
        } else {
            this.doc = domParser.parseFromString(tmplTopic({
                id: uuid(NS),
                title: options.title,
                styleId: options.styleId,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
        }
        this.id = this.getAttribute(CONST.ATTR_ID);
        // xml structure {
            this._addToParent();
        // }
        // level, etc {
        // }
        sheet.topics.push(this);
        sheet.topicById[this.id] = this;
    },
    _addToParent: function(parent) {
        var sheet = this.sheet;
        if (this.isRootTopic) {
            sheet.doc.appendChild(this.doc);
            sheet.rootTopic = this;
        } else {
            parent = parent || this.parent;
            this.parent = parent; // if parent is defined, change it
            this.topicsType = getTopicsType(this); // attached or detached
            var parentDoc = parent.doc,
                childrenNode = utils.findOrCreateChildNode(
                    parentDoc, CONST.TAG_CHILDREN
                ),
                childrenTopicsNode = utils.findOrCreateChildNode(
                    childrenNode, CONST.TAG_TOPICS, {
                        type: this.topicsType
                    }
                );
            childrenTopicsNode.appendChild(this.doc);
            parent.children.push(this);
            parent.childById[this.id] = this;
        }
    },
    destroy: function(force) {
        var sheet = this.sheet;
        if (force || sheet.rootTopic !== this) { // cannot destroy root topic unless it is forced to
            each(this.children, function(child) {
                child.destroy();
            });
            sheet.topics = difference(sheet.topics, [this]);
            delete sheet.topicById[this.id];
            DomMixin.destroy.apply(this);
        }
    },
    toPlainObject: function() {
        return {
            hyperlink: this.getHyperlink(),
            id: this.id,
            isRootTopic: this.isRootTopic,
            labels: this.getLabels(),
            markers: this.getMarkers(),
            modifiedTime: this.getModifiedTime(), // timestamp
            notes: this.getNotes(),
            parentId: this.parent ? this.parent.id : '',
            sheetId: this.sheet.id,
            structure: this.structure,
            title: this.getTitle(),
            type: this.type,
            children: map(this.children, function(child) {
                return child.toPlainObject();
            })
        };
    },
    _loadSubTopics: function() {
        /*
         * <topic>
         *     <!-- other childNodes -->
         *     <children>
         *         <topics type="attached">
         *             <!-- normal sub topics -->
         *         </topics>
         *         <topics type="detached">
         *             <!-- floating sub topics -->
         *         </topics>
         *     </children>
         * </topic>
         */
        each(this.doc.getElementsByTagName(CONST.TAG_CHILDREN), function(childrenNode) {
            each(childrenNode.getElementsByTagName(CONST.TAG_TOPICS), function(topicsNode) {
                var type = topicsNode.getAttribute(CONST.ATTR_TYPE);
                each(topicsNode.getElementsByTagName(CONST.TAG_TOPIC), function(doc) {
                    new Topic({
                        doc: doc,
                        sheet: this.sheet,
                        parent: this,
                        type: type,
                    });
                });
            });
        });
        return this;
    },
    // parent & child {
        getBranch: function() { // folded, etc
            return this.getAttribute(CONST.ATTR_BRANCH);
        },
        setBranch: function(value) {
            this.setAttribute(CONST.ATTR_BRANCH, value);
            return this.setModifiedTime();
        },
        setFolded: function() {
            this.setAttribute(CONST.ATTR_BRANCH, CONST.VAL_FOLDED);
            return this.setModifiedTime();
        },
        addChild: function(options/*instance or options*/) {
            this.setModifiedTime();
            if (options instanceof Topic) {
                options._addToParent(this);
                return options;
            } else {
                return new Topic(extend(options, {
                    parent: this
                }));
            }
        },
        removeChild: function(child/*id or instance*/, dryrun) {
            child = Topic.getTopic(child, this.sheet);
            if (child) {
                delete this.childById[child.id];
                this.children = difference(this.children, [child]);
                if (!dryrun) {
                    child.destroy();
                }
            }
            return this.setModifiedTime();
        },
        moveTo: function(targetTopic) {
            targetTopic = Topic.getTopic(targetTopic);
            if (targetTopic && !this.isRootTopic) {
                this.parent.removeChild(this, true);
                targetTopic.addChild(this);
            }
            return this.setModifiedTime();
        },
    // }
    // notes {
        getNotes: function() {
            var notesNode = utils.findChildNode(this.doc, CONST.TAG_NOTES);
            if (notesNode) {
                var plainNotesNode = utils.findChildNode(notesNode, CONST.PLAIN_FORMAT_NOTE);
                if (plainNotesNode) {
                    return plainNotesNode.textContent;
                }
            }
            return '';
        },
        setNotes: function(notes) {
            // TODO support styles
            if (!isString(notes)) {
                //throw 'notes must be a string!';
                return this;
            }
            var noteLines = notes.split('\n');
            var notesNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_NOTES);
            notesNode.textContent = tmplNotes({
                lines: noteLines,
                plainNotes: notes
            });
            return this.setModifiedTime();
        },
    // }
    // labels {
        getLabels: function() {
            var result = [];
            var labelsNode = utils.findChildNode(this.doc, CONST.TAG_LABELS);
            if (labelsNode && labelsNode.childNodes) {
                result = map(labelsNode.childNodes, function(labelNode) {
                    return labelNode.textContent;
                });
            }
            return result;
        },
        setLabels: function(labels) {
            if (isString(labels)) {
                labels = map(labels.split(','), function(label) {
                    return trim(label);
                });
            } else {
                labels = isArray(labels) ? labels : [labels];
            }
            var labelsNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_LABELS);
            labelsNode.textContent = tmplLabels({
                labels: labels
            });
            return this.setModifiedTime();
        },
    // }
    // hyperlink {
        getHyperlink: function() {
            return this.doc.getAttribute(CONST.ATTR_HREF);
        },
        setHyperlink: function(hyperlink) {
            /*
             * hyperlink which refers to one of these:
             *   - url
             *   - topic
             *   - file
             */
            this.setAttribute(CONST.ATTR_HREF, hyperlink);
            return this.setModifiedTime();
        },
        removeHyperlink: function() {
            this.removeAttribute(CONST.ATTR_HREF);
            return this.setModifiedTime();
        },
    // }
    // marker {
        // automatically add legends?
        getMarkers: function() {
            var result = [];
            var markersNode = utils.findChildNode(this.doc, CONST.TAG_MARKERREFS);
            if (markersNode) {
                utils.eachChildNode(markersNode, CONST.TAG_MARKERREF, {}, function(node) {
                    var id = node.getAttribute(CONST.ATTR_MARKERID);
                    if (id) {
                        result.push(id);
                    }
                });
            }
            return result;
        },
        setMarkers: function(markders) {
            if (!isArray(markders)) {
                //throw 'invalid markders';
                return this;
            }
            var markersNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_MARKERREFS);
            markersNode.textContent = tmplMarkers(markders);
            return this.setModifiedTime();
        },
        addMarker: function(id) {
            // an exception of `instance.addXXXX()`-formatted function
            // because there is not a constructor named `Marker`,
            // this function returns Topic instance instead
            var markersNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_MARKERREFS);
            var attrs = {};
            attrs[CONST.ATTR_MARKERID] = id;
            if (utils.findChildNode(this.doc, CONST.TAG_MARKERREF, attrs)) {
                //throw 'marker already exists!';
                return this;
            }
            var newMarkerNode = domParser.parseFromString(tmplMarker({
                id: id
            })).documentElement;
            markersNode.appendChild(newMarkerNode);
            return this.setModifiedTime();
        },
        removeMarker: function(id) {
            var markersNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_MARKERREFS);
            var attrs = {};
            attrs[CONST.ATTR_MARKERID] = id;
            utils.removeChildNode(markersNode, CONST.TAG_MARKERREF, attrs);
            return this.setModifiedTime();
        },
    // }
});

extend(Topic, {
    getTopic: function(topic/*index, id or instance*/, sheet) {
        if (isString(topic)) {
            topic = sheet.topicById[topic];
        } else if (!(topic instanceof Topic)) {
            topic = null;
        }
        return topic;
    }
});

module.exports = Topic;

