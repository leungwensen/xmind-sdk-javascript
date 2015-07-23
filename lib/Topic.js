/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    uuid = pastry.uuid;

var DomMixin = require('./DomMixin');

var Topic = declare(DomMixin, {
    constructor: function(options) {
        /*
         * options:
         *   // optional {
         *      sheet (if this parameter is provided, then this is a root topic)
         *   // }
         *   // when creating a new one {
         *      [parent, ]title, structure, style (root topic has no parent)
         *   // }
         *   // when loading from an existing one {
         *      doc
         *   // }
         */
        var me = this,
            sheet = options.sheet;
        if (sheet) {
            sheet.rootTopics.push(me);
            sheet.rootTopicById[me.id] = me;
        }
    }
});

module.exports = Topic;
