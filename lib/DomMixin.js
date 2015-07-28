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
            var me = this,
                doc = me.doc;
            var resultNode = doc.getElementsByTagName(tagName)[0];
            if (!resultNode) {
                resultNode = doc.createElement(tagName);
            }
            if (attrs) {
                each(attrs, function(value, key) {
                    resultNode.setAttribute(key, value);
                });
            }
            return resultNode;
        },
    // }
    // timestamp {
        getModifiedTime: function() {
            return this.getAttribute(CONST.ATTR_TIMESTAMP);
        },
        setModifiedTime: function(time) {
            this.setAttribute(CONST.ATTR_TIMESTAMP, time || utils.getCurrentTimestamp());
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
