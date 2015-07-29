/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

var path = require('path'),
    resolve = path.resolve;

var xmind = require('../../index'),
    Workbook = xmind.Workbook;

describe('xmind', function () {
    it('xmind.open(filename)', function () {
        assert.doesNotThrow(function() {
            xmind.open(
                resolve(__dirname, './assets/simple.xmind')
            );
        }, 'failed to open xmind file');
    });
    it('xmind.save(workbook, filename)', function () {
        assert.doesNotThrow(function() {
            xmind.save(
                new Workbook({
                    firstSheetName: 'test sheet',
                    rootTopicName: 'test topic'
                }),
                resolve(__dirname, './assets/save-test.xmind')
            );
        }, 'failed to save xmind file');
    });
});

