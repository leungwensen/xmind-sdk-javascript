'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
const fs = require('fs');
const lang = require('zero-lang');
const xmldom = require('xmldom');
const CONST = require('./const');
const DomMixin = require('./dom-mixin');
const Legend = require('./legend');
const Relationship = require('./relationship');
const Sheet = require('./sheet');
const Topic = require('./topic');
const Workbook = require('./workbook');
const utils = require('./utils');

const domParser = new xmldom.DOMParser();
const xmlSerializer = new xmldom.XMLSerializer();

lang.extend(utils, {
  parseFromString(str) {
    return domParser.parseFromString(str, 'text/xml');
  },
  serializeToString(doc) {
    return xmlSerializer.serializeToString(doc);
  },
});

lang.extend(Workbook, {
  open(filename) {
    return Workbook.load(fs.readFileSync(filename));
  },
  save(workbook, filename) {
    const zip = workbook.dump();

    const buffer = zip.generate({
      type: 'nodebuffer'
    });
    fs.writeFile(filename, buffer, (err) => {
      if (err) throw err;
    });
  }
});
lang.extend(Workbook.prototype, {
  save(filename) {
    Workbook.save(this, filename)
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
  utils: utils,
};
