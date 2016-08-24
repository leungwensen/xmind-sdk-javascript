'use strict';
/**
 * workbook module
 * @module workbook
 * @see module:index
 */
const JSZip = require('jszip');
const lang = require('zero-lang');
const CONST = require('./const');
const DomMixin = require('./dom-mixin');
const Sheet = require('./sheet');
const tmplContent = require('./template/content');
const tmplManifest = require('./template/manifest');
const tmplMeta = require('./template/meta');
const tmplStyles = require('./template/styles');
const utils = require('./utils');

class Workbook extends DomMixin {
  constructor(options) {
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
    super();
    const me = this;
    const defaultSheetName = utils.getDefaultSheetName(1);
    const defaultTopicName = utils.getDefaultTopicName('Root');

    options = options || {};
    lang.extend(me, {
      attachments: options.attachments || {},
      sheetById: {},
      sheets: [],
    });
    if (options.doc) { // create from xml docs
      me.doc = options.doc;
      me.stylesDoc = options.stylesDoc;
      me._loadSheets();
    } else { // create with first sheet & root topic
      me.doc = utils.parseFromString(tmplContent({
        timestamp: utils.getCurrentTimestamp()
      })).documentElement;
      me.stylesDoc = utils.parseFromString(tmplStyles()).documentElement;

      me.addSheet({
        id: options.firstSheetId,
        rootTopicId: options.rootTopicId,
        rootTopicName: options.rootTopicName || defaultTopicName,
        title: options.firstSheetName || defaultSheetName,
      });

      me.setModifiedTime();
    }
  }

  _loadSheets() {
    const me = this;
    utils.eachChildNode(me.doc, CONST.TAG_SHEET, {}, (childNode) => {
      new Sheet({ // create from node
        doc: childNode,
        workbook: me,
      });
    });
  }

  // sheet
  getPrimarySheet() {
    return this.sheets[0];
  }

  addSheet(options) {
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
    const me = this;
    options = options || {};
    me.setModifiedTime();
    lang.extend(options, {
      title: options.title || utils.getDefaultSheetName(),
      workbook: me,
    });
    return new Sheet(options);
  }

  moveSheet(fromIndex, toIndex) {
    const me = this;
    const doc = me.doc;
    const fromSheet = me.sheets[fromIndex];
    const toSheet = me.sheets[toIndex];
    if (fromSheet && toSheet) {
      // dom structure
      doc.removeChild(fromSheet.doc);
      doc.insertBefore(fromSheet.doc, toSheet.doc);
      // data structure
      lang.remove(me.sheets, fromIndex); // remove first
      me.sheets.splice(toIndex, 0, fromSheet); // insert to target position
    }
    return me.setModifiedTime();
  }

  removeSheet(sheet/* index or id or instance */) {
    const me = this;
    if (me.sheets.length <= 1) return; // primary sheet cannot be removed
    let index, id;
    if (lang.isNumber(sheet)) {
      sheet = me.sheets[sheet];
    } else if (lang.isString(sheet)) {
      sheet = me.sheetById[sheet];
    }
    index = lang.indexOf(me.sheets, sheet);
    id = sheet.id;
    sheet.destroy(); // first destroy, then delete
    delete me.sheetById[id];
    lang.remove(me.sheets, index);
    return me.setModifiedTime();
  }

  destroy() {
    // cannot destroy workbook instance?
  }

  toPlainObject() {
    const me = this;
    return {
      modifiedTime: me.getModifiedTime(), // timestamp
      sheets: lang.map(me.sheets, (sheet) => sheet.toPlainObject()),
    };
  }

  dump() {
    // TODO support embed markers
    const me = this;
    const zip = me.zip ? me.zip : new JSZip(); // keep the origin contents

    // content.xml
    zip.file(CONST.CONTENT_XML, utils.serializeToString(me.doc));
    // styles.xml
    zip.file(CONST.STYLES_XML, utils.serializeToString(me.stylesDoc));
    // meta.xml
    zip.file(CONST.META_XML, tmplMeta());
    // META-INF/manifest.xml
    zip.file(CONST.MANIFEST_XML, tmplManifest());
    // attachments/*
    lang.forIn(me.attachments, (content, filename) => {
      zip.file(CONST.ATTACHMENTS_DIR + filename, content);
    });
    me.zip = zip;
    return zip;
  }
}

lang.extend(Workbook, {
  load(data/* zip packed data */) {
    return new JSZip().loadAsync(data)
      .then((zip) => {
        const attachments = {};
        let doc, stylesDoc;

        lang.forIn(zip.files, (file, filename) => {
          filename = filename.replace(/^\//, '');
          if (filename === CONST.CONTENT_XML) {
            // content.xml
            doc = utils.parseFromString(
              zip.file(filename).asText()
            ).documentElement;
          } else if (filename === CONST.STYLES_XML) {
            // styles.xml
            stylesDoc = utils.parseFromString(
              zip.file(filename).asText()
            ).documentElement;
          } else if (filename.indexOf(CONST.ATTACHMENTS_DIR) === 0) {
            // attachments/*
            const shortName = filename.replace(CONST.ATTACHMENTS_DIR, '');
            attachments[shortName] = zip.file(filename).asText();
          }
        });
        if (!doc) throw 'invalid xmind file';
        const workbook = new Workbook({
          attachments: attachments,
          doc: doc,
          stylesDoc: stylesDoc,
        });
        workbook.zip = zip;
        console.log(workbook);

        return workbook;
      });
  }
});

module.exports = Workbook;
