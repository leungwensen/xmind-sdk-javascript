/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

var xmind = require('../../index'),
    Workbook = xmind.Workbook;

var options = {
    firstSheetId: 'firstSheet',
    rootTopicId: 'rootTopic',
    firstSheetName: 'sheet 1',
    rootTopicName: 'root topic'
};
var workbook = new Workbook(options); // first sheet added
var sheet = workbook.getPrimarySheet();
var rootTopic = sheet.rootTopic;

var secondTopicOptions = {
    id: 'secondTopic',
    title: 'second topic'
};
rootTopic.addChild(secondTopicOptions);

var thirdTopicOptions = {
    id: 'thirdTopic',
    title: 'third topic'
};
rootTopic.addChild(thirdTopicOptions);

var relationship = sheet.addRelationship({
    sourceId: options.rootTopicId,
    targetId: secondTopicOptions.id
});

describe('Relationship', function () {
    it('relationship.getSource()', function() {
        assert.equal(
            relationship.getSource(),
            options.rootTopicId,
            'relationship.getSource() not working: sourceId not correct'
        );
    });
    it('relationship.setSource(value)', function() {
        assert.doesNotThrow(function() {
            relationship.setSource(thirdTopicOptions.id);
        }, 'failed to execute relationship.setSource(value)');
        assert.equal(
            relationship.getSource(),
            thirdTopicOptions.id,
            'relationship.setSource(value) not working: source not correct'
        );
        assert.throws(function() {
            relationship.setSource(secondTopicOptions.id);
        }, 'cannot set source and target the same value');
    });
    it('relationship.getTarget()', function() {
        assert.equal(
            relationship.getTarget(),
            secondTopicOptions.id,
            'relationship.getTarget() not working: targetId not correct'
        );
    });
    it('relationship.setTarget(value)', function() {
        assert.doesNotThrow(function() {
            relationship.setTarget(options.rootTopicId);
        }, 'failed to execute relationship.setTarget(value)');
        assert.equal(
            relationship.getTarget(),
            options.rootTopicId,
            'relationship.setTarget(value) not working: target not correct'
        );
        assert.throws(function() {
            relationship.setTarget(thirdTopicOptions.id);
        }, 'cannot set source and target the same value');
    });
    it('relationship.getTitle()', function() {
        assert.equal(
            relationship.getTitle(),
            '',
            'relationship.getTitle() not working: title not correct'
        );
    });
    it('relationship.setTitle(value)', function() {
        var title = 'strange relationship';
        assert.doesNotThrow(function() {
            relationship.setTitle(title);
        }, 'failed to execute relationship.setTitle(value)');
        assert.equal(
            relationship.getTitle(),
            title,
            'relationship.setTitle(value) not working: title not correct'
        );
    });
    it('relationship.toPlainObject()', function() {
        relationship.setModifiedTime(1);
        assert.deepEqual(
            relationship.toPlainObject(), {
                id: relationship.id,
                sheetId: sheet.id,
                sourceId: relationship.getSource(),
                targetId: relationship.getTarget(),
                modifiedTime: 1,
                title: relationship.getTitle()
            },
            'relationship.setTitle(value) not working: title not correct'
        );
    });
});

