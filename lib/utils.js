'use strict';
/**
 * utils module
 * @module utils
 * @see module:index
 */
const lang = require('zero-lang');

function noop() {
}

const utils = {
  getCurrentTimestamp: () => Date.now(),
  getDefaultSheetName: (index) => `Sheet ${index}`,
  getDefaultTopicName: (structureClass) => `${structureClass} Topic`,
  parseFromString: () => {
  },
  serializeToString: () => {
  },

  findChildNode: (doc, tagName, attrs) => {
    attrs = attrs || {};
    if (!doc) return null;
    return utils.findChildNodes(doc, tagName, attrs)[0];
  },
  findChildNodes: (doc, tagName, attrs) => {
    attrs = attrs || {};
    if (!doc) return [];
    const resultNodes = lang.filter(doc.childNodes, (node) => (node.tagName === tagName));
    return lang.filter(resultNodes, (node) => (
      node && lang.every(lang.keys(attrs), (key) => (node.getAttribute(key) === attrs[key]))
    ));
  },
  eachChildNode: (doc, tagName, attrs, callback) => {
    callback = callback || noop;
    lang.each(utils.findChildNodes(doc, tagName, attrs), (node) => {
      callback(node);
    });
  },
  findOrCreateChildNode: (doc, tagName, attrs) => {
    attrs = attrs || {};
    // throw 'doc not defined';
    if (!doc) return null;
    let resultNode = utils.findChildNode(doc, tagName, attrs);
    if (!resultNode) {
      let ownerDoc = doc;
      // create with ownerDocument
      if (!doc.createElement) ownerDoc = doc.ownerDocument;
      resultNode = ownerDoc.createElement(tagName);
      lang.forIn(attrs, (value, key) => {
        resultNode.setAttribute(key, value);
      });
      doc.appendChild(resultNode);
    }
    return resultNode;
  },
  removeChildNode: (doc, tagName, attrs) => {
    attrs = attrs || {};
    const resultNode = utils.findChildNode(doc, tagName, attrs);
    if (resultNode) doc.removeChild(resultNode);
    return resultNode;
  },
  uuid: (prefix) => (prefix || '') + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }),
};

module.exports = utils;
