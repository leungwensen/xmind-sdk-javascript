/* jshint undef: true, unused: true */
/* global require, module */

var Workbook = require('./Workbook');
var Sheet = require('./Sheet');
var Topic = require('./Topic');

module.exports = {
    Sheet: Sheet,
    Topic: Topic,
    Workbook: Workbook,
    open: Workbook.open,
    save: Workbook.save,
};
