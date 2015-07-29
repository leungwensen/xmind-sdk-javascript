/* jshint undef: true, unused: true, node: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    each = pastry.each;

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
            // TODO
        },
        setTitle: function() {
            // TODO
        },
    // }
    // position {
        getPosition: function() {
            // TODO
        },
        setPosition: function() {
            // TODO
        },
    // }
});

module.exports = DomMixin;
