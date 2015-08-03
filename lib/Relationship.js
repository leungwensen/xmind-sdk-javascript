/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    extend = pastry.extend,
    uuid = pastry.uuid;

var xmldom = require('xmldom'),
    domParser = new xmldom.DOMParser();

var DomMixin = require('./DomMixin');

var CONST = require('./CONST');
var utils = require('./utils');

var NS = 'relationship-';

var tmplRelationship = require('./template/relationship');

var Relationship = declare('Relationship', DomMixin, {
    constructor: function(options) {
        /*
         * options:
         *   - sheet(required)
         *   // when creating a new one {
         *      - sourceId
         *      - targetId
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
            me.doc = domParser.parseFromString(tmplRelationship({
                id: uuid(NS),
                sourceId: options.sourceId,
                targetId: options.targetId,
                timestamp: utils.getCurrentTimestamp()
            }));
            // xml structure {
                var relationshipsNode = utils.findOrCreateChildNode(
                    sheet.doc, CONST.TAG_RELATIONSHIPS
                );
                relationshipsNode.appendChild(me.doc);
            // }
        }
        me.id = me.getAttribute(CONST.ATTR_ID);
        extend(me, {
            id: me.getAttribute(CONST.ATTR_ID),
            sourceId: me.getAttribute(CONST.ATTR_END1),
            targetId: me.getAttribute(CONST.ATTR_END2)
        });
        sheet.relationships.push(me);
        sheet.relationshipById[me.id] = me;
    },
    toPlainObject: function() {
        var me = this;
        return {
            id: me.id,
            sheetId: me.sheet.id,
            sourceId: me.sourceId,
            targetId: me.targetId,
            modifiedTime: me.getModifiedTime(),
            title: me.getTitle()
        };
    },
    setSource: function(value) {
        var me = this;
        me.setAttribute(CONST.ATTR_END1, value);
        me.sourceId = value;
        return me;
    },
    setTarget: function(value) {
        var me = this;
        me.setAttribute(CONST.ATTR_END2, value);
        me.sourceId = value;
        return me;
    }
});

module.exports = Relationship;

