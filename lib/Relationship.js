/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    extend = pastry.extend,
    union = pastry.union,
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
         *      - title
         *      - id
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
        var relationshipsNode = utils.findOrCreateChildNode(
            sheet.doc, CONST.TAG_RELATIONSHIPS
        );
        sheet.relationshipsNode = relationshipsNode;
        if (options.doc) {
            me.doc = options.doc;
        } else {
            // id, sourceId and targetId cannot be the same with the existing ones {
                var attrs = {};
                var id = options.id || uuid(NS);
                attrs[CONST.ATTR_END1] = options.sourceId;
                attrs[CONST.ATTR_END2] = options.targetId;
                attrs[CONST.ATTR_ID] = id;
                if (utils.findChildNode(relationshipsNode, CONST.TAG_RELATIONSHIP, attrs)) {
                    throw 'the same relationship already exists';
                }
            // }
            me.doc = domParser.parseFromString(tmplRelationship({
                id: id,
                sourceId: options.sourceId,
                targetId: options.targetId
            })).documentElement;
            // xml structure {
                relationshipsNode.appendChild(me.doc);
            // }
            me.setModifiedTime();
        }
        me.id = me.getAttribute(CONST.ATTR_ID);
        extend(me, {
            id: me.getAttribute(CONST.ATTR_ID),
            sourceId: me.getAttribute(CONST.ATTR_END1),
            targetId: me.getAttribute(CONST.ATTR_END2)
        });
        if (options.title) {
            me.setTitle(options.title);
        }
        sheet.relationships = union(sheet.relationships, [me]);
        sheet.relationshipById[me.id] = me;
    },
    toPlainObject: function() {
        var me = this;
        return {
            id: me.id,
            sheetId: me.sheet.id,
            sourceId: me.getSource(),
            targetId: me.getTarget(),
            modifiedTime: me.getModifiedTime(),
            title: me.getTitle()
        };
    },
    getSource: function() {
        return this.getAttribute(CONST.ATTR_END1);
    },
    setSource: function(value) {
        var me = this;
        var targetId = me.getTarget();
        if (targetId === value) {
            throw 'source & target should not be the same';
        } else if (value) {
            me.setAttribute(CONST.ATTR_END1, value);
            //me.sourceId = value;
            return me.setModifiedTime();
        }
    },
    getTarget: function() {
        return this.getAttribute(CONST.ATTR_END2);
    },
    setTarget: function(value) {
        var me = this;
        var sourceId = me.getSource();
        if (sourceId === value) {
            throw 'source & target should not be the same';
        } else if (value) {
            me.setAttribute(CONST.ATTR_END2, value);
            //me.targetId = value;
            return me.setModifiedTime();
        }
    }
});

module.exports = Relationship;

