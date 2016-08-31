'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
const lang = require('zero-lang');
const xmlLite = require('xml-lite/lib/index-browser');
const saveAs = require('filesaver.js').saveAs;
const CONST = require('./const');
const DomMixin = require('./dom-mixin');
const Legend = require('./legend');
const Relationship = require('./relationship');
const Sheet = require('./sheet');
const Topic = require('./topic');
const Workbook = require('./workbook');
const utils = require('./utils');

lang.extend(utils, xmlLite);

lang.extend(Workbook, {
  open(data) {
    return Workbook.load(data);
  },
  save(workbook, filename) {
    const zip = workbook.dump();
    const content = zip.generate({
      type: 'blob'
    });
    saveAs(content, filename);
  }
});
lang.extend(Workbook.prototype, {
  save(filename) {
    Workbook.save(this, filename);
  }
});

module.exports = {
  CONST,
  DomMixin,
  Legend,
  Relationship,
  Sheet,
  Topic,
  Workbook,
  open: Workbook.open,
  save: Workbook.save,
  utils,
};
