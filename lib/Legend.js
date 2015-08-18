/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    extend = pastry.extend,
    map = pastry.map;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');

var CONST = require('./CONST');
var utils = require('./utils');

var DEFAULT_VISIBILITY = 'visible';
var DEFAULT_POSITION = {
    x: 500,
    y: 500,
};

var tmplLegend = require('./template/legend');

var Legend = declare('Legend', DomMixin, {
    constructor: function(options) {
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
        var me = this;
        var sheet = options.sheet;

        extend(me, {
            sheet: sheet
        });
        if (options.doc) {
            me.doc = options.doc;
        } else {
            var position = options.position || DEFAULT_POSITION;
            var markerDescriptions = options.markerDescriptions || [];
            var visibility = options.visibility || DEFAULT_VISIBILITY;
            me.doc = domParser.parseFromString(tmplLegend({
                visibility: visibility,
                markerDescriptions: markerDescriptions,
                position: position
            })).documentElement;
            // xml structure {
                sheet.doc.appendChild(me.doc);
            // }
        }
        var markerDescriptionsNode = utils.findOrCreateChildNode(
            me.doc,
            CONST.TAG_MARKER_DESCRIPTIONS
        );
        extend(me, {
            markerDescriptionsNode: markerDescriptionsNode
        });
        sheet.legend = me;
    },
    toPlainObject: function() {
        var me = this;
        // marker descriptions {
            var markerDescriptions = map(
                utils.findChildNodes(me.markerDescriptionsNode, CONST.TAG_MARKER_DESCRIPTION),
                function(childNode) {
                    return {
                        markderId: childNode.getAttribute(CONST.ATTR_MARKERID),
                        description: childNode.getAttribute(CONST.ATTR_DESCRIPTION)
                    };
                }
            );
        // }
        return {
            sheetId: me.sheet.id,
            markerDescriptions: markerDescriptions,
            position: me.getPosition() || DEFAULT_POSITION,
            visibility: me.getVisibility() || DEFAULT_VISIBILITY
        };
    },
    addMarkerDescription: function(markerId, description) {
        // markerId should not be duplicated
        // an exception of `instance.addXXXX()`-formatted function
        // because there is not a constructor named `MarkerDescription`,
        // this function returns Legend instance instead
        var me = this;
        var attrs = {};
        attrs[CONST.ATTR_MARKERID] = markerId;
        attrs[CONST.ATTR_DESCRIPTION] = description;
        utils.findOrCreateChildNode(
            me.markerDescriptionsNode,
            CONST.TAG_MARKER_DESCRIPTION,
            attrs
        );
        return me;
    },
    removeMarkerDescription: function(markerId) {
        var me = this;
        // markerId should not be duplicated
        var attrs = {};
        attrs[CONST.ATTR_MARKERID] = markerId;
        utils.removeChildNode(
            me.markerDescriptionsNode,
            CONST.TAG_MARKER_DESCRIPTION,
            attrs
        );
        return me;
    },
    getVisibility: function() {
        return this.getAttribute(CONST.ATTR_VISIBILITY);
    },
    setVisibility: function(value) {
        this.setAttribute(CONST.ATTR_VISIBILITY, value);
        return this;
    }
});

extend(Legend, {
    DEFAULT_VISIBILITY: DEFAULT_VISIBILITY,
    DEFAULT_POSITION: DEFAULT_POSITION
});

module.exports = Legend;

