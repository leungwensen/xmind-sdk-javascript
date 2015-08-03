/* jshint undef: true, unused: true, node: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    each = pastry.each,
    json = pastry.json;

var CONST = require('./CONST');
var utils = require('./utils');

var DomMixin = declare('DomMixin', {
    /*
     * constructor.doc is required!
     *   - constructor.doc is instance of DocumentElement or Node
     */
    // attribute {
        getAttribute: function(name) {
            return this.doc.getAttribute(name);
        },
        setAttribute: function(name, value) {
            this.doc.setAttribute(name, value);
        },
        removeAttribute: function(name) {
            this.doc.removeAttribute(name);
        },
    // }
    // child node {
        eachChildNode: function(callback) {
            var me = this;
            each(me.doc.childNodes, function(childNode) {
                callback(childNode);
            });
        },
        findOrCreateChildNode: function(tagName, attrs) {
            return utils.findOrCreateChildNode(this.doc, tagName, attrs);
        },
    // }
    // timestamp {
        getModifiedTime: function() {
            return this.getAttribute(CONST.ATTR_TIMESTAMP);
        },
        setModifiedTime: function(timestamp) {
            this.setAttribute(CONST.ATTR_TIMESTAMP, timestamp || utils.getCurrentTimestamp());
        },
    // }
    // title {
        getTitle: function() {
            var titleNode = utils.findChildNode(this.doc, CONST.TAG_TITLE);
            return titleNode ? titleNode.textContent : '';
        },
        setTitle: function(title) {
            var me = this;
            var titleNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_TITLE);
            titleNode.textContent = title;
            return me;
        },
    // }
    // position {
        getPosition: function() {
            var positionNode = utils.findChildNode(this.doc, CONST.TAG_POSITION);
            return positionNode ? {
                x: positionNode.getAttribute(CONST.ATTR_X),
                y: positionNode.getAttribute(CONST.ATTR_Y)
            } : null;
        },
        setPosition: function(position) {
            var me = this;
            var positionNode = utils.findOrCreateChildNode(me.doc, CONST.TAG_POSITION);
            positionNode.setAttribute(CONST.ATTR_X, position.x);
            positionNode.setAttribute(CONST.ATTR_Y, position.y);
            return me;
        },
    // }
    // life cycle {
        destroy: function() {
            var me = this;
            me.doc.parentNode.removeChild(me.doc);
            me.doc = null;
            me = null;
        },
    // }
    // parse & stringify {
        toPlainObject: function() {
            return this;
        },
        toJSON: function() {
            return json.stringify(this.toPlainObject());
        },
    // }
});

module.exports = DomMixin;

