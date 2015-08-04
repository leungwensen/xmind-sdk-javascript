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
        var me = this,
            sheet = options.sheet;

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
                id: uuid(NS),
                title: options.title,
                styleId: options.styleId,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
        }
        me.id = me.getAttribute(CONST.ATTR_ID);
        // xml structure {
            me._addToParent();
        // }
        // level, etc {
        // }
        sheet.topics.push(me);
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
            me.topicsType = getTopicsType(me); // attached or detached
            var parentDoc = parent.doc,
                childrenNode = utils.findOrCreateChildNode(
                    parentDoc, CONST.TAG_CHILDREN
                ),
                childrenTopicsNode = utils.findOrCreateChildNode(
                    childrenNode, CONST.TAG_TOPICS, {
                        type: me.topicsType
                    }
                );
            childrenTopicsNode.appendChild(me.doc);
            parent.children.push(me);
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
            sheet.topics = difference(sheet.topics, [me]);
            delete sheet.topicById[me.id];
            DomMixin.destroy.apply(me);
        }
    },
    toPlainObject: function() {
        var me = this;
        return {
            id: me.id,
            isRootTopic: me.isRootTopic,
            modifiedTime: me.getModifiedTime(), // timestamp
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
        var me = this;
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
        each(me.doc.getElementsByTagName(CONST.TAG_CHILDREN), function(childrenNode) {
            each(childrenNode.getElementsByTagName(CONST.TAG_TOPICS), function(topicsNode) {
                var type = topicsNode.getAttribute(CONST.ATTR_TYPE);
                each(topicsNode.getElementsByTagName(CONST.TAG_TOPIC), function(doc) {
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
            return this;
        },
        setFolded: function() {
            this.setAttribute(CONST.ATTR_BRANCH, CONST.VAL_FOLDED);
            return this;
        },
        addChild: function(options/*instance or options*/) {
            var me = this;
            if (options instanceof Topic) {
                options._addToParent(me);
            } else {
                new Topic(extend(options, {
                    parent: me
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
            return me;
        },
        moveTo: function(targetTopic) {
            var me = this;
            targetTopic = Topic.getTopic(targetTopic);
            if (targetTopic && !me.isRootTopic) {
                me.parent.removeChild(me, true);
                targetTopic.addChild(me);
            }
        },
    // }
    // notes {
        getNotes: function() {
            var me = this;
            var notesNode = utils.findChildNode(me.doc, CONST.TAG_NOTES);
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
            var me = this;
            if (!isString(notes)) {
                return me;
            }
            var noteLines = notes.split('\n');
            var notesNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_NOTES);
            notesNode.textContent = tmplNotes({
                lines: noteLines,
                plainNotes: notes
            });
            return me;
        },
    // }
    // labels {
        getLabels: function() {
            var me = this;
            var result = [];
            var labelsNode = utils.findChildNode(me.doc, CONST.TAG_LABELS);
            if (labelsNode && labelsNode.childNodes) {
                result = map(labelsNode.childNodes, function(labelNode) {
                    return labelNode.textContent;
                });
            }
            return result;
        },
        setLabels: function(labels) {
            var me = this;
            if (isString(labels)) {
                labels = map(labels.split(','), function(label) {
                    return trim(label);
                });
            } else {
                labels = isArray(labels) ? labels : [labels];
            }
            var labelsNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_LABELS);
            labelsNode.textContent = tmplLabels({
                labels: labels
            });
            return me;
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
            return this;
        },
        removeHyperlink: function() {
            this.removeAttribute(CONST.ATTR_HREF);
            return this;
        },
    // }
    // marker {
        // automatically add legends?
        getMarkers: function() {
            var me = this;
            var result = [];
            var markersNode = utils.findChildNode(me.doc, CONST.TAG_MARKERREFS);
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
            var me = this;
            if (!isArray(markders)) {
                //throw 'invalid markders';
                return me;
            }
            var markersNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_MARKERREFS);
            markersNode.textContent = tmplMarkers(markders);
            return me;
        },
        addMarker: function(id) {
            var me = this;
            var markersNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_MARKERREFS);
            var attrs = {};
            attrs[CONST.ATTR_MARKERID] = id;
            if (utils.findChildNode(me.doc, CONST.TAG_MARKERREF, attrs)) {
                //throw 'marker already exists!';
                return me;
            }
            var newMarkerNode = domParser.parseFromString(tmplMarker({
                id: id
            })).documentElement;
            markersNode.appendChild(newMarkerNode);
            return me;
        },
        removeMarker: function(id) {
            var me = this;
            var markersNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_MARKERREFS);
            var attrs = {};
            attrs[CONST.ATTR_MARKERID] = id;
            utils.removeChildNode(markersNode, CONST.TAG_MARKERREF, attrs);
            return me;
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

