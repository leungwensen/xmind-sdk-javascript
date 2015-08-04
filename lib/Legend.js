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
        var me = this,
            sheet = options.sheet;

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
            CONST.TAG_MARKER_DESCRIPTION
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
                me.markerDescriptionsNode.childNodes,
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
        var attrs = {};
        attrs[CONST.ATTR_MARKERID] = markerId;
        attrs[CONST.ATTR_DESCRIPTION] = description;
        utils.findOrCreateChildNode(
            this.markerDescriptionsNode,
            CONST.TAG_MARKER_DESCRIPTION,
            attrs
        );
        return this;
    },
    removeMarkerDescription: function(markerId) {
        // markerId should not be duplicated
        var attrs = {};
        attrs[CONST.ATTR_MARKERID] = markerId;
        utils.removeChildNode(
            this.markerDescriptionsNode,
            CONST.TAG_MARKER_DESCRIPTION,
            attrs
        );
        return this;
    },
    getVisibility: function() {
        return this.getAttribute(CONST.ATTR_VISIBILITY);
    },
    setVisibility: function(value) {
        this.setAttribute(CONST.ATTR_VISIBILITY, value);
        return this;
    }
});

module.exports = Legend;

