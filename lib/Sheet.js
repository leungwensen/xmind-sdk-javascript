/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    extend = pastry.extend,
    uuid = pastry.uuid;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var tmplSheet = require('./template/sheet');

var DomMixin = require('./DomMixin');
var Topic = require('./Topic');

var CONST = require('./CONST');
var utils = require('./utils');

var Sheet = declare(DomMixin, {
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
            rootTopics: [],
            rootTopicById: {},
        });
        if (options.doc) {
            me.doc = options.doc;
            me._loadRootTopics();
        } else {
            me.doc = domParser.parseFromString(tmplSheet({
                id: uuid('sheet-'),
                title: options.title,
                theme: options.theme,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
            workbook.doc.appendChild(me.doc);
            me.addRootTopic(options.rootTopicName || utils.getDefaultTopicName('Root'));
        }
        me.id = me.getAttribute('id');
        workbook.sheets.push(me);
        workbook.sheetById[me.id] = me;
    },
    _loadRootTopics: function() {
        var me = this;
        me.eachChildNode(function(childNode) {
            if (childNode.tagName === CONST.TAG_TOPIC) {
                new Topic(this, {
                    sheet: me,
                    doc: childNode,
                });
            }
        });
    },
    _loadLegends: function() {
    },
    addRootTopic: function(topicName) {
        var me = this;
        return new Topic({
            sheet: me,
            topicName: topicName,
        });
    },
    getPrimaryRootTopic: function() {
        return this.rootTopics[0];
    },
    destroy: function() {
        // NOTE: the last sheet cannot be deleted
    }
});

module.exports = Sheet;
