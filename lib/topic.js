'use strict';
/**
 * topic module
 * @module topic
 * @see module:index
 */
const lang = require('zero-lang');
const CONST = require('./const');
const DomMixin = require('./dom-mixin');
const tmplLabels = require('./template/labels');
const tmplMarker = require('./template/marker');
const tmplMarkers = require('./template/markers');
const tmplNotes = require('./template/notes');
const tmplTopic = require('./template/topic');
const utils = require('./utils');

const NS = 'topic-';

function getTopicsType(topic) {
  // FIXME is this official?
  const REGEXP_FLOATING = new RegExp(`${CONST.TOPIC_FLOATING}$`, 'i');
  if (topic.type === CONST.TOPIC_DETACHED || (topic.structure || '').match(REGEXP_FLOATING)) {
    return CONST.TOPIC_DETACHED;
  }
  return CONST.TOPIC_ATTACHED;
}

class Topic extends DomMixin {
  constructor(options) {
    /*
     * options:
     *   - sheet(required)
     *   - parent
     *   - type
     *   // when creating a new one {
     *      - id
     *      - title
     *      - structure
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *   // }
     */
    super();
    const me = this;
    const sheet = options.sheet;

    lang.extend(me, {
      childById: {},
      children: [],
      isRootTopic: !options.parent,
      parent: options.parent,
      sheet,
      structure: options.structure,
      type: options.type,
    });
    if (options.doc) {
      me.doc = options.doc;
      me._loadSubTopics();
    } else {
      me.doc = utils.parseFromString(tmplTopic({
        id: options.id || utils.uuid(NS),
        styleId: options.styleId || '',
        title: options.title,
      })).documentElement;
      me.setModifiedTime();
    }
    me.id = me.getAttribute(CONST.ATTR_ID);
    // xml structure
    me._addToParent();
    // level, etc
    sheet.topics = lang.union(sheet.topics, [me]);
    sheet.topicById[me.id] = me;
  }

  _addToParent(parent) {
    const me = this;
    const sheet = me.sheet;
    if (me.isRootTopic) {
      sheet.doc.appendChild(me.doc);
      sheet.rootTopic = me;
    } else {
      parent = parent || me.parent;
      me.parent = parent; // if parent is defined, change it
      me.topicsType = getTopicsType(me, sheet); // attached or detached
      const parentDoc = parent.doc;
      const childrenNode = utils.findOrCreateChildNode(parentDoc, CONST.TAG_CHILDREN);
      const childrenTopicsNode = utils.findOrCreateChildNode(childrenNode, CONST.TAG_TOPICS, {
        type: me.topicsType
      }); // floating or not
      childrenTopicsNode.appendChild(me.doc);
      parent.children = lang.union(parent.children, [me]);
      parent.childById[me.id] = me;
    }
  }

  destroy(force) {
    const me = this;
    const sheet = me.sheet;
    if (force || sheet.rootTopic !== me) { // cannot destroy root topic unless it is forced to
      lang.each(me.children, (child) => {
        child.destroy();
      });
      DomMixin.prototype.destroy.apply(me);
      sheet.topics = lang.difference(sheet.topics, [me]);
      delete sheet.topicById[me.id];
    }
  }

  toPlainObject() {
    const me = this;
    return {
      children: lang.map(me.children, (child) => child.toPlainObject()),
      hyperlink: me.getHyperlink(),
      id: me.id,
      isRootTopic: me.isRootTopic,
      labels: me.getLabels(),
      markers: me.getMarkers(),
      modifiedTime: me.getModifiedTime(), // timestamp
      notes: me.getNotes(),
      parentId: me.parent ? me.parent.id : '',
      sheetId: me.sheet.id,
      structure: me.structure,
      title: me.getTitle(),
      type: me.type,
    };
  }

  _loadSubTopics() {
    /*
     * <topic>
     *     <!-- other childNodes -->
     *     <children>
     *         <topics type="attached">
     *             <!-- normal sub topics -->
     *         </topics>
     *         <topics type="detached">
     *             <!-- floating sub topics -->
     *         </topics>
     *     </children>
     * </topic>
     */
    const me = this;
    const childrenNodes = utils.findChildNodes(me.doc, CONST.TAG_CHILDREN);
    lang.each(childrenNodes, (childrenNode) => {
      const topicsNodes = utils.findChildNodes(childrenNode, CONST.TAG_TOPICS);
      lang.each(topicsNodes, (topicsNode) => {
        const type = topicsNode.getAttribute(CONST.ATTR_TYPE);
        const topicNodes = utils.findChildNodes(topicsNode, CONST.TAG_TOPIC);
        lang.each(topicNodes, (doc) => {
          new Topic({
            doc,
            parent: me,
            sheet: me.sheet,
            type,
          });
        });
      });
    });
    return me;
  }

  // parent & child
  getBranch() { // folded, etc
    return this.getAttribute(CONST.ATTR_BRANCH);
  }

  setBranch(value) {
    this.setAttribute(CONST.ATTR_BRANCH, value);
    return this.setModifiedTime();
  }

  setBranchFolded() {
    this.setAttribute(CONST.ATTR_BRANCH, CONST.VAL_FOLDED);
    return this.setModifiedTime();
  }

  addChild(options/* instance or options */) {
    const me = this;
    me.setModifiedTime();
    if (options instanceof Topic) {
      options._addToParent(me);
      return options;
    }
    return new Topic(lang.extend(options, {
      parent: me,
      sheet: me.sheet
    }));
  }

