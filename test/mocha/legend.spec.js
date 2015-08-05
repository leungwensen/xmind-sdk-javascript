/* jshint undef: true, unused: true, node: true */
/* global require, describe, it */

var assert = require('assert');

var xmind = require('../../index'),
    Workbook = xmind.Workbook,
    Legend = xmind.Legend,
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
var legend = sheet.addLegend();
var markerId = CONST.MAKERIDS[0];
var description = 'flag black';
var markerDescriptionNode;
var attrs = {};
attrs[CONST.ATTR_MARKERID] = markerId;
attrs[CONST.ATTR_DESCRIPTION] = description;

describe('Legend', function () {
    it('legend.addMarkerDescription(markerId, description)', function() {
        assert.doesNotThrow(function() {
            legend.addMarkerDescription(markerId, description);
            markerDescriptionNode = utils.findChildNode(
                legend.markerDescriptionsNode,
                CONST.TAG_MARKER_DESCRIPTION,
                attrs
            );
        }, 'failed to execute legend.addMarkerDescription(markerId, description)');
        assert.ok(
            markerDescriptionNode,
            'legend.addMarkerDescription(markerId, description) not working: xml structure is wrong'
        );
    });
    it('legend.removeMarkerDescription(markerId)', function() {
        assert.doesNotThrow(function() {
            legend.removeMarkerDescription(markerId);
        }, 'failed to execute legend.removeMarkerDescription(markerId)');
        assert.equal(
            legend.markerDescriptionsNode.childNodes.length,
            0,
            'legend.removeMarkerDescription(markerId) not working: xml structure is wrong'
        );
    });

    it('legend.getVisibility()', function() {
        assert.equal(
            legend.getVisibility(),
            Legend.DEFAULT_VISIBILITY,
            'legend.getVisibility() not working: visibility not correct'
        );
    });
    it('legend.setVisibility(value)', function() {
        var visibility = 'invisible';
        assert.doesNotThrow(function() {
            legend.setVisibility(visibility);
        }, 'failed to execute legend.setVisibility(value)');
        assert.equal(
            legend.getVisibility(),
            visibility,
            'legend.setVisibility(value) not working: visibility not correct'
        );
    });

    it('legend.getPosition()', function() {
        assert.deepEqual(
            legend.getPosition(),
            Legend.DEFAULT_POSITION,
            'legend.getPosition() not working: position not correct'
        );
    });
    it('legend.setPosition(point)', function() {
        var point = {
            x: 200,
            y: 200
        };
        assert.doesNotThrow(function() {
            legend.setPosition(point);
        }, 'failed to execute legend.setPosition(point)');
        assert.deepEqual(
            legend.getPosition(),
            point,
            'legend.setPosition(point) not working: position not correct'
        );
    });
});

