/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    difference = pastry.difference,
    each = pastry.each,
    extend = pastry.extend,
    isNumber = pastry.isNumber,
    isString = pastry.isString,
    map = pastry.map,
    toArray = pastry.toArray,
    uuid = pastry.uuid;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');
var Topic = require('./Topic');
var Relationship = require('./Relationship');
var Legend = require('./Legend');

var CONST = require('./CONST');
var utils = require('./utils');

var NS = 'sheet-';

var tmplSheet = require('./template/sheet');

var Sheet = declare('Sheet', DomMixin, {
    constructor: function(options) {
        /*
         * options:
         *   - workbook(required)
         *   // when creating a new one {
         *      - title
         *      - rootTopicName
         *      - theme
         *   // }
         *   // when loading from an existing one {
         *      - doc
         *   // }
         */
        var me = this,
            workbook = options.workbook;

        extend(me, {
            workbook: workbook,
            rootTopic: null,
            topics: [],
            topicById: {},
            relationships: [],
            relationshipById: {},
            legend: null,
        });
        if (options.doc) {
            me.doc = options.doc;
            me._loadLegend()
                ._loadRootTopic()
                ._loadRelationships();
        } else {
            me.doc = domParser.parseFromString(tmplSheet({
                id: uuid(NS),
                title: options.title,
                theme: options.theme,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
            // xml structure {
                workbook.doc.appendChild(me.doc);
            // }
            me.addRootTopic(options.rootTopicName);
        }
        extend(me, {
            id: me.getAttribute(CONST.ATTR_ID)
        });
        workbook.sheets.push(me);
        workbook.sheetById[me.id] = me;
    },
    destroy: function() {
        // TODO
        // NOTE: the last sheet cannot be deleted
    },
    toPlainObject: function() {
        var me = this;
        return {
            id: me.id,
            theme: me.getTheme(),
            title: me.getTitle(),
            modifiedTime: me.getModifiedTime(), // timestamp
            topics: map(me.topics, function(topic) {
                return topic.toPlainObject();
            }),
            relationships: map(me.relationships, function(relationship) {
                return relationship.toPlainObject();
            }),
            legend: me.legend ? me.legend.toPlainObject() : null
        };
    },
    _loadLegend: function() {
        var me = this;
        var legenNode = me.doc.getElementsByTagName(CONST.TAG_LEGEND)[0];
        if (legenNode) {
            new Legend({
                sheet: me,
                doc: legenNode
            });
        }
        return me;
    },
    _loadRootTopic: function() {
        var me = this;
        var rootTopicNode = utils.findChildNode(
            me.doc,
            CONST.TAG_TOPIC
        );
        if (rootTopicNode) {
            new Topic({
                sheet: me,
                doc: rootTopicNode,
            });
        } else {
            me.addRootTopic(); // fix xmind file
        }
        return me;
    },
    _loadRelationships: function() {
        var me = this;
        var relationshipsNode = me.doc.getElementsByTagName(CONST.TAG_RELATIONSHIPS)[0];
        if (relationshipsNode) {
            me.relationshipsNode = relationshipsNode;
            each(relationshipsNode.childNodes, function(childNode) {
                new Relationship({
                    sheet: me,
                    doc: childNode
                });
            });
        }
        return me;
    },
    // theme {
        getTheme: function() {
            return this.getAttribute(CONST.ATTR_THEME);
        },
        setTheme: function(theme) {
            var me = this;
            this.setAttribute(CONST.ATTR_THEME, theme);
            return me;
        },
    // }
    // topics {
        getRootTopic: function() {
            return this.rootTopic;
        },
        addRootTopic: function(topicName) {
            var me = this;
            if (me.rootTopic) {
                //throw 'root topic already exists';
            } else {
                return new Topic({
                    sheet: me,
                    title: topicName || utils.getDefaultTopicName('Root'),
                });
            }
        },
        removeTopic: function(topic/*index, id or instance*/) {
            var me = this;
            topic = Topic.getTopic(topic, me);
            if (topic) {
                if (topic.parent) {
                    topic.parent.removeChild(topic);
                } else {
                    //throw 'root topic cannot be removed!';
                }
            }
            return me;
        },
    // }
    // legend {
        addLegend: function() {
            var me = this;
            if (me.legend) {
                //throw 'legend already exists';
            } else {
                return new Legend({
                    sheet: me
                });
            }
        },
        removeLegend: function() {
            var me = this;
            if (me.legend) {
                me.legend.destroy();
                me.legend = null;
            }
            return me;
        },
        addMarkerDescription: function(markerId, description) {
            var me = this;
            if (!me.legend) {
                me.addLegend();
            }
            return me.legend.addMarkerDescription(markerId, description);
        },
        removeMarkerDescription: function(markerId) {
            var me = this;
            if (!me.legend) {
                return;
            } else {
                me.legend.removeMarkerDescription(markerId);
            }
            return me;
        },
    // }
    // relationship {
        addRelationship: function(sourceId, targetId) {
            var me = this;
            me.relationshipsNode = utils.findOrCreateChildNode(
                me.doc,
                CONST.TAG_RELATIONSHIPS
            );
            var attrs = {};
            attrs[CONST.ATTR_END1] = sourceId;
            attrs[CONST.ATTR_END2] = targetId;
            var addedNode = utils.findChildNode(
                me.relationshipsNode,
                CONST.TAG_RELATIONSHIP,
                attrs
            );
            if (addedNode) {
                //throw 'relation already exist!';
            } else {
                return new Relationship({
                    sheet: me,
                    sourceId: sourceId,
                    targetId: targetId
                });
            }
        },
        removeRelationship: function(/* index, id, instance or sourceId, targetId*/) {
            var me = this;
            var relationship;
            var args = toArray(arguments);
            if (args.length === 1) {
                relationship = args[0];
                if (!(relationship instanceof Relationship)) {
                    if (isNumber(relationship)) {
                        relationship = me.relationships[relationship];
                    } else if (isString(relationship)) {
                        relationship = me.relationshipById[relationship];
                    }
                }
            } else {
                var sourceId = args[0];
                var targetId = args[1];
                var attrs = {};
                attrs[CONST.ATTR_END1] = sourceId;
                attrs[CONST.ATTR_END2] = targetId;
                var relationshipNode = utils.findChildNode(
                    me.relationshipsNode,
                    CONST.TAG_RELATIONSHIP,
                    attrs
                );
                if (relationshipNode) {
                    relationship = me.relationshipById[
                        relationshipNode.getAttribute(CONST.ATTR_ID)
                    ];
                }
            }
            if (relationship) {
                delete me.relationshipById[relationship.id];
                me.relationships = difference(me.relationships, [relationship]);
                relationship.destroy();
            }
            return me;
        },
    // }
});

module.exports = Sheet;

