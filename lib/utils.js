/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    each = pastry.each,
    every = pastry.every,
    sprintf = pastry.sprintf,
    filter = pastry.filter,
    some = pastry.some;

function noop() {}

var utils = {
    getCurrentTimestamp: function() {
        return Date.now();
    },
    getDefaultSheetName: function(index) {
        return sprintf('Sheet %d', index || 1);
    },
    getDefaultTopicName: function(structureClass) {
        return sprintf('%s Topic', structureClass);
    },
    findChildNode: function(doc, tagName, attrs) {
        attrs = attrs || {};
        if (!doc) {
            return;
        }
        var resultNode = doc.getElementsByTagName(tagName)[0];
        if (resultNode && some(attrs, function(value, key) {
            return resultNode.getAttribute(key) != value;
        })) {
            // make sure that tag we found matches the attrs given
            resultNode = null;
        }
        return resultNode;
    },
    findChildNodes: function(doc, tagName, attrs) {
        attrs = attrs || {};
        if (!doc) {
            return;
        }
        var resultNodes = doc.getElementsByTagName(tagName);
        resultNodes = filter(resultNodes, function(node) {
            return node && every(attrs, function(value, key) {
                return node.getAttribute(key) === value;
            });
        });
        return resultNodes;
    },
    eachChildNode: function(doc, tagName, attrs, callback) {
        callback = callback || noop;
        each(utils.findChildNodes(doc, tagName, attrs), function(node) {
            callback(node);
        });
    },
    findOrCreateChildNode: function(doc, tagName, attrs) {
        attrs = attrs || {};
        var resultNode = utils.findChildNode(doc, tagName, attrs);
        if (!resultNode) {
            resultNode = doc.createElement(tagName);
            each(attrs, function(value, key) {
                resultNode.setAttribute(key, value);
            });
        }
        return resultNode;
    },
    removeChildNode: function(doc, tagName, attrs) {
        attrs = attrs || {};
        var resultNode = utils.findChildNode(doc, tagName, attrs);
        if (resultNode) {
            doc.removeChild(resultNode);
        }
        return resultNode;
    }
};

module.exports = utils;

