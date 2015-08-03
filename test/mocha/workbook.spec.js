/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

//var path = require('path'),
    //resolve = path.resolve;

var xmind = require('../../index'),
    Workbook = xmind.Workbook;

describe('Workbook', function () {
    it('creating with first sheet name and root topic name', function () {
        assert.doesNotThrow(function() {
            console.log(new Workbook({
                firstSheetName: 'hello',
                rootTopicName: 'world',
            }).toJSON());
        }, 'failed to create a Workbook instance');
    });
    it('creating with doc, stylesDoc and attachments', function () {
    });
});

