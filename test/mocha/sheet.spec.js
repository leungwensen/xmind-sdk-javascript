/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

var pastry = require('pastry'),
    sprintf = pastry.sprintf;

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

var secondTopicOptions = {
    id: 'secondTopic',
    title: 'second topic'
};

var relationshipOptions = {
    id: 'relationship',
    sourceId: options.rootTopicId,
    targetId: secondTopicOptions.id
};
var secondRelationshipOptions = {
    id: 'secondRelationship',
    sourceId: options.rootTopicId,
    targetId: secondTopicOptions.id
};

var relationship;
var rootTopic;
var legend;

describe('Sheet', function () {
    it('sheet.rootTopic', function() {
        rootTopic = sheet.rootTopic;
        rootTopic.addChild(secondTopicOptions);
        assert.ok(
            rootTopic,
            'sheet.rootTopic is null'
        );
    });
    it('sheet.topics', function() {
        assert.equal(
            sheet.topics.length,
            2,
            'sheet.topics is not correct'
        );
    });
    it('sheet.topicById', function() {
        assert.equal(
            sheet.topicById[options.rootTopicId],
            rootTopic,
            'sheet.topicById is not correct'
        );
    });
    it('sheet.relationships', function() {
        relationship = sheet.addRelationship(relationshipOptions); // the first relationship added
        assert.equal(
            sheet.relationships.length,
            1,
            'sheet.relationships is not correct'
        );
    });
    it('sheet.relationshipById', function() {
        assert.equal(
            sheet.relationshipById[relationshipOptions.id],
            relationship,
            'sheet.relationshipById is not correct'
        );
    });
    it('sheet.legend', function() {
        legend = sheet.addLegend();
        assert.ok(
            legend,
            'sheet.legend is not correct'
        );
    });
    it('sheet.getTitle()', function() {
        assert.equal(
            sheet.getTitle(),
            options.firstSheetName,
            'sheet.getTitle() not working: title is not correct'
        );
    });
    it('sheet.setTitle(title)', function() {
        var newTitle = 'new sheet';
        assert.doesNotThrow(function() {
            sheet.setTitle(newTitle);
        }, 'failed to execute sheet.setTitle(title)');
        assert.equal(
            sheet.getTitle(),
            newTitle,
            'sheet.setTitle(title) not working: title is not correct'
        );
    });
    it('sheet.getModifiedTime()', function() {
        assert.doesNotThrow(function() {
            new Date(sheet.getModifiedTime());
        }, 'failed to execute sheet.getModifiedTime()');
    });
    it('sheet.getTheme()', function() {
        assert.equal(
            sheet.getTheme(),
            '',
            'sheet.getTheme() not working: theme is not correct'
        );
    });
    it('sheet.setTheme(theme)', function() {
        var newTheme = 'theme';
        var oldModifiedTime = sheet.getModifiedTime();
        assert.doesNotThrow(function() {
            sheet.setTheme(newTheme);
        }, 'failed to execute sheet.setTheme(theme)');
        assert.equal(
            sheet.getTheme(),
            newTheme,
            'sheet.setTheme(theme) not working: theme is not correct'
        );
        assert.notEqual(
            sheet.getModifiedTime(),
            oldModifiedTime,
            'sheet.setTheme() not working: did not change modified time'
        );
    });
    it('sheet.getRootTopic()', function() {
        assert.equal(
            sheet.getRootTopic(),
            rootTopic,
            'sheet.getRootTopic() not working: rootTopic is not correct'
        );
    });
    describe('sheet.addRelationship(options)', function() {
        it('adding normally', function() {
            assert.doesNotThrow(function() {
                sheet.addRelationship(secondRelationshipOptions);
            }, 'failed to execute sheet.addRelationship(options)');
            assert.equal(
                sheet.relationships.length,
                2,
                'sheet.addRelationship(options) not working: relationship not added'
            );
        });
        it('adding with the same parameters', function() {
            assert.throws(function() {
                sheet.addRelationship(relationshipOptions);
            }, 'expected sheet.addRelationship(options) to throw error when adding with the same parameters');
        });
    });
    describe('sheet.setModifiedTime()', function() {
        var newModifiedTime = 1;
        it('set by timestamp(number)', function() {
            assert.doesNotThrow(function() {
                sheet.setModifiedTime(newModifiedTime);
            }, 'failed to execute sheet.setModifiedTime(timestamp)');
            assert.equal(
                sheet.getModifiedTime(),
                newModifiedTime,
                'sheet.setModifiedTime(timestamp) not working: timestamp is not correct'
            );
        });
        it('set by instance of Date', function() {
            assert.doesNotThrow(function() {
                sheet.setModifiedTime(new Date(newModifiedTime));
            }, 'failed to execute sheet.setModifiedTime(date)');
            assert.equal(
                sheet.getModifiedTime(),
                newModifiedTime,
                'sheet.setModifiedTime(timestamp) not working: timestamp is not correct'
            );
        });
    });
    describe('sheet.removeRelationship(relationship/*index, id, instance or sourceId, targetId*/)', function() {
        it('sheet.relationshipsNode is a shortcut', function() {
        });

        function checkRelationships(type) {
            assert.equal(
                workbook.doc.childNodes.length,
                1,
                sprintf(
                    'workbook.removeSheet(%s) not working: xml structure did not changed',
                    type
                )
            );
            assert.equal(
                workbook.sheets.length,
                1,
                sprintf(
                    'workbook.removeSheet(%s) not working: workbook.sheets did not changed',
                    type
                )
            );
            assert.ok(
                !workbook.sheetById[secondRelationshipOptions.id],
                sprintf(
                    'workbook.removeSheet(%s) not working: workbook.sheetById did not changed',
                    type
                )
            );
        }
        it('remove by id', function() {
            assert.doesNotThrow(function() {
                sheet.removeRelationship(secondRelationshipOptions.id); // secondSheet
            }, 'failed to execute workbook.removeSheet(id)');
            checkRelationships();
        });
        it('remove by index', function() {
            sheet.addRelationship(secondRelationshipOptions); // reverse
            assert.doesNotThrow(function() {
                sheet.removeRelationship(1); // secondSheet
            }, 'failed to execute workbook.removeSheet(id)');
            checkRelationships();
        });
        it('remove by instance', function() {
            var secondRelationship = sheet.addRelationship(secondRelationshipOptions); // reverse
            assert.doesNotThrow(function() {
                sheet.removeRelationship(secondRelationship); // secondSheet
            }, 'failed to execute workbook.removeSheet(instance)');
            checkRelationships();
        });
        it('remove by sourceId & targetId', function() {
            sheet.addRelationship(secondRelationshipOptions); // reverse
            assert.doesNotThrow(function() {
                sheet.removeRelationship(
                    secondRelationshipOptions.sourceId,
                    secondRelationshipOptions.targetId
                ); // secondSheet
            }, 'failed to execute workbook.removeSheet(sourceId, targetId)');
            checkRelationships();
        });
    });
    it('sheet.destroy()', function () {
    });
});

