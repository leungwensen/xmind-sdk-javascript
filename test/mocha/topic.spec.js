/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

var pastry = require('pastry'),
    json = pastry.json;

var xmind = require('../../index'),
    Workbook = xmind.Workbook;

var xmind = require('../../index'),
    Workbook = xmind.Workbook,
    Topic = xmind.Topic,
    CONST = xmind.CONST,
    utils = xmind.utils;

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
    it('Topic.getTopic(topic/*id or instance*/, sheet)', function() {
        assert.equal(
            Topic.getTopic(options.rootTopicId, sheet),
            topic,
            'Topic.getTopic(id, sheet) not working: topic is not correct'
        );
        assert.equal(
            Topic.getTopic(topic, sheet),
            topic,
            'Topic.getTopic(topic, sheet) not working: topic is not correct'
        );
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
        assert.equal(
            topic.getBranch(),
            '',
            'topic.getBranch() not working: branch is not correct'
        );
    });
    it('topic.setBranch(value)', function() {
        var branch = 'something';
        assert.doesNotThrow(function() {
            topic.setBranch(branch);
        }, 'failed to execute sheet.setBranch(value)');
        assert.equal(
            topic.getBranch(),
            branch,
            'topic.setBranch(value) not working: branch is not correct'
        );
    });
    it('topic.setBranchFolded()', function() {
        assert.doesNotThrow(function() {
            topic.setBranchFolded();
        }, 'failed to execute sheet.setBranchFolded()');
        assert.equal(
            topic.getBranch(),
            CONST.VAL_FOLDED,
            'topic.setBranchFolded() not working: branch is not correct'
        );
    });
    //it('topic.moveChild(fromIndex, toIndex)', function() {});
    it('topic.getNotes()', function() {
        assert.equal(
            topic.getNotes(),
            '',
            'topic.getNotes() not working: notes is not correct'
        );
    });
    it('topic.setNotes(notes)', function() {
        var notes = 'some notes';
        var multiLineNotes = 'some notes\nother notes';
        assert.doesNotThrow(function() {
            topic.setNotes(notes);
        }, 'failed to execute sheet.setNotes(notes)');
        assert.equal(
            topic.getNotes(),
            notes,
            'topic.setNotes(notes) not working: notes is not correct'
        );
        assert.equal(
            topic.setNotes(multiLineNotes).getNotes(),
            multiLineNotes,
            'topic.setNotes(notes) not working: notes is not correct'
        );
    });
    it('topic.getLabels()', function() {
        assert.equal(
            json.stringify(topic.getLabels()),
            json.stringify([]),
            'topic.getLabels() not working: labels is not correct'
        );
    });
    it('topic.getHyperlink()', function() {
        assert.equal(
            topic.getHyperlink(),
            '',
            'topic.getHyperlink() not working: link is not correct'
        );
    });
    it('topic.setHyperlink(hyperlink)', function() {
        var link = 'http://sample.com';
        assert.equal(
            topic.setHyperlink(link).getHyperlink(),
            link,
            'topic.setHyperlink(hyperlink) not working: link is not correct'
        );
    });
    it('topic.removeHyperlink()', function() {
        assert.equal(
            topic.removeHyperlink().getHyperlink(),
            '',
            'topic.removeHyperlink() not working: link is not correct'
        );
    });
    it('topic.getMarkers()', function() {
        assert.equal(
            json.stringify(topic.getMarkers()),
            json.stringify([]),
            'topic.getMarkers() not working: markders is not correct'
        );
    });
    it('topic.setMarkers(markers)', function() {
        var markers = [
            'a',
            'bc',
            'd'
        ];
        assert.doesNotThrow(function() {
            topic.setMarkers(markers);
        }, 'failed to execute sheet.setMarkers(markers)');
        assert.equal(
            json.stringify(topic.getMarkers()),
            json.stringify([
                'a',
                'bc',
                'd'
            ]), 'topic.setMarkers(markers) not working: markers is not correct'
        );
    });
    it('topic.addMarker(id)', function() {
        topic.setMarkers([]);
        assert.equal(
            json.stringify(topic.addMarker('face').getMarkers()),
            json.stringify([
                'face'
            ]), 'topic.addMarker(markerId) not working: markers is not correct'
        );
    });
    it('topic.removeMarker(id)', function() {
        topic.setMarkers([]);
        assert.equal(
            json.stringify(topic.addMarker('face').removeMarker('face').getMarkers()),
            json.stringify([]),
            'topic.addMarker(markerId) not working: markers is not correct'
        );
    });

    var secondTopicOptions = {
        id: 'secondTopic',
        title: 'second topic'
    };
    var thirdTopicOptions = {
        id: 'thirdTopic',
        title: 'third topic'
    };
    var forthTopicOptions = {
        id: 'forthTopic',
        title: 'forth topic'
    };
    var secondTopic = topic.addChild(secondTopicOptions);
    var thirdTopic = topic.addChild(thirdTopicOptions);
    var forthTopic = topic.addChild(forthTopicOptions);

    describe('topic.isAncestorOf(targetTopic)', function() {
        it('check by id', function() {
            assert.equal(
                secondTopic.isAncestorOf(topic.id), false,
                'topic.isAncestorOf(targetTopic) not working: result is wrong'
            );
            assert.equal(
                topic.isAncestorOf(secondTopic.id), true,
                'topic.isAncestorOf(targetTopic) not working: result is wrong'
            );
        });
        it('check by instance', function() {
            assert.equal(
                secondTopic.isAncestorOf(topic), false,
                'topic.isAncestorOf(targetTopic) not working: result is wrong'
            );
            assert.equal(
                topic.isAncestorOf(secondTopic), true,
                'topic.isAncestorOf(targetTopic) not working: result is wrong'
            );
        });
    });
    describe('topic.moveTo(targetTopic)', function() {
        it('move by id', function() {
            assert.doesNotThrow(function() {
                thirdTopic.moveTo(secondTopic.id);
            }, 'failed to execute topic.moveTo(targetTopicId)');
        });
        it('move by instance', function() {
            assert.doesNotThrow(function() {
                forthTopic.moveTo(thirdTopic);
            }, 'failed to execute topic.moveTo(targetTopic)');
        });
        it('moving to null', function() {
            assert.throws(function() {
                forthTopic.moveTo();
            }, 'topic.moveTo(targetTopic) not working: cannot move to null');
        });
        it('moving to itself', function() {
            assert.throws(function() {
                forthTopic.moveTo(forthTopic);
            }, 'topic.moveTo(targetTopic) not working: cannot move to itself');
        });
        it('moving to child', function() {
            assert.throws(function() {
                secondTopic.moveTo(forthTopic);
            }, 'topic.moveTo(targetTopic) not working: cannot move to child topic');
        });
        it('moving to ancestor', function() {
            assert.doesNotThrow(function() {
                forthTopic.moveTo(secondTopic);
            }, 'failed to execute topic.moveTo(targetTopic)');
            assert.equal(
                forthTopic.children.length, 0,
                'topic.moveTo(targetTopic) not working: count of children is wrong'
            );
            assert.equal(
                thirdTopic.children.length, 0,
                'topic.moveTo(targetTopic) not working: count of children is wrong'
            );
            assert.equal(
                secondTopic.children.length, 2,
                'topic.moveTo(targetTopic) not working: count of children is wrong'
            );
            assert.equal(
                topic.children.length, 1,
                'topic.moveTo(targetTopic) not working: count of children is wrong'
            );

            function checkXmlStructure(parentTopic, childTopic) {
                var childrenNode = utils.findOrCreateChildNode(
                    parentTopic.doc, CONST.TAG_CHILDREN
                );
                var childrenTopicsNode = utils.findOrCreateChildNode(
                    childrenNode, CONST.TAG_TOPICS
                );
                assert.ok(!!utils.findChildNode(childrenTopicsNode, CONST.TAG_TOPIC, {
                    id: childTopic.id
                }), 'topic.moveTo(targetTopic) not working: xml structure is not correctly changed');
            }

            checkXmlStructure(topic, secondTopic);
            checkXmlStructure(secondTopic, thirdTopic);
            checkXmlStructure(secondTopic, forthTopic);
        });
    });
    // add test cases for floating topics {
    // }
    describe('topic.setLabels(labels)', function() {
        var labelsStr = 'a, bc , d';
        var labels = [
            'hello',
            'world '
        ];
        it('set with string', function() {
            assert.doesNotThrow(function() {
                topic.setLabels(labelsStr);
            }, 'failed to execute sheet.setLabels(labels)');
            assert.equal(
                json.stringify(topic.getLabels()),
                json.stringify([
                    'a',
                    'bc',
                    'd'
                ]), 'topic.setLabels(labels) not working: labels is not correct'
            );
            assert.equal(
                json.stringify(topic.setLabels(labels).getLabels()),
                json.stringify([
                    'hello',
                    'world'
                ]), 'topic.setLabels(labels) not working: labels is not correct'
            );
        });
        it('set with array', function() {
        });
    });
    describe('topic.addChild(/*instance or options*/)', function() {
        it('add with an instance', function() {
        });
        it('add with options', function() {
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
});

