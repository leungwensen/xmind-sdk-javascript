/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

var xmind = require('../../index'),
    Workbook = xmind.Workbook;

var xmind = require('../../index'),
    Workbook = xmind.Workbook;
    //Legend = xmind.Legend,
    //CONST = xmind.CONST,
    //utils = xmind.utils;

var options = {
    firstSheetId: 'firstSheet',
    rootTopicId: 'rootTopic',
    firstSheetName: 'sheet 1',
    rootTopicName: 'root topic',
};
var workbook = new Workbook(options); // first sheet added
var sheet = workbook.getPrimarySheet();
var topic = sheet.getRootTopic();

describe('Topic', function () {
    it('Topic.getTopic(topic/*index, id or instance*/, sheet)', function() {
    });
    it('topic.getTitle()', function() {
        assert.equal(
            topic.getTitle(),
            options.rootTopicName,
            'topic.getTitle() not working: title is not correct'
        );
    });
    it('topic.setTitle(title)', function() {
        var newTitle = 'new topic';
        assert.doesNotThrow(function() {
            topic.setTitle(newTitle);
        }, 'failed to execute topic.setTitle(title)');
        assert.equal(
            topic.getTitle(),
            newTitle,
            'topic.setTitle(title) not working: title is not correct'
        );
    });
    it('topic.getModifiedTime()', function() {
        assert.doesNotThrow(function() {
            new Date(topic.getModifiedTime());
        }, 'failed to execute topic.getModifiedTime()');
    });
    it('topic.getBranch()', function() {
    });
    it('topic.setBranch(value)', function() {
    });
    it('topic.setBranchFolded()', function() {
    });
    it('topic.addChild(/*instance or options*/)', function() {
    });
    it('topic.moveTo(targetTopic)', function() {
    });
    it('topic.moveChild(fromIndex, toIndex)', function() {
    });
    it('topic.getNotes()', function() {
    });
    it('topic.setNotes(notes)', function() {
    });
    it('topic.getLabels()', function() {
    });
    it('topic.setLabels(labels)', function() {
    });
    it('topic.getHyperlink()', function() {
    });
    it('topic.setHyperlink(hyperlink)', function() {
    });
    it('topic.removeHyperlink()', function() {
    });
    it('topic.getMarkers()', function() {
    });
    it('topic.setMarkers(markers)', function() {
    });
    it('topic.addMarker(id)', function() {
    });
    it('topic.removeMarker(id)', function() {
    });
    describe('topic.setModifiedTime()', function() {
        var newModifiedTime = 1;
        it('set by timestamp(number)', function() {
            assert.doesNotThrow(function() {
                topic.setModifiedTime(newModifiedTime);
            }, 'failed to execute topic.setModifiedTime(timestamp)');
            assert.equal(
                topic.getModifiedTime(),
                newModifiedTime,
                'topic.setModifiedTime(timestamp) not working: timestamp is not correct'
            );
        });
        it('set by instance of Date', function() {
            assert.doesNotThrow(function() {
                topic.setModifiedTime(new Date(newModifiedTime));
            }, 'failed to execute topic.setModifiedTime(date)');
            assert.equal(
                topic.getModifiedTime(),
                newModifiedTime,
                'topic.setModifiedTime(timestamp) not working: timestamp is not correct'
            );
        });
    });
    describe('topic.removeChild(child/*id or instance*/, dryrun)', function() {
        it('remove by id', function() {
        });
        it('remove by instance', function() {
        });
        it('remove in dryrun mode', function() {
        });
    });
});

