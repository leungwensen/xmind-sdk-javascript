/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    extend = pastry.declare;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();
    //xmlSerializer = new xmldom.XMLSerializer();

var tmplContent = require('./template/content');
var tmplStyles = require('./template/styles');

var DomMixin = require('./DomMixin');
var Sheet = require('./Sheet');

var CONST = require('./CONST');
var utils = require('./utils');

var Workbook = declare(DomMixin, {
    constructor: function(options) {
        /*
         * options:
         *   // when creating a new one {
         *      firstSheetName, rootTopicName
         *   // }
         *   // when loading from an existing one {
         *      doc, stylesDoc, attachments
         *   // }
         */
        var me = this;

        var defaultSheetName = utils.getDefaultSheetName(1);
        var defaultTopicName = utils.getDefaultTopicName('Root');

        options = options || {
            firstSheetName: defaultSheetName,
            rootTopicName: defaultTopicName
        };
        extend(me, {
            attachments: options.attachments || {},
            // shortcuts to access sheets {
                sheets: [],
                sheetById: {},
            // }
        });
        if (options.doc) { // create from xml docs
            me.doc = options.doc;
            me.stylesDoc = options.stylesDoc;
            me._loadSheets();
        } else { // create with first sheet & root topic
            me.doc = domParser.parseFromString(tmplContent({
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
            me.stylesDoc = domParser.parseFromString(tmplStyles()).documentElement;

            var firstSheetName = options.firstSheetName || defaultSheetName;
            var rootTopicName = options.rootTopicName || defaultTopicName;
            me.addSheet(firstSheetName, rootTopicName);
        }
    },
    _loadSheets: function() {
        var me = this;
        me.eachChildNode(function(childNode) {
            if (childNode.tagName === CONST.TAG_SHEET) {
                new Sheet(this, { // create from node
                    doc: childNode
                });
            }
        });
    },
    addSheet: function(sheetName, rootTopicName, theme) {
        var me = this;
        return new Sheet(this, { // create from title and root topic name
            workbook: me,
            title: sheetName,
            rootTopicName: rootTopicName,
            theme: theme
        });
    },
    moveSheet: function() {
        // TODO
    },
    removeSheet: function() {
        // TODO
        var me = this;
        if (me.sheets.length <= 1) {
            return;
        }
    },
    getPrimarySheet: function() {
        return this.sheets[0];
    },
});

extend(Workbook, {
    open: function(/*filename*/) {
        // TODO
    },
    save: function(/*instance, filename*/) {
        // TODO
    }
});

module.exports = Workbook;
