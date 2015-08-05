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
        var defaultSheetName = utils.getDefaultSheetName(1);
        var defaultTopicName = utils.getDefaultTopicName('Root');

        options = options || {};
        extend(this, {
            attachments: options.attachments || {},
            // shortcuts to access sheets {
                sheets: [],
                sheetById: {},
            // }
        });
        if (options.doc) { // create from xml docs
            this.doc = options.doc;
            this.stylesDoc = options.stylesDoc;
            this._loadSheets();
        } else { // create with first sheet & root topic
            this.doc = domParser.parseFromString(tmplContent({
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
            this.stylesDoc = domParser.parseFromString(tmplStyles()).documentElement;

            this.addSheet({
                id: options.firstSheetId,
                title: options.firstSheetName || defaultSheetName,
                rootTopicId: options.rootTopicId,
                rootTopicName: options.rootTopicName || defaultTopicName
            });

            this.setModifiedTime();
        }
    },
    _loadSheets: function() {
        this.eachChildNode(function(childNode) {
            if (childNode.tagName === CONST.TAG_SHEET) {
                new Sheet({ // create from node
                    workbook: this,
                    doc: childNode
                });
            }
        });
    },
    // sheet {
        getPrimarySheet: function() {
            return this.sheets[0];
        },
        addSheet: function(options) {
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
            options = options || {};
            this.setModifiedTime();
            extend(options, {
                workbook: this,
                title: options.title || utils.getDefaultSheetName()
            });
            return new Sheet(options);
        },
        moveSheet: function(fromIndex, toIndex) {
            var doc = this.doc;
            var fromSheet = this.sheets[fromIndex],
                toSheet = this.sheets[toIndex];
            if (fromSheet && toSheet) {
                // dom structure
                doc.removeChild(fromSheet.doc);
                doc.insertBefore(fromSheet.doc, toSheet.doc);
                // data structure
                remove(this.sheets, fromIndex); // remove first
                this.sheets.splice(toIndex, 0, fromSheet); // insert to target position
            }
            return this.setModifiedTime();
        },
        removeSheet: function(sheet/* index or id or instance */) {
            if (this.sheets.length <= 1) {
                return; // primary sheet cannot be removed
            }
            var index, id;
            if (isNumber(sheet)) {
                sheet = this.sheets[sheet];
            } else if (isString(sheet)) {
                sheet = this.sheetById[sheet];
            }
            index = indexOf(this.sheets, sheet);
            id = sheet.id;
            sheet.destroy(); // first destroy, then delete
            delete this.sheetById[id];
            remove(this.sheets, index);
            return this.setModifiedTime();
        },
    // }
    destroy: function() {
        // cannot destroy workbook instance?
    },
    toPlainObject: function() {
        return {
            sheets: map(this.sheets, function(sheet) {
                return sheet.toPlainObject();
            }),
            modifiedTime: this.getModifiedTime() // timestamp
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

