const assert = chai.assert;

const Workbook = xmind.Workbook;
const Legend = xmind.Legend;
const CONST = xmind.CONST;
const utils = xmind.utils;

const options = {
  firstSheetId: 'firstSheet',
  rootTopicId: 'rootTopic',
  firstSheetName: 'sheet 1',
  rootTopicName: 'root topic',
};
const workbook = new Workbook(options); // first sheet added
const sheet = workbook.getPrimarySheet();
const legend = sheet.addLegend();
const markerId = CONST.MAKERIDS[0];
const description = 'flag black';
let markerDescriptionNode;
const attrs = {};
attrs[CONST.ATTR_MARKERID] = markerId;
attrs[CONST.ATTR_DESCRIPTION] = description;

describe('Legend', () => {
  it('legend.addMarkerDescription(markerId, description)', () => {
    assert.doesNotThrow(() => {
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
  it('legend.removeMarkerDescription(markerId)', () => {
    assert.doesNotThrow(() => {
      legend.removeMarkerDescription(markerId);
    }, 'failed to execute legend.removeMarkerDescription(markerId)');
    assert.equal(
      legend.markerDescriptionsNode.childNodes.length,
      0,
      'legend.removeMarkerDescription(markerId) not working: xml structure is wrong'
    );
  });

  it('legend.getVisibility()', () => {
    assert.equal(
      legend.getVisibility(),
      Legend.DEFAULT_VISIBILITY,
      'legend.getVisibility() not working: visibility not correct'
    );
  });
  it('legend.setVisibility(value)', () => {
    const visibility = 'invisible';
    assert.doesNotThrow(() => {
      legend.setVisibility(visibility);
    }, 'failed to execute legend.setVisibility(value)');
    assert.equal(
      legend.getVisibility(),
      visibility,
      'legend.setVisibility(value) not working: visibility not correct'
    );
  });

  it('legend.getPosition()', () => {
    assert.deepEqual(
      legend.getPosition(),
      Legend.DEFAULT_POSITION,
      'legend.getPosition() not working: position not correct'
    );
  });
  it('legend.setPosition(point)', () => {
    const point = {
      x: 200,
      y: 200
    };
    assert.doesNotThrow(() => {
      legend.setPosition(point);
    }, 'failed to execute legend.setPosition(point)');
    assert.deepEqual(
      legend.getPosition(),
      point,
      'legend.setPosition(point) not working: position not correct'
    );
  });
});
