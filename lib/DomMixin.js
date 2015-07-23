/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    each = pastry.each;

var CONST = require('./CONST');
var utils = require('./utils');

var DomMixin = declare({
    /*
     * helpers mixin to constructors with a document property
     * constructor.doc is required!
     */
    eachChildNode: function(callback) {
        var me = this;
        each(me.doc.childNodes, function(childNode) {
            callback(childNode);
        });
    },
    getAttribute: function(name) {
        return this.doc.getAttribute(name);
    },
    setAttribute: function(name, value) {
        this.doc.setAttribute(name, value);
    },
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
});

module.exports = DomMixin;
