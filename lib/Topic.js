/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    each = pastry.each,
    extend = pastry.extend,
    uuid = pastry.uuid;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');

var CONST = require('./CONST');
var utils = require('./utils');

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
                id: uuid('topic-'),
                title: options.title,
                styleId: options.styleId,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
        }
        me.id = me.getAttribute('id');
        // xml structure {
            me.topicsType = getTopicsType(me); // attached or detached
            if (me.isRootTopic) {
                sheet.doc.appendChild(me.doc);
            } else {
                var parent = me.parent;
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
        // }
        // level, etc {
        // }
        sheet.topics.push(me);
        sheet.topicById[me.id] = me;
    },
    destroy: function() {
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
                var type = topicsNode.getAttribute('type');
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
    // sub topics {
        // ancestors
        // children
        // level
        // fold
        // etc
        // floating topic: only show ones belongs to root topic
    // }
    // notes {
        getNotes: function() {
        },
        addNote: function() {
        },
        removeNote: function() {
        },
    // }
    // labels {
        getLabels: function() {
        },
        addLabel: function() {
        },
        removeLabel: function() {
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
        getMarkers: function() {
        },
        addMarker: function() {
        },
        removeMarker: function() {
        },
    // }
});

module.exports = Topic;
