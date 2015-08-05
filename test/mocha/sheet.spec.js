/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

var xmind = require('../../index'),
    Workbook = xmind.Workbook;

describe('Sheet', function () {
    it('sheet.topics', function() {
    });
    it('sheet.topicById', function() {
    });
    it('sheet.rootTopic', function() {
    });
    it('sheet.getTitle()', function() {
    });
    it('sheet.setTitle()', function() {
    });
    it('sheet.getModifiedTime()', function() {
    });
    it('sheet.setModifiedTime()', function() {
    });
    it('sheet.getTheme()', function() {
    });
    it('sheet.setTheme(theme)', function() {
    });
    it('sheet.getRootTopic()', function() {
    });
    it('sheet.addRootTopic(topicName)', function() {
    });
    it('sheet.addLegend()', function() {
    });
    it('sheet.removeLegend()', function() {
    });
    it('sheet.addMarkerDescription(markerId, description)', function() {
    });
    it('sheet.removeMarkerDescription(markerId)', function() {
    });
    it('sheet.addRelationship(sourceId, targetId, title)', function() {
    });
    it('sheet.destroy()', function () {
    });
    it('sheet.toJSON()', function () {
    });
    describe('sheet.removeopic(topic/*id or Topic instance */)', function() {
        it('remove by id', function() {
        });
        it('remove by instance', function() {
        });
    });
    describe('sheet.removeRelationship(relationship/*index, id, instance or sourceId, targetId*/)', function() {
        it('remove by id', function() {
        });
        it('remove by index', function() {
        });
        it('remove by instance', function() {
        });
        it('remove by sourceId & targetId', function() {
        });
    });
});

