/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    difference = pastry.difference,
    each = pastry.each,
    extend = pastry.extend,
    isString = pastry.isString,
    map = pastry.map,
    uuid = pastry.uuid;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');

var CONST = require('./CONST');
var utils = require('./utils');

var NS = 'topic-';

var tmplTopic = require('./template/topic');

function getTopicsType(topic) {
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
        me._addToParent();
        // xml structure {
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
            parentId: me.parent ? me.parent.id : '',
            structure: me.structure,
            type: me.type,
            sheetId: me.sheet.id,
            title: me.getTitle(),
            modifiedTime: me.getModifiedTime(), // timestamp
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
            return this.setAttribute(CONST.ATTR_BRANCH, value);
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
        },
        setNotes: function() {
        },
    // }
    // labels {
        getLabels: function() {
        },
        setLabels: function() {
        },
    // }
    // hyperlink {
        getHyperlink: function() {
        },
        setHyperlink: function() {
            /*
             * hyperlink which refers to one of these:
             *   - url
             *   - topic
             *   - file
             */
        },
        removeHyperlink: function() {
        },
    // }
    // marker {
        // automatically add legends?
        getMarkers: function() {
        },
        addMarker: function() {
        },
        removeMarker: function() {
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

