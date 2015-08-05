/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

//var path = require('path'),
    //resolve = path.resolve;

var xmind = require('../../index'),
    Workbook = xmind.Workbook;

describe('Workbook', function () {
    var options = {
        firstSheetId: 'firstSheet',
        rootTopicId: 'rootTopic',
        firstSheetName: 'sheet 1',
        rootTopicName: 'root topic',
    };
    var workbook,
        sheet,
        rootTopic;

    it('new Workbook(options)', function () {
        assert.doesNotThrow(function() {
            workbook = new Workbook(options); // first sheet added
            sheet = workbook.getPrimarySheet();
            rootTopic = sheet.rootTopic;
        }, 'failed to create a Workbook instance');
    });
    it('workbook.sheetById', function () {
        assert.equal(
            workbook.sheetById[options.firstSheetId],
            sheet,
            'workbook.sheetById is not working'
        );
    });
    it('workbook.sheets', function () {
        assert.equal(
            workbook.sheets[0],
            sheet,
            'workbook.sheets is not working'
        );
    });

    it('workbook.getModifiedTime()', function() {
        assert.doesNotThrow(function() {
            new Date(workbook.getModifiedTime());
        }, 'failed to execute workbook.getModifiedTime()');
    });

    it('workbook.getPrimarySheet()', function () {
        assert.equal(
            options.firstSheetName,
            sheet.getTitle(),
            'sheet name unmatched'
        );
        assert.equal(
            options.rootTopicName,
            rootTopic.getTitle(),
            'root topic name unmatched'
        );
    });

    var secondSheetOptions = {
        id: 'secondSheet',
        title: 'sheet 2',
        rootTopicId: 'rootTopic',
        rootTopicName: 'root topic',
    };
    it('workbook.addSheet(options)', function () {
        assert.throws(function() {
            workbook.addSheet({
                id: options.firstSheetId, // duplicated id
                title: '',
                rootTopicId: 'some id',
                rootTopicName: 'some name',
            });
        }, 'can create a sheet with a duplicated id');
        assert.doesNotThrow(function() {
            workbook.addSheet(secondSheetOptions); // second sheet added
        }, 'failed to execute workbook.addSheet(options)');
    });
    it('workbook.moveSheet(fromIndex, toIndex)', function () {
        assert.doesNotThrow(function() {
            workbook.moveSheet(1, 0);
        }, 'failed to execute workbook.moveSheet(fromIndex, toIndex)');
        assert.equal(
            workbook.doc.firstChild.getAttribute('id'),
            workbook.sheets[0].doc.getAttribute('id'),
            'workbook.moveSheet(fromIndex, toIndex) not working: xml structure did not changed'
        );
        assert.notEqual(
            workbook.getPrimarySheet(),
            sheet,
            'workbook.moveSheet(fromIndex, toIndex) not working'
        );
    });
    it('workbook.destroy()', function () {
        workbook.destroy();
        assert.ok(
            workbook,
            'workbook should not be destroyed'
        );
    });
    it('workbook.toJSON()', function () {
        assert.doesNotThrow(function() {
            workbook.toJSON();
        });
    });
    describe('workbook.setModifiedTime()', function() {
        var newModifiedTime = 1;
        it('set by timestamp(number)', function() {
            assert.doesNotThrow(function() {
                workbook.setModifiedTime(newModifiedTime);
            }, 'failed to execute workbook.setModifiedTime(timestamp)');
            assert.equal(
                workbook.getModifiedTime(),
                newModifiedTime,
                'workbook.setModifiedTime(timestamp) not working: timestamp is not correct'
            );
        });
        it('set by instance of Date', function() {
            assert.doesNotThrow(function() {
                workbook.setModifiedTime(new Date(newModifiedTime));
            }, 'failed to execute workbook.setModifiedTime(date)');
            assert.equal(
                workbook.getModifiedTime(),
                newModifiedTime,
                'workbook.setModifiedTime(timestamp) not working: timestamp is not correct'
            );
        });
    });
    describe('workbook.removeSheet(/* id or index or Sheet instance */)', function () {
        it('remove by id', function() {
            assert.doesNotThrow(function() {
                workbook.removeSheet(secondSheetOptions.id); // secondSheet
            }, 'failed to execute workbook.removeSheet(id)');
            assert.equal(
                workbook.doc.childNodes.length,
                1,
                'workbook.removeSheet(id) not working: xml structure did not changed'
            );
            assert.equal(
                workbook.sheets.length,
                1,
                'workbook.removeSheet(id) not working: workbook.sheets did not changed'
            );
            assert.ok(
                !workbook.sheetById[secondSheetOptions.id],
                'workbook.removeSheet(id) not working: workbook.sheetById did not changed'
            );
        });
        it('remove by index', function() {
            workbook.addSheet(secondSheetOptions); // reverse
            assert.doesNotThrow(function() {
                workbook.removeSheet(1); // secondSheet
            }, 'failed to execute workbook.removeSheet(index)');
            assert.equal(
                workbook.doc.childNodes.length,
                1,
                'workbook.removeSheet(index) not working: xml structure did not changed'
            );
            assert.equal(
                workbook.sheets.length,
                1,
                'workbook.removeSheet(index) not working: workbook.sheets did not changed'
            );
            assert.ok(
                !workbook.sheetById[secondSheetOptions.id],
                'workbook.removeSheet(index) not working: workbook.sheetById did not changed'
            );
        });
        it('remove by instance', function() {
            var secondSheet = workbook.addSheet(secondSheetOptions); // reverse
            assert.doesNotThrow(function() {
                workbook.removeSheet(secondSheet); // secondSheet
            }, 'failed to execute workbook.removeSheet(index)');
            assert.equal(
                workbook.doc.childNodes.length,
                1,
                'workbook.removeSheet(index) not working: xml structure did not changed'
            );
            assert.equal(
                workbook.sheets.length,
                1,
                'workbook.removeSheet(index) not working: workbook.sheets did not changed'
            );
            assert.ok(
                !workbook.sheetById[secondSheetOptions.id],
                'workbook.removeSheet(index) not working: workbook.sheetById did not changed'
            );
        });
    });
});

