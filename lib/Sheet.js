/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    extend = pastry.extend,
    uuid = pastry.uuid;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');
var Topic = require('./Topic');

var CONST = require('./CONST');
var utils = require('./utils');

var tmplSheet = require('./template/sheet');

var Sheet = declare('Sheet', DomMixin, {
    constructor: function(options) {
        /*
         * options:
         *   // required {
         *      workbook
         *   // }
         *   // when creating a new one {
         *      title, rootTopicName, theme
         *   // }
         *   // when loading from an existing one {
         *      doc
         *   // }
         */
        var me = this,
            workbook = options.workbook;

        extend(me, {
            workbook: workbook,
            topics: [],
            topicById: {},
        });
        if (options.doc) {
            me.doc = options.doc;
            me._loadLegends()
                ._loadRootTopics()
                ._loadRelationships();
        } else {
            me.doc = domParser.parseFromString(tmplSheet({
                id: uuid('sheet-'),
                title: options.title,
                theme: options.theme,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
            // xml structure {
                workbook.doc.appendChild(me.doc);
            // }
            me.addRootTopic(options.rootTopicName || utils.getDefaultTopicName('Root'));
        }
        me.id = me.getAttribute('id');
        workbook.sheets.push(me);
        workbook.sheetById[me.id] = me;
    },
    destroy: function() {
        // NOTE: the last sheet cannot be deleted
    },
    _loadRootTopics: function() {
        var me = this;
        me.eachChildNode(function(childNode) {
            if (childNode.tagName === CONST.TAG_TOPIC) {
                new Topic({
                    sheet: me,
                    doc: childNode,
                });
            }
        });
        return me;
    },
    _loadLegends: function() {
        var me = this;
        return me;
    },
    _loadRelationships: function() {
        var me = this;
        return me;
    },
    // topics {
        getPrimaryRootTopic: function() {
            // TODO can there be more than one root topics?
            return this.rootTopics[0];
        },
        addRootTopic: function(topicName) {
            var me = this;
            return new Topic({
                sheet: me,
                title: topicName,
            });
        },
        removeRootTopic: function() {
        },
    // }
    // legend {
        addLegend: function() {
        },
    // }
    // relationship {
        addRelationship: function() {
        },
    // }
});

module.exports = Sheet;
