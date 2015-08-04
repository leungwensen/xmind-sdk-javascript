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
        var workbook = options.workbook;

        extend(this, {
            workbook: workbook,
            rootTopic: null,
            topics: [],
            topicById: {},
            relationships: [],
            relationshipById: {},
            legend: null,
        });
        if (options.doc) {
            this.doc = options.doc;
            this._loadLegend()
                ._loadRootTopic()
                ._loadRelationships();
        } else {
            this.doc = domParser.parseFromString(tmplSheet({
                id: options.id || uuid(NS),
                title: options.title,
                theme: options.theme,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
            // xml structure {
                workbook.doc.appendChild(this.doc);
            // }
            this.addRootTopic(options.rootTopicName);
        }
        extend(this, {
            id: this.getAttribute(CONST.ATTR_ID)
        });
        workbook.sheets.push(this);
        workbook.sheetById[this.id] = this;
    },
    destroy: function() {
        // TODO
        // NOTE: the last sheet cannot be deleted
        var workbook = this.workbook;
        if (workbook.sheets.length <= 1) {
            throw 'cannot destroy the last sheet!';
        } else {
            each(this.topics, function(topic) {
                topic.destroy(true);
            });
            each(this.relationships, function(relationship) {
                relationship.destroy();
            });
            this.legend.destroy();
            DomMixin.destroy.apply(this);
        }
    },
    toPlainObject: function() {
        return {
            id: this.id,
            theme: this.getTheme(),
            title: this.getTitle(),
            modifiedTime: this.getModifiedTime(), // timestamp
            topics: map(this.topics, function(topic) {
                return topic.toPlainObject();
            }),
            relationships: map(this.relationships, function(relationship) {
                return relationship.toPlainObject();
            }),
            legend: this.legend ? this.legend.toPlainObject() : null
        };
    },
    _loadLegend: function() {
        var legenNode = this.doc.getElementsByTagName(CONST.TAG_LEGEND)[0];
        if (legenNode) {
            new Legend({
                sheet: this,
                doc: legenNode
            });
        }
        return this;
    },
    _loadRootTopic: function() {
        var rootTopicNode = utils.findChildNode(
            this.doc,
            CONST.TAG_TOPIC
        );
        if (rootTopicNode) {
            new Topic({
                sheet: this,
                doc: rootTopicNode,
            });
        } else {
            this.addRootTopic(); // fix xmind file
        }
        return this;
    },
    _loadRelationships: function() {
        var relationshipsNode = this.doc.getElementsByTagName(CONST.TAG_RELATIONSHIPS)[0];
        if (relationshipsNode) {
            this.relationshipsNode = relationshipsNode;
            each(relationshipsNode.childNodes, function(childNode) {
                new Relationship({
                    sheet: this,
                    doc: childNode
                });
            });
        }
        return this;
    },
    // theme {
        getTheme: function() {
            return this.getAttribute(CONST.ATTR_THEME);
        },
        setTheme: function(theme) {
            this.setAttribute(CONST.ATTR_THEME, theme);
            return this.setModifiedTime();
        },
    // }
    // topics {
        getRootTopic: function() {
            return this.rootTopic;
        },
        addRootTopic: function(topicName) {
            if (this.rootTopic) {
                //throw 'root topic already exists';
                return this.rootTopic;
            } else {
                this.setModifiedTime();
                return new Topic({
                    sheet: this,
                    title: topicName || utils.getDefaultTopicName('Root'),
                });
            }
        },
        removeTopic: function(topic/*id or instance*/) {
            topic = Topic.getTopic(topic, this);
            if (topic) {
                if (topic.parent) {
                    topic.parent.removeChild(topic);
                    return this.setModifiedTime();
                } else {
                    //throw 'root topic cannot be removed!';
                }
            }
            return this;
        },
    // }
    // legend {
        addLegend: function() {
            if (this.legend) {
                //throw 'legend already exists';
                return this.legend;
            } else {
                this.setModifiedTime();
                return new Legend({
                    sheet: this
                });
            }
        },
        removeLegend: function() {
            if (this.legend) {
                this.legend.destroy();
                this.legend = null;
                return this.setModifiedTime();
            }
            return this;
        },
        addMarkerDescription: function(markerId, description) {
            if (!this.legend) {
                this.addLegend();
            }
            return this.legend.addMarkerDescription(markerId, description);
        },
        removeMarkerDescription: function(markerId) {
            if (!this.legend) {
                return this;
            } else {
                this.legend.removeMarkerDescription(markerId);
                return this;
            }
        },
    // }
    // relationship {
        addRelationship: function(sourceId, targetId, title) {
            this.relationshipsNode = utils.findOrCreateChildNode(
                this.doc,
                CONST.TAG_RELATIONSHIPS
            );
            var attrs = {};
            attrs[CONST.ATTR_END1] = sourceId;
            attrs[CONST.ATTR_END2] = targetId;
            var addedNode = utils.findChildNode(
                this.relationshipsNode,
                CONST.TAG_RELATIONSHIP,
                attrs
            );
            if (addedNode) {
                //throw 'relation already exist!';
                return this.relationshipById[addedNode.getAttribute(CONST.ATTR_ID)];
            } else {
                this.setModifiedTime();
                return new Relationship({
                    sheet: this,
                    sourceId: sourceId,
                    targetId: targetId,
                    title: title
                });
            }
        },
        removeRelationship: function(/*index, id, instance or sourceId, targetId*/) {
            var relationship;
            var args = toArray(arguments);
            if (args.length === 1) {
                relationship = args[0];
                if (!(relationship instanceof Relationship)) {
                    if (isNumber(relationship)) {
                        relationship = this.relationships[relationship];
                    } else if (isString(relationship)) {
                        relationship = this.relationshipById[relationship];
                    }
                }
            } else {
                var sourceId = args[0];
                var targetId = args[1];
                var attrs = {};
                attrs[CONST.ATTR_END1] = sourceId;
                attrs[CONST.ATTR_END2] = targetId;
                var relationshipNode = utils.findChildNode(
                    this.relationshipsNode,
                    CONST.TAG_RELATIONSHIP,
                    attrs
                );
                if (relationshipNode) {
                    relationship = this.relationshipById[
                        relationshipNode.getAttribute(CONST.ATTR_ID)
                    ];
                }
            }
            if (relationship) {
                delete this.relationshipById[relationship.id];
                this.relationships = difference(this.relationships, [relationship]);
                relationship.destroy();
                return this.setModifiedTime();
            }
            return this;
        },
    // }
});

module.exports = Sheet;

