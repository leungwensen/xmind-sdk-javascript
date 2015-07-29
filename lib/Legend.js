/* jshint undef: true, unused: true */
/* global require, module */

var pastry = require('pastry'),
    declare = pastry.declare,
    uuid = pastry.uuid;

var DomMixin = require('./DomMixin');

var Legend = declare('Legend', DomMixin, {
    constructor: function(options) {
        /*
         * options:
         *   - sheet(required)
         *   // when creating a new one {
         *      - title
         *   // }
         *   // when loading from an existing one {
         *      - doc
         *   // }
         */
        var me = this,
            sheet = options.sheet;
        //if (sheet) {
            //sheet.rootTopics.push(me);
            //sheet.rootTopicById[me.id] = me;
        //}
    }
});

module.exports = Legend;
