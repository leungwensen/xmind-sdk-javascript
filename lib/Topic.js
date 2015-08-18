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
    union = pastry.union,
    uniq = pastry.uniq,
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
         *      - id
         *      - title
         *      - structure
         *   // }
         *   // when loading from an existing one {
         *      - doc
         *   // }
         */
        var me = this;
        var sheet = options.sheet;

        extend(me, {
            isRootTopic: !options.parent,
            parent: options.parent,
            structure: options.structure,
            type: options.type,
            sheet: sheet,
            children: [],
            childById: {},
        });
        if (options.doc) {
            me.doc = options.doc;
            me._loadSubTopics();
        } else {
            me.doc = domParser.parseFromString(tmplTopic({
                id: options.id || uuid(NS),
                title: options.title,
                styleId: options.styleId || '',
            })).documentElement;
            me.setModifiedTime();
        }
        me.id = me.getAttribute(CONST.ATTR_ID);
        // xml structure {
            me._addToParent();
        // }
        // level, etc {
        // }
        sheet.topics = union(sheet.topics, [me]);
        sheet.topicById[me.id] = me;
    },
    _addToParent: function(parent) {
        var me = this;
        var sheet = me.sheet;
        if (me.isRootTopic) {
            sheet.doc.appendChild(me.doc);
            sheet.rootTopic = me;
        } else {
            parent = parent || me.parent;
            me.parent = parent; // if parent is defined, change it
            me.topicsType = getTopicsType(me, sheet); // attached or detached
            var parentDoc = parent.doc;
            var childrenNode = utils.findOrCreateChildNode(
                parentDoc, CONST.TAG_CHILDREN
            );
            var childrenTopicsNode = utils.findOrCreateChildNode(
                childrenNode, CONST.TAG_TOPICS, {
                    type: me.topicsType
                }
            ); // floating or not
            childrenTopicsNode.appendChild(me.doc);
            parent.children = union(parent.children, [me]);
            parent.childById[me.id] = me;
        }
    },
    destroy: function(force) {
        var me = this;
        var sheet = me.sheet;
        if (force || sheet.rootTopic !== me) { // cannot destroy root topic unless it is forced to
            each(me.children, function(child) {
                child.destroy();
            });
            DomMixin.prototype.destroy.apply(me);
            sheet.topics = difference(sheet.topics, [me]);
            delete sheet.topicById[me.id];
        }
    },
    toPlainObject: function() {
        var me = this;
        return {
            hyperlink: me.getHyperlink(),
            id: me.id,
            isRootTopic: me.isRootTopic,
            labels: me.getLabels(),
            markers: me.getMarkers(),
            modifiedTime: me.getModifiedTime(), // timestamp
            notes: me.getNotes(),
            parentId: me.parent ? me.parent.id : '',
            sheetId: me.sheet.id,
            structure: me.structure,
            title: me.getTitle(),
            type: me.type,
            children: map(me.children, function(child) {
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
        var me = this;
        var childrenNodes = utils.findChildNodes(me.doc, CONST.TAG_CHILDREN);
        each(childrenNodes, function(childrenNode) {
            var topicsNodes = utils.findChildNodes(childrenNode, CONST.TAG_TOPICS);
            each(topicsNodes, function(topicsNode) {
                var type = topicsNode.getAttribute(CONST.ATTR_TYPE);
                var topicNodes = utils.findChildNodes(topicsNode, CONST.TAG_TOPIC);
                each(topicNodes, function(doc) {
                    new Topic({
                        doc: doc,
                        sheet: me.sheet,
                        parent: me,
                        type: type,
                    });
                });
            });
        });
        return me;
    },
    // parent & child {
        getBranch: function() { // folded, etc
            return this.getAttribute(CONST.ATTR_BRANCH);
        },
        setBranch: function(value) {
            this.setAttribute(CONST.ATTR_BRANCH, value);
            return this.setModifiedTime();
        },
        setBranchFolded: function() {
            this.setAttribute(CONST.ATTR_BRANCH, CONST.VAL_FOLDED);
            return this.setModifiedTime();
        },
        addChild: function(options/*instance or options*/) {
            var me = this;
            me.setModifiedTime();
            if (options instanceof Topic) {
                options._addToParent(me);
                return options;
            } else {
                return new Topic(extend(options, {
                    parent: me,
                    sheet: me.sheet
                }));
            }
        },
        removeChild: function(child/*id or instance*/, dryrun) {
            var me = this;
            child = Topic.getTopic(child, me.sheet);
            if (child) {
                delete me.childById[child.id];
                me.children = difference(me.children, [child]);
                if (!dryrun) {
                    child.destroy();
                }
            }
            return me.setModifiedTime();
        },
        isAncestorOf: function(targetTopic) {
            var me = this;
            targetTopic = Topic.getTopic(targetTopic, me.sheet);
            var topic = targetTopic;
            while (topic.parent) {
                if (topic.parent === me) {
                    return true;
                }
                topic = topic.parent;
            }
            return false;
        },
        moveTo: function(targetTopic) {
            var me = this;
            targetTopic = Topic.getTopic(targetTopic, me.sheet);
            if (!targetTopic) {
                throw 'target topic does not exist';
            }
            if (me.isRootTopic) {
                throw 'cannot move root topic';
            }
            if (me === targetTopic) {
                throw 'cannot move to itself';
            }
            if (me.isAncestorOf(targetTopic)) {
                throw 'cannot move to a child topic';
            }
            me.parent.removeChild(me, true);
            targetTopic.addChild(me);
            return me.setModifiedTime();
        },
        //moveChild: function([>fromIndex, toIndex<]) {
            //TODO
        //},
    // }
    // floating, etc {
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
            var me = this;
            // TODO support styles
            if (!isString(notes)) {
                //throw 'notes must be a string!';
                return me;
            }
            var noteLines = notes.split('\n');
            utils.removeChildNode(me.doc, CONST.TAG_NOTES);
            var notesNode = domParser.parseFromString(tmplNotes({
                lines: noteLines,
                plainNotes: notes
            })).documentElement;
            me.doc.appendChild(notesNode);
            return me.setModifiedTime();
        },
    // }
    // labels {
        getLabels: function() {
            var result = [];
            var labelsNode = utils.findChildNode(this.doc, CONST.TAG_LABELS);
            result = map(utils.findChildNodes(labelsNode, CONST.TAG_LABEL), function(labelNode) {
                return labelNode.textContent;
            });
            return result;
        },
        setLabels: function(labels) {
            var me = this;
            if (isString(labels)) {
                labels = map(labels.split(','), function(label) {
                    return label;
                });
            } else {
                labels = isArray(labels) ? labels : [labels];
            }
            labels = map(labels, function(label) {
                return trim(label);
            });
            utils.removeChildNode(me.doc, CONST.TAG_LABELS);
            var labelsNode = domParser.parseFromString(tmplLabels({
                labels: labels
            })).documentElement;
            me.doc.appendChild(labelsNode);
            return me.setModifiedTime();
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
        setMarkers: function(markers) {
            var me = this;
            if (!isArray(markers)) {
                //throw 'invalid markers';
                return me;
            }
            markers = uniq(markers);
            utils.removeChildNode(me.doc, CONST.TAG_MARKERREFS);
            var markersNode = domParser.parseFromString(tmplMarkers({
                markers: markers
            })).documentElement;
            me.doc.appendChild(markersNode);
            return me.setModifiedTime();
        },
        addMarker: function(id) {
            // an exception of `instance.addXXXX()`-formatted function
            // because there is not a constructor named `Marker`,
            // this function returns Topic instance instead
            var me = this;
            var markersNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_MARKERREFS);
            var attrs = {};
            attrs[CONST.ATTR_MARKERID] = id;
            if (utils.findChildNode(me.doc, CONST.TAG_MARKERREF, attrs)) {
                throw 'marker already exists!';
            }
            var newMarkerNode = domParser.parseFromString(tmplMarker({
                id: id
            })).documentElement;
            markersNode.appendChild(newMarkerNode);
            return me.setModifiedTime();
        },
        removeMarker: function(id) {
            var me = this;
            var markersNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_MARKERREFS);
            var attrs = {};
            attrs[CONST.ATTR_MARKERID] = id;
            utils.removeChildNode(markersNode, CONST.TAG_MARKERREF, attrs);
            return me.setModifiedTime();
        },
    // }
});

extend(Topic, {
    getTopic: function(topic/*id or instance*/, sheet) {
        if (isString(topic)) {
            topic = sheet.topicById[topic];
        } else if (!(topic instanceof Topic)) {
            topic = null;
        }
        return topic;
    }
});

module.exports = Topic;

