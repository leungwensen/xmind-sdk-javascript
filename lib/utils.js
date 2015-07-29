/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    each = pastry.each,
    sprintf = pastry.sprintf,
    some = pastry.some;

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
    findOrCreateChildNode: function(doc, tagName, attrs) {
        attrs = attrs || {};
        var resultNode = doc.getElementsByTagName(tagName)[0];
        if (resultNode && some(attrs, function(value, key) {
            return resultNode.getAttribute(key) != value;
        })) {
            // make sure that tag we found matches the attrs given
            resultNode = null;
        }
        if (!resultNode) {
            resultNode = doc.createElement(tagName);
            each(attrs, function(value, key) {
                resultNode.setAttribute(key, value);
            });
        }
        return resultNode;
    }
};

module.exports = utils;
