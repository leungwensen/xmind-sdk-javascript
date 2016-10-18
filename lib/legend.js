'use strict';
/**
 * legend module
 * @module legend
 * @see module:index
 */
const lang = require('zero-lang');
const CONST = require('./const');
const DomMixin = require('./dom-mixin');
const tmplLegend = require('./template/legend');
const utils = require('./utils');

const DEFAULT_VISIBILITY = 'visible';
const DEFAULT_POSITION = {
  x: 500,
  y: 500,
};

class Legend extends DomMixin {
  constructor(options) {
    /*
     * options:
     *   - sheet(required)
     *   // when creating a new one {
     *      - position
     *      - isVisible
     *      - markerDescriptions
     *   // }
     *   // when loading from an existing one {
     *      - doc
     *   // }
     */
    super();
    const me = this;
    const sheet = options.sheet;

    lang.extend(me, {
      sheet,
    });
    if (options.doc) {
      me.doc = options.doc;
    } else {
      const position = options.position || DEFAULT_POSITION;
      const markerDescriptions = options.markerDescriptions || [];
      const visibility = options.visibility || DEFAULT_VISIBILITY;
      me.doc = utils.parseFromString(tmplLegend({ // FIXME must specify namespace of svg (see ./template/legend.xml)
        visibility,
        markerDescriptions,
        position
      })).documentElement;
      // xml structure
      sheet.doc.appendChild(me.doc);
    }
    me.markerDescriptionsNode = utils.findOrCreateChildNode(me.doc, {
      tagName: CONST.TAG_MARKER_DESCRIPTIONS,
    });
    sheet.legend = me;
  }

  toPlainObject() {
    const me = this;
    // marker descriptions
    const markerDescriptions = lang.map(
      utils.findChildNodes(me.markerDescriptionsNode, {
        tagName: CONST.TAG_MARKER_DESCRIPTION,
      }),
      (childNode) => ({
        markderId: childNode.getAttribute(CONST.ATTR_MARKERID),
        description: childNode.getAttribute(CONST.ATTR_DESCRIPTION)
      })
    );
    return {
      sheetId: me.sheet.id,
      markerDescriptions,
      position: me.getPosition() || DEFAULT_POSITION,
      visibility: me.getVisibility() || DEFAULT_VISIBILITY
    };
  }

  addMarkerDescription(markerId, description) {
    // markerId should not be duplicated
    // an exception of `instance.addXXXX()`-formatted function
    // because there is not a constructor named `MarkerDescription`,
    // this function returns Legend instance instead
    const me = this;
    const attrs = {};
    attrs[CONST.ATTR_MARKERID] = markerId;
    attrs[CONST.ATTR_DESCRIPTION] = description;
    utils.findOrCreateChildNode(me.markerDescriptionsNode, {
      tagName: CONST.TAG_MARKER_DESCRIPTION,
      attributes: attrs,
    });
    return me;
  }

  removeMarkerDescription(markerId) {
    const me = this;
    // markerId should not be duplicated
    const attrs = {};
    attrs[CONST.ATTR_MARKERID] = markerId;
    utils.removeChildNode(me.markerDescriptionsNode, {
      tagName: CONST.TAG_MARKER_DESCRIPTION,
      attributes: attrs,
    });
    return me;
  }

  getVisibility() {
    return this.getAttribute(CONST.ATTR_VISIBILITY);
  }

  setVisibility(value) {
    this.setAttribute(CONST.ATTR_VISIBILITY, value);
    return this;
  }
}

lang.extend(Legend, {
  DEFAULT_VISIBILITY,
  DEFAULT_POSITION,
});

module.exports = Legend;
