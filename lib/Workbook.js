var lang = require('zero-lang');
var declare = require('zero-oop/declare');
var extend = lang.extend;
var indexOf = lang.indexOf;
var isNumber = lang.isNumber;
var isString = lang.isString;
var map = lang.map;
var remove = lang.remove;

var xmldom = require('xmldom');
var domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');
var Sheet = require('./Sheet');

var CONST = require('./CONST');
var utils = require('./utils');

var tmplContent = require('./template/content');
var tmplStyles = require('./template/styles');

var Workbook = declare('Workbook', DomMixin, {
    constructor: function (options) {
        /*
         * options:
         *   // when creating a new one {
         *      - firstSheetName
         *      - rootTopicName
         *   // }
         *   // when loading from an existing one {
         *      - doc
         *      - stylesDoc
         *      - attachments
         *   // }
         */
        var me = this;
        var defaultSheetName = utils.getDefaultSheetName(1);
        var defaultTopicName = utils.getDefaultTopicName('Root');

        options = options || {};
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
            }, lang)).documentElement;
            me.stylesDoc = domParser.parseFromString(tmplStyles()).documentElement;

            me.addSheet({
                id: options.firstSheetId,
                title: options.firstSheetName || defaultSheetName,
                rootTopicId: options.rootTopicId,
                rootTopicName: options.rootTopicName || defaultTopicName
            });

            me.setModifiedTime();
        }
    },
    _loadSheets: function () {
        var me = this;
        utils.eachChildNode(me.doc, CONST.TAG_SHEET, {}, function (childNode) {
            new Sheet({ // create from node
                workbook: me,
                doc: childNode
            });
        });
    },
    // sheet {
    getPrimarySheet: function () {
        return this.sheets[0];
    },
    addSheet: function (options) {
        /*
         * options: {
         *    workbook: this,
         *    title: options.sheetName,
         *    id: options.sheetId,
         *    rootTopicName: options.rootTopicName,
         *    rootTopicId: options.rootTopicId,
         *    theme: options.theme
         * }
         */
        var me = this;
        options = options || {};
        me.setModifiedTime();
        extend(options, {
            workbook: me,
            title: options.title || utils.getDefaultSheetName()
        });
        return new Sheet(options);
    },
    moveSheet: function (fromIndex, toIndex) {
        var me = this;
        var doc = me.doc;
        var fromSheet = me.sheets[fromIndex],
            toSheet = me.sheets[toIndex];
        if (fromSheet && toSheet) {
            // dom structure
            doc.removeChild(fromSheet.doc);
            doc.insertBefore(fromSheet.doc, toSheet.doc);
            // data structure
            remove(me.sheets, fromIndex); // remove first
            me.sheets.splice(toIndex, 0, fromSheet); // insert to target position
        }
        return me.setModifiedTime();
    },
    removeSheet: function (sheet/* index or id or instance */) {
        var me = this;
        if (me.sheets.length <= 1) {
            return; // primary sheet cannot be removed
        }
        var index, id;
        if (isNumber(sheet)) {
            sheet = me.sheets[sheet];
        } else if (isString(sheet)) {
            sheet = me.sheetById[sheet];
        }
        index = indexOf(me.sheets, sheet);
        id = sheet.id;
        sheet.destroy(); // first destroy, then delete
        delete me.sheetById[id];
        remove(me.sheets, index);
        return me.setModifiedTime();
    },
    // }
    destroy: function () {
        // cannot destroy workbook instance?
    },
    toPlainObject: function () {
        var me = this;
        return {
            sheets: map(me.sheets, function (sheet) {
                return sheet.toPlainObject();
            }),
            modifiedTime: me.getModifiedTime() // timestamp
        };
    },
});

module.exports = Workbook;

