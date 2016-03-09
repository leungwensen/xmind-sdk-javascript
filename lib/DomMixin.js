var lang = require('zero-lang');
var declare = require('zero-oop/declare');
var json = require('zero-encoding/json');

var isDate = lang.isDate;
var isNumber = lang.isNumber;
var toInt = lang.toInteger;

var CONST = require('./CONST');
var utils = require('./utils');

var DomMixin = declare('DomMixin', {
    /*
     * constructor.doc is required!
     *   - constructor.doc is instance of DocumentElement or Node
     */
    // attribute
    getAttribute: function (name) {
        return this.doc.getAttribute(name) || '';
    },
    setAttribute: function (name, value) {
        this.doc.setAttribute(name, value);
        return this;
    },
    removeAttribute: function (name) {
        this.doc.removeAttribute(name);
        return this;
    },

    // child node
    eachChildNode: function (tagName, attrs, callback) {
        utils.eachChildNode(this.doc, tagName, attrs, callback);
    },
    findOrCreateChildNode: function (tagName, attrs) {
        return utils.findOrCreateChildNode(this.doc, tagName, attrs);
    },

    // timestamp
    getModifiedTime: function () {
        return toInt(this.getAttribute(CONST.ATTR_TIMESTAMP));
    },
    setModifiedTime: function (timestamp/*Date instance or number(timestamp)*/) {
        timestamp = isDate(timestamp) ? timestamp.getTime() : timestamp;
        if (!isNumber(timestamp)) {
            timestamp = utils.getCurrentTimestamp();
        }
        this.setAttribute(CONST.ATTR_TIMESTAMP, timestamp);
        return this;
    },

    // title
    getTitle: function () {
        var titleNode = utils.findChildNode(this.doc, CONST.TAG_TITLE);
        return titleNode ? titleNode.textContent : '';
    },
    setTitle: function (title) {
        var titleNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_TITLE);
        titleNode.textContent = title;
        return this;
    },

    // position
    getPosition: function () {
        var positionNode = utils.findChildNode(this.doc, CONST.TAG_POSITION);
        return positionNode ? {
            x: toInt(positionNode.getAttribute(CONST.ATTR_X)),
            y: toInt(positionNode.getAttribute(CONST.ATTR_Y))
        } : null;
    },
    setPosition: function (position) {
        var positionNode = utils.findOrCreateChildNode(this.doc, CONST.TAG_POSITION);
        positionNode.setAttribute(CONST.ATTR_X, position.x);
        positionNode.setAttribute(CONST.ATTR_Y, position.y);
        return this;
    },
    removePosition: function () {
        utils.removeChildNode(this.doc, CONST.TAG_POSITION);
        return this;
    },

    // life cycle
    destroy: function () {
        var me = this;
        me.doc.parentNode.removeChild(me.doc);
        me.doc = null;
        me = null;
    },

    // parse & stringify
    toPlainObject: function () {
        return this;
    },
    toJSON: function () {
        return json.stringify(this.toPlainObject());
    },
});

module.exports = DomMixin;

