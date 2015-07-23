/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    sprintf = pastry.sprintf;

var utils = {
    getCurrentTimestamp: function() {
        return Date.now();
    },
    getDefaultSheetName: function(index) {
        return sprintf('Sheet %d', index || 1);
    },
    getDefaultTopicName: function(structureClass) {
        return sprintf('%s Topic', structureClass);
    }
};

module.exports = utils;
