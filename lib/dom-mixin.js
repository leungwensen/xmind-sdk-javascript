'use strict';
/**
 * dom-mixin module
 * @module dom-mixin
 * @see module:index
 */
const lang = require('zero-lang');
const CONST = require('./const');
const utils = require('./utils');

class DomMixin {
  /*
   * constructor.doc is required!
   *   - constructor.doc is instance of DocumentElement or Node
   */
  // attribute
  getAttribute(name) {
    return this.doc.getAttribute(name) || '';
  }

  setAttribute(name, value) {
    this.doc.setAttribute(name, value);
    return this;
  }

  removeAttribute(name) {
    this.doc.removeAttribute(name);
    return this;
  }

  // child node
  eachChildNode(tagName, attrs, callback) {
    utils.eachChildNode(this.doc, tagName, attrs, callback);
  }

  findOrCreateChildNode(tagName, attrs) {
    return utils.findOrCreateChildNode(this.doc, tagName, attrs);
  }

  // timestamp
  getModifiedTime() {
    return lang.toInteger(this.getAttribute(CONST.ATTR_TIMESTAMP));
  }

  setModifiedTime(timestamp/* Date instance or number(timestamp) */) {
    timestamp = lang.isDate(timestamp) ? timestamp.getTime() : timestamp;
    if (!lang.isNumber(timestamp)) timestamp = utils.getCurrentTimestamp();
    this.setAttribute(CONST.ATTR_TIMESTAMP, timestamp);
    return this;
  }

  // title
  getTitle() {
    const titleNode = utils.findChildNode(this.doc, CONST.TAG_TITLE);
    return titleNode ? titleNode.textContent : '';
  }

  setTitle(title) {
    const titleNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_TITLE);
    titleNode.textContent = title;
    return this;
  }

  // position
  getPosition() {
    const positionNode = utils.findChildNode(this.doc, CONST.TAG_POSITION);
    return positionNode ? {
      x: lang.toInteger(positionNode.getAttribute(CONST.ATTR_X)),
      y: lang.toInteger(positionNode.getAttribute(CONST.ATTR_Y))
    } : null;
  }

  setPosition(position) {
    const positionNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_POSITION);
    positionNode.setAttribute(CONST.ATTR_X, position.x);
    positionNode.setAttribute(CONST.ATTR_Y, position.y);
    return this;
  }

  removePosition() {
    utils.removeChildNode(this.doc, CONST.TAG_POSITION);
    return this;
  }

  // life cycle
  destroy() {
    let me = this;
    me.doc.parentNode.removeChild(me.doc);
    me.doc = null;
    me = null;
  }

  // parse & stringify
  toPlainObject() {
    return this;
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject());
  }
}

module.exports = DomMixin;
