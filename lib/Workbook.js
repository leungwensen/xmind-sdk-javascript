/* jshint undef: true, unused: true */
/* global require, module */

var fs = require('fs');

var pastry = require('pastry'),
    declare = pastry.declare,
    each = pastry.each,
    extend = pastry.extend,
    indexOf = pastry.indexOf,
    isNumber = pastry.isNumber,
    isString = pastry.isString,
    map = pastry.map,
    remove = pastry.remove;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser(),
    xmlSerializer = new xmldom.XMLSerializer();

var JSZip = require('jszip');

var DomMixin = require('./DomMixin');
var Sheet = require('./Sheet');

var CONST = require('./CONST');
var utils = require('./utils');

var tmplContent = require('./template/content');
var tmplStyles = require('./template/styles');

var tmplMeta = require('./template/meta');
var tmplManifest = require('./template/manifest');

var Workbook = declare('Workbook', DomMixin, {
    constructor: function(options) {
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
                new Sheet({ // create from node
                    workbook: me,
                    doc: childNode
                });
            }
        });
    },
    // sheet {
        getPrimarySheet: function() {
            return this.sheets[0];
        },
        addSheet: function(sheetName, rootTopicName, theme) {
            var me = this;
            return new Sheet({ // create from title and root topic name
                workbook: me,
                title: sheetName,
                rootTopicName: rootTopicName,
                theme: theme
            });
        },
        moveSheet: function(fromIndex, toIndex) {
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
        },
        removeSheet: function(sheet/* index or id or instance */) {
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
            delete me.sheetById[id];
            remove(me.sheets, index);
            sheet.destroy();
        },
    // }
    destroy: function() {
        // cannot destroy workbook instance?
    },
    toPlainObject: function() {
        var me = this;
        return {
            sheets: map(me.sheets, function(sheet) {
                return sheet.toPlainObject();
            }),
            modifiedTime: me.getModifiedTime() // timestamp
        };
    },
    save: function(filename) {
        Workbook.save(this, filename);
    }
});

extend(Workbook, {
    open: function(filename) {
        var data = fs.readFileSync(filename),
            zip = new JSZip(data);

        var doc,
            stylesDoc,
            attachments = {};

        each(zip.files, function(file, filename) {
            if (filename === CONST.CONTENT_XML) {
                // content.xml
                doc = domParser.parseFromString(
                    zip.file(filename).asText()
                ).documentElement;
            } else if (filename === CONST.STYLES_XML) {
                // styles.xml
                stylesDoc = domParser.parseFromString(
                    zip.file(filename).asText()
                ).documentElement;
            } else if (filename.indexOf(CONST.ATTACHMENTS_DIR)) {
                // attachments/*
                var shortName = filename.replace(CONST.ATTACHMENTS_DIR, '');
                attachments[shortName] = zip.file(filename).asText();
            }
        });
        if (!doc) {
            throw 'invalid xmind file';
        }
        return new Workbook({
            doc: doc,
            stylesDoc: stylesDoc,
            attachments: attachments
        });
    },
    save: function(workbook, filename) {
        // TODO support embed markers
        var data;
        try {
            data = fs.readFileSync(filename);
        } catch(e) {
        }
        var zip = new JSZip(data); // in case filename is an existing file
        // content.xml
        zip.file(CONST.CONTENT_XML, xmlSerializer.serializeToString(workbook.doc));
        // styles.xml
        zip.file(CONST.STYLES_XML, xmlSerializer.serializeToString(workbook.stylesDoc));
        // meta.xml
        zip.file(CONST.META_XML, tmplMeta());
        // META-INF/manifest.xml
        zip.file(CONST.MANIFEST_XML, tmplManifest());
        // attachments/*
        each(workbook.attachments, function(content, filename) {
            zip.file(CONST.ATTACHMENTS_DIR + filename, content);
        });

        var buffer = zip.generate({
            type: 'nodebuffer'
        });
        fs.writeFile(filename, buffer, function(err) {
            if (err) {
                throw err;
            }
        });
    }
});

module.exports = Workbook;

