var lang = require('zero-lang');
var each = lang.each;
var forIn = lang.forIn;
var every = lang.every;
var keys = lang.keys;
var filter = lang.filter;
var sprintf = require('zero-fmt/sprintf');

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
        return utils.findChildNodes(doc, tagName, attrs)[0];
    },
    findChildNodes: function(doc, tagName, attrs) {
        attrs = attrs || {};
        if (!doc) {
            return [];
        }
        var resultNodes = filter(doc.childNodes, function(node) {
            return node.tagName === tagName;
        });
        resultNodes = filter(resultNodes, function(node) {
            return node && every(keys(attrs), function(key) {
                return node.getAttribute(key) === attrs[key];
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
        if (!doc) {
            // throw 'doc not defined';
            return null;
        }
        var resultNode = utils.findChildNode(doc, tagName, attrs);
        if (!resultNode) {
            var ownerDoc = doc;
            if (!doc.createElement) { // create with ownerDocument
                ownerDoc = doc.ownerDocument;
            }
            resultNode = ownerDoc.createElement(tagName);
            forIn(attrs, function(value, key) {
                resultNode.setAttribute(key, value);
            });
            doc.appendChild(resultNode);
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
