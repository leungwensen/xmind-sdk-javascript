'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
const fs = require('fs');
const lang = require('zero-lang');
const xmlLite = require('xml-lite');
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
