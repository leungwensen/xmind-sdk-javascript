/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    each = pastry.each,
    extend = pastry.extend;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser(),
    xmlSerializer = new xmldom.XMLSerializer();

var JSZip = require('jszip');

var saveAs = require('./FileSaver/FileSaver').saveAs;

var CONST = require('./CONST');
var DomMixin = require('./DomMixin');
var Legend = require('./Legend');
var Relationship = require('./Relationship');
var Sheet = require('./Sheet');
var Topic = require('./Topic');
var Workbook = require('./Workbook');
var utils = require('./utils');

var tmplMeta = require('./template/meta');
var tmplManifest = require('./template/manifest');

extend(Workbook, {
    open: function(data) {
        var zip = new JSZip(data);

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
            } else if (filename.indexOf(CONST.ATTACHMENTS_DIR) === 0) {
                // attachments/*
                var shortName = filename.replace(CONST.ATTACHMENTS_DIR, '');
                attachments[shortName] = zip.file(filename).asText();
            }
        });
        if (!doc) {
            throw 'invalid xmind file';
        }
        var workbook = new Workbook({
            doc: doc,
            stylesDoc: stylesDoc,
            attachments: attachments
        });
        workbook.zip = zip;
        return workbook;
    },
    save: function(workbook, filename) {
        // TODO support embed markers
        var zip = workbook.zip ? workbook.zip : new JSZip(); // keep the origin contents

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

        workbook.zip = zip;

        var content = zip.generate({
            type: 'blob'
        });
        saveAs(content, filename);
    }
});

module.exports = {
    CONST: CONST,
    DomMixin: DomMixin,
    Legend: Legend,
    Relationship: Relationship,
    Sheet: Sheet,
    Topic: Topic,
    Workbook: Workbook,
    open: Workbook.open,
    save: Workbook.save,
    utils: utils
};