  removeChild(child/* id or instance */, dryrun) {
    const me = this;
    child = Topic.getTopic(child, me.sheet);
    if (child) {
      delete me.childById[child.id];
      me.children = lang.difference(me.children, [child]);
      if (!dryrun) child.destroy();
    }
    return me.setModifiedTime();
  }

  isAncestorOf(targetTopic) {
    const me = this;
    targetTopic = Topic.getTopic(targetTopic, me.sheet);
    let topic = targetTopic;
    while (topic.parent) {
      if (topic.parent === me) return true;
      topic = topic.parent;
    }
    return false;
  }

  moveTo(targetTopic) {
    const me = this;
    targetTopic = Topic.getTopic(targetTopic, me.sheet);
    if (!targetTopic) throw new Error('target topic does not exist');
    if (me.isRootTopic) throw new Error('cannot move root topic');
    if (me === targetTopic) throw new Error('cannot move to itself');
    if (me.isAncestorOf(targetTopic)) throw new Error('cannot move to a child topic');
    me.parent.removeChild(me, true);
    targetTopic.addChild(me);
    return me.setModifiedTime();
  }

  // moveChild: function([>fromIndex, toIndex<]) {
  // TODO
  // },

  // floating, etc

  // notes
  getNotes() {
    const notesNode = utils.findChildNode(this.doc, CONST.TAG_NOTES);
    if (notesNode) {
      const plainNotesNode = utils.findChildNode(notesNode, CONST.PLAIN_FORMAT_NOTE);
      if (plainNotesNode) return plainNotesNode.textContent;
    }
    return '';
  }

  setNotes(notes) {
    const me = this;
    // TODO support styles
    // throw 'notes must be a string!';
    if (!lang.isString(notes)) return me;
    const noteLines = notes.split('\n');
    utils.removeChildNode(me.doc, CONST.TAG_NOTES);
    const notesNode = utils.parseFromString(tmplNotes({
      lines: noteLines,
      plainNotes: notes
    })).documentElement;
    me.doc.appendChild(notesNode);
    return me.setModifiedTime();
  }

  // labels
  getLabels() {
    let result = [];
    const labelsNode = utils.findChildNode(this.doc, CONST.TAG_LABELS);
    result = lang.map(utils.findChildNodes(labelsNode, CONST.TAG_LABEL), (labelNode) => labelNode.textContent);
    return result;
  }

  setLabels(labels) {
    const me = this;
    if (lang.isString(labels)) {
      labels = lang.map(labels.split(','), (label) => label);
    } else {
      labels = lang.isArray(labels) ? labels : [labels];
    }
    labels = lang.map(labels, (label) => lang.trim(label));
    utils.removeChildNode(me.doc, CONST.TAG_LABELS);
    const labelsNode = utils.parseFromString(tmplLabels({
      labels,
    })).documentElement;
    me.doc.appendChild(labelsNode);
    return me.setModifiedTime();
  }

  // hyperlink
  getHyperlink() {
    return this.doc.getAttribute(CONST.ATTR_HREF) || '';
  }

  setHyperlink(hyperlink) {
    /*
     * hyperlink which refers to one of these:
     *   - url
     *   - topic
     *   - file
     */
    this.setAttribute(CONST.ATTR_HREF, hyperlink);
    return this.setModifiedTime();
  }

  removeHyperlink() {
    this.removeAttribute(CONST.ATTR_HREF);
    return this.setModifiedTime();
  }

  // marker
  // automatically add legends?
  getMarkers() {
    const result = [];
    const markersNode = utils.findChildNode(this.doc, CONST.TAG_MARKERREFS);
    if (markersNode) {
      utils.eachChildNode(markersNode, CONST.TAG_MARKERREF, {}, (node) => {
        const id = node.getAttribute(CONST.ATTR_MARKERID);
        if (id) result.push(id);
      });
    }
    return result;
  }

  setMarkers(markers) {
    const me = this;
    // throw 'invalid markers';
    if (!lang.isArray(markers)) return me;
    markers = lang.uniq(markers);
    utils.removeChildNode(me.doc, CONST.TAG_MARKERREFS);
    const markersNode = utils.parseFromString(tmplMarkers({
      markers,
    })).documentElement;
    me.doc.appendChild(markersNode);
    return me.setModifiedTime();
  }

  addMarker(id) {
    // an exception of `instance.addXXXX()`-formatted function
    // because there is not a constructor named `Marker`,
    // this function returns Topic instance instead
    const me = this;
    const markersNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_MARKERREFS);
    const attrs = {};
    attrs[CONST.ATTR_MARKERID] = id;
    if (utils.findChildNode(me.doc, CONST.TAG_MARKERREF, attrs)) throw new Error('marker already exists!');
    const newMarkerNode = utils.parseFromString(tmplMarker({
      id,
    })).documentElement;
    markersNode.appendChild(newMarkerNode);
    return me.setModifiedTime();
  }

  removeMarker(id) {
    const me = this;
    const markersNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_MARKERREFS);
    const attrs = {};
    attrs[CONST.ATTR_MARKERID] = id;
    utils.removeChildNode(markersNode, CONST.TAG_MARKERREF, attrs);
    return me.setModifiedTime();
  }
}

lang.extend(Topic, {
  getTopic(topic/* id or instance */, sheet) {
    if (lang.isString(topic)) {
      topic = sheet.topicById[topic];
    } else if (!(topic instanceof Topic)) {
      topic = null;
    }
    return topic;
  }
});

module.exports = Topic;
