/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

var path = require('path'),
    resolve = path.resolve;

var xmind = require('../../index');

describe('xmind', function () {
    it('xmind.open', function () {
        assert.doesNotThrow(function() {
            xmind.open(
                resolve(__dirname, './assets/simple.xmind')
            );
        }, 'failed to open xmind file');
    });
    it('xmind.save', function () {
    });
});

