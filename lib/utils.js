'use strict';
/**
 * utils module
 * @module utils
 * @see module:index
 */

const utils = {
  getCurrentTimestamp: () => Date.now(),
  getDefaultSheetName: (index) => `Sheet ${index}`,
  getDefaultTopicName: (structureClass) => `${structureClass} Topic`,
  uuid: (prefix) => (prefix || '') + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }),
};

module.exports = utils;
