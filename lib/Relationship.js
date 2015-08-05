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
         *      - title
         *   // }
         *   // when loading from an existing one {
         *      - doc
         *   // }
         */
        var sheet = options.sheet;

        extend(this, {
            sheet: sheet
        });
        if (options.doc) {
            this.doc = options.doc;
        } else {
            this.doc = domParser.parseFromString(tmplRelationship({
                id: options.id || uuid(NS),
                sourceId: options.sourceId,
                targetId: options.targetId,
                timestamp: utils.getCurrentTimestamp()
            })).documentElement;
            // xml structure {
                var relationshipsNode = utils.findOrCreateChildNode(
                    sheet.doc, CONST.TAG_RELATIONSHIPS
                );
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
        sheet.relationships.push(this);
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

