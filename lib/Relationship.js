'use strict';
/**
 * relationship module
 * @module relationship
 * @see module:index
 */
const lang = require('zero-lang');
const CONST = require('./const');
const DomMixin = require('./dom-mixin');
const tmplRelationship = require('./template/relationship');
const utils = require('./utils');

const NS = 'relationship-';

class Relationship extends DomMixin {
  constructor(options) {
    /*
     * options:
     *   - sheet(required)
     *   // when creating a new one {
     *      - sourceId
     *      - targetId
     *      - title
     *      - id
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *   // }
     */
    super();
    const me = this;
    const sheet = options.sheet;

    lang.extend(me, {
      sheet: sheet
    });
    const relationshipsNode = utils.findOrCreateChildNode(
      sheet.doc, CONST.TAG_RELATIONSHIPS
    );
    sheet.relationshipsNode = relationshipsNode;
    if (options.doc) {
      me.doc = options.doc;
    } else {
      // id, sourceId and targetId cannot be the same with the existing ones
      const attrs = {};
      const id = options.id || utils.uuid(NS);
      attrs[CONST.ATTR_END1] = options.sourceId;
      attrs[CONST.ATTR_END2] = options.targetId;
      attrs[CONST.ATTR_ID] = id;
      if (utils.findChildNode(relationshipsNode, CONST.TAG_RELATIONSHIP, attrs))
        throw 'the same relationship already exists';
      me.doc = utils.parseFromString(tmplRelationship({
        id: id,
        sourceId: options.sourceId,
        targetId: options.targetId
      })).documentElement;
      // xml structure
      relationshipsNode.appendChild(me.doc);
      me.setModifiedTime();
    }
    me.id = me.getAttribute(CONST.ATTR_ID);
    lang.extend(me, {
      id: me.getAttribute(CONST.ATTR_ID),
      sourceId: me.getAttribute(CONST.ATTR_END1),
      targetId: me.getAttribute(CONST.ATTR_END2)
    });
    if (options.title) {
      me.setTitle(options.title);
    }
    sheet.relationships = lang.union(sheet.relationships, [me]);
    sheet.relationshipById[me.id] = me;
  }

  toPlainObject() {
    const me = this;
    return {
      id: me.id,
      sheetId: me.sheet.id,
      sourceId: me.getSource(),
      targetId: me.getTarget(),
      modifiedTime: me.getModifiedTime(),
      title: me.getTitle()
    };
  }

  getSource() {
    return this.getAttribute(CONST.ATTR_END1);
  }

  setSource(value) {
    const me = this;
    const targetId = me.getTarget();
    if (targetId === value) throw 'source & target should not be the same';
    if (value) {
      me.setAttribute(CONST.ATTR_END1, value);
      //me.sourceId = value;
      return me.setModifiedTime();
    }
  }

  getTarget() {
    return this.getAttribute(CONST.ATTR_END2);
  }

  setTarget(value) {
    const me = this;
    const sourceId = me.getSource();
    if (sourceId === value) throw 'source & target should not be the same';
    if (value) {
      me.setAttribute(CONST.ATTR_END2, value);
      //me.targetId = value;
      return me.setModifiedTime();
    }
  }
}

module.exports = Relationship;
