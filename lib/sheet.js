'use strict';
/**
 * sheet module
 * @module sheet
 * @see module:index
 */
const lang = require('zero-lang');
const CONST = require('./const');
const DomMixin = require('./dom-mixin');
const Legend = require('./legend');
const Relationship = require('./relationship');
const Topic = require('./topic');
const tmplSheet = require('./template/sheet');
const utils = require('./utils');

const NS = 'sheet-';

class Sheet extends DomMixin {
  constructor(options) {
    /*
     * options:
     *   - workbook(required)
     *   // when creating a new one {
     *      - title
     *      - rootTopicName
     *      - theme
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *   // }
     */
    super();
    const me = this;
    const workbook = options.workbook;

    lang.extend(me, {
      legend: null,
      relationshipById: {},
      relationships: [],
      rootTopic: null,
      topicById: {},
      topics: [],
      workbook,
    });
    if (options.doc) {
      me.doc = options.doc;
      me._loadLegend()
        ._loadRootTopic()
        ._loadRelationships();
    } else {
      if (options.id && workbook.sheetById[options.id]) throw new Error(`sheet id '${options.id}' already exists!`);
      me.doc = utils.parseFromString(tmplSheet({
        id: options.id || utils.uuid(NS),
        title: options.title,
        theme: options.theme,
      })).documentElement;
      // xml structure
      workbook.doc.appendChild(me.doc);
      me._addRootTopic({
        id: options.rootTopicId || utils.getDefaultTopicName('Root'),
        title: options.rootTopicName,
        styleId: options.rootTopicStyleId
      });
      me.setModifiedTime();
    }
    lang.extend(me, {
      id: me.getAttribute(CONST.ATTR_ID)
    });
    workbook.sheets = lang.union(workbook.sheets, [me]);
    workbook.sheetById[me.id] = me;
  }

  destroy() {
    // TODO
    // NOTE: the last sheet cannot be deleted
    const me = this;
    const workbook = me.workbook;
    if (workbook.sheets.length <= 1) throw new Error('cannot destroy the last sheet!');
    lang.each(me.topics, (topic) => {
      topic.destroy(true);
    });
    lang.each(me.relationships, (relationship) => {
      relationship.destroy();
    });
    if (me.legend) me.legend.destroy();
    DomMixin.prototype.destroy.apply(me);
  }

  toPlainObject() {
    const me = this;
    return {
      id: me.id,
      theme: me.getTheme(),
      title: me.getTitle(),
      modifiedTime: me.getModifiedTime(), // timestamp
      rootTopic: me.rootTopic.toPlainObject(),
      // topics: lang.map(me.topics, function(topic) {
      //   return topic.toPlainObject();
      // }),
      relationships: lang.map(me.relationships, (relationship) => relationship.toPlainObject()),
      legend: me.legend ? me.legend.toPlainObject() : null
    };
  }

  _loadLegend() {
    const me = this;
    const legenNode = utils.findChildNodes(me.doc, CONST.TAG_LEGEND)[0];
    if (legenNode) {
      new Legend({
        sheet: me,
        doc: legenNode
      });
    }
    return me;
  }

  _loadRootTopic() {
    const me = this;
    const rootTopicNode = utils.findChildNode(
      me.doc,
      CONST.TAG_TOPIC
    );
    if (rootTopicNode) {
      new Topic({
        sheet: me,
        doc: rootTopicNode,
      });
    } else {
      me._addRootTopic(); // fix xmind file
    }
    return me;
  }

  _loadRelationships() {
    const me = this;
    const relationshipsNode = utils.findChildNodes(me.doc, CONST.TAG_RELATIONSHIPS)[0];
    if (relationshipsNode) {
      me.relationshipsNode = relationshipsNode;
      lang.each(relationshipsNode.childNodes, (childNode) => {
        new Relationship({
          sheet: me,
          doc: childNode
        });
      });
    }
    return this;
  }

  // theme
  getTheme() {
    return this.getAttribute(CONST.ATTR_THEME);
  }

  setTheme(theme) {
    this.setAttribute(CONST.ATTR_THEME, theme);
    return this.setModifiedTime();
  }

  // topics
  getRootTopic() {
    return this.rootTopic;
  }

  _addRootTopic(options) {
    const me = this;
    // throw 'root topic already exists';
    if (me.rootTopic) return me.rootTopic;
    options = options || {};
    lang.extend(options, {
      sheet: me,
    });
    me.setModifiedTime();
    return new Topic(options);
  }

  // legend
  addLegend() {
    const me = this;
    // throw 'legend already exists';
    if (me.legend) return me.legend;
    me.setModifiedTime();
    return new Legend({
      sheet: me
    });
  }

  removeLegend() {
    const me = this;
    if (me.legend) {
      me.legend.destroy();
      me.legend = null;
      return me.setModifiedTime();
    }
    return me;
  }

  // marker description
  addMarkerDescription(markerId, description) {
    const me = this;
    if (!me.legend) me.addLegend();
    return me.legend.addMarkerDescription(markerId, description);
  }

  removeMarkerDescription(markerId) {
    const me = this;
    if (!me.legend) return me;
    me.legend.removeMarkerDescription(markerId);
    return me;
  }

  // relationship
  addRelationship(options) {
    const me = this;
    me.relationshipsNode = utils.findOrCreateChildNode(
      me.doc,
      CONST.TAG_RELATIONSHIPS
    );
    me.setModifiedTime();
    return new Relationship({
      id: options.id,
      sheet: me,
      sourceId: options.sourceId,
      targetId: options.targetId,
      title: options.title
    });
  }

  removeRelationship(/* index, id, instance or sourceId, targetId */) {
    const me = this;
    const args = lang.toArray(arguments);
    let relationship;
    if (args.length === 1) {
      relationship = args[0];
      if (!(relationship instanceof Relationship)) {
        if (lang.isNumber(relationship)) {
          relationship = me.relationships[relationship];
        } else if (lang.isString(relationship)) {
          relationship = me.relationshipById[relationship];
        }
      }
    } else {
      const sourceId = args[0];
      const targetId = args[1];
      const attrs = {};
      attrs[CONST.ATTR_END1] = sourceId;
      attrs[CONST.ATTR_END2] = targetId;
      const relationshipNode = utils.findChildNode(
        me.relationshipsNode,
        CONST.TAG_RELATIONSHIP,
        attrs
      );
      if (relationshipNode) relationship = me.relationshipById[relationshipNode.getAttribute(CONST.ATTR_ID)];
    }
    if (relationship) {
      delete me.relationshipById[relationship.id];
      me.relationships = lang.difference(me.relationships, [relationship]);
      relationship.destroy();
      return me.setModifiedTime();
    }
    return me;
  }
}

module.exports = Sheet;
