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
        var sheet = options.sheet;

        extend(this, {
            sheet: sheet
        });
        var relationshipsNode = utils.findOrCreateChildNode(
            sheet.doc, CONST.TAG_RELATIONSHIPS
        );
        sheet.relationshipsNode = relationshipsNode;
        if (options.doc) {
            this.doc = options.doc;
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
            this.doc = domParser.parseFromString(tmplRelationship({
                id: id,
                sourceId: options.sourceId,
                targetId: options.targetId,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
            // xml structure {
                relationshipsNode.appendChild(this.doc);
            // }
        }
        this.id = this.getAttribute(CONST.ATTR_ID);
        extend(this, {
            id: this.getAttribute(CONST.ATTR_ID),
            sourceId: this.getAttribute(CONST.ATTR_END1),
            targetId: this.getAttribute(CONST.ATTR_END2)
        });
        if (options.title) {
            this.setTitle(options.title);
        }
        sheet.relationships = union(sheet.relationships, [this]);
        sheet.relationshipById[this.id] = this;
    },
    toPlainObject: function() {
        return {
            id: this.id,
            sheetId: this.sheet.id,
            sourceId: this.getSource(),
            targetId: this.getTarget(),
            modifiedTime: this.getModifiedTime(),
            title: this.getTitle()
        };
    },
    getSource: function() {
        return this.getAttribute(CONST.ATTR_END1);
    },
    setSource: function(value) {
        var targetId = this.getTarget();
        if (targetId === value) {
            throw 'source & target should not be the same';
        } else if (value) {
            this.setAttribute(CONST.ATTR_END1, value);
            //this.sourceId = value;
            return this.setModifiedTime();
        }
    },
    getTarget: function() {
        return this.getAttribute(CONST.ATTR_END2);
    },
    setTarget: function(value) {
        var sourceId = this.getSource();
        if (sourceId === value) {
            throw 'source & target should not be the same';
        } else if (value) {
            this.setAttribute(CONST.ATTR_END2, value);
            //this.targetId = value;
            return this.setModifiedTime();
        }
    }
});

module.exports = Relationship;

