/* jshint undef: true, unused: true */
/* global require, module */

var DomMixin = require('./DomMixin');
var Legend = require('./Legend');
var Relationship = require('./Relationship');
var Sheet = require('./Sheet');
var Topic = require('./Topic');
var Workbook = require('./Workbook');

module.exports = {
    DomMixin: DomMixin,
    Legend: Legend,
    Relationship: Relationship,
    Sheet: Sheet,
    Topic: Topic,
    Workbook: Workbook,
    open: Workbook.open,
    save: Workbook.save
};

