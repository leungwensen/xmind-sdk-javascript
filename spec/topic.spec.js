const assert = chai.assert;
const Workbook = xmind.Workbook;
const Topic = xmind.Topic;
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
const topic = sheet.getRootTopic();

describe('Topic', () => {
  it('Topic.getTopic(topic/*id or instance*/, sheet)', () => {
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
  it('topic.getTitle()', () => {
    assert.equal(
      topic.getTitle(),
      options.rootTopicName,
      'topic.getTitle() not working: title is not correct'
    );
  });
  it('topic.setTitle(title)', () => {
    const newTitle = 'new topic';
    assert.doesNotThrow(() => {
      topic.setTitle(newTitle);
    }, 'failed to execute topic.setTitle(title)');
    assert.equal(
      topic.getTitle(),
      newTitle,
      'topic.setTitle(title) not working: title is not correct'
    );
  });
  it('topic.getModifiedTime()', () => {
    assert.doesNotThrow(() => {
      new Date(topic.getModifiedTime());
    }, 'failed to execute topic.getModifiedTime()');
  });
  it('topic.getBranch()', () => {
    assert.equal(
      topic.getBranch(),
      '',
      'topic.getBranch() not working: branch is not correct'
    );
  });
  it('topic.setBranch(value)', () => {
    const branch = 'something';
    assert.doesNotThrow(() => {
      topic.setBranch(branch);
    }, 'failed to execute sheet.setBranch(value)');
    assert.equal(
      topic.getBranch(),
      branch,
      'topic.setBranch(value) not working: branch is not correct'
    );
  });
  it('topic.setBranchFolded()', () => {
    assert.doesNotThrow(() => {
      topic.setBranchFolded();
    }, 'failed to execute sheet.setBranchFolded()');
    assert.equal(
      topic.getBranch(),
      CONST.VAL_FOLDED,
      'topic.setBranchFolded() not working: branch is not correct'
    );
  });
  // it('topic.moveChild(fromIndex, toIndex)', function() {});
  it('topic.getNotes()', () => {
    assert.equal(
      topic.getNotes(),
      '',
      'topic.getNotes() not working: notes is not correct'
    );
  });
  it('topic.setNotes(notes)', () => {
    const notes = 'some notes';
    const multiLineNotes = 'some notes\nother notes';
    assert.doesNotThrow(() => {
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
  it('topic.getLabels()', () => {
    assert.equal(
      JSON.stringify(topic.getLabels()),
      JSON.stringify([]),
      'topic.getLabels() not working: labels is not correct'
    );
  });
  it('topic.getHyperlink()', () => {
    assert.equal(
      topic.getHyperlink(),
      '',
      'topic.getHyperlink() not working: link is not correct'
    );
  });
  it('topic.setHyperlink(hyperlink)', () => {
    const link = 'http://sample.com';
    assert.equal(
      topic.setHyperlink(link).getHyperlink(),
      link,
      'topic.setHyperlink(hyperlink) not working: link is not correct'
    );
  });
  it('topic.removeHyperlink()', () => {
    assert.equal(
      topic.removeHyperlink().getHyperlink(),
      '',
      'topic.removeHyperlink() not working: link is not correct'
    );
  });
  it('topic.getMarkers()', () => {
    assert.equal(
      JSON.stringify(topic.getMarkers()),
      JSON.stringify([]),
      'topic.getMarkers() not working: markders is not correct'
    );
  });
  it('topic.setMarkers(markers)', () => {
    const markers = [
      'a',
      'bc',
      'd'
    ];
    assert.doesNotThrow(() => {
      topic.setMarkers(markers);
    }, 'failed to execute sheet.setMarkers(markers)');
    assert.equal(
      JSON.stringify(topic.getMarkers()),
      JSON.stringify([
        'a',
        'bc',
        'd'
      ]), 'topic.setMarkers(markers) not working: markers is not correct'
    );
  });
  it('topic.addMarker(id)', () => {
    topic.setMarkers([]);
    assert.equal(
      JSON.stringify(topic.addMarker('face').getMarkers()),
      JSON.stringify([
        'face'
      ]), 'topic.addMarker(markerId) not working: markers is not correct'
    );
  });
  it('topic.removeMarker(id)', () => {
    topic.setMarkers([]);
    assert.equal(
      JSON.stringify(topic.addMarker('face').removeMarker('face').getMarkers()),
      JSON.stringify([]),
      'topic.addMarker(markerId) not working: markers is not correct'
    );
  });

  const secondTopicOptions = {
    id: 'secondTopic',
    title: 'second topic'
  };
  const thirdTopicOptions = {
    id: 'thirdTopic',
    title: 'third topic'
  };
  const forthTopicOptions = {
    id: 'forthTopic',
    title: 'forth topic'
  };
  const secondTopic = topic.addChild(secondTopicOptions);
  const thirdTopic = topic.addChild(thirdTopicOptions);
  const forthTopic = topic.addChild(forthTopicOptions);

  describe('topic.isAncestorOf(targetTopic)', () => {
    it('check by id', () => {
      assert.equal(
        secondTopic.isAncestorOf(topic.id), false,
        'topic.isAncestorOf(targetTopic) not working: result is wrong'
      );
      assert.equal(
        topic.isAncestorOf(secondTopic.id), true,
        'topic.isAncestorOf(targetTopic) not working: result is wrong'
      );
    });
    it('check by instance', () => {
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
  describe('topic.moveTo(targetTopic)', () => {
    it('move by id', () => {
      assert.doesNotThrow(() => {
        thirdTopic.moveTo(secondTopic.id);
      }, 'failed to execute topic.moveTo(targetTopicId)');
    });
    it('move by instance', () => {
      assert.doesNotThrow(() => {
        forthTopic.moveTo(thirdTopic);
      }, 'failed to execute topic.moveTo(targetTopic)');
    });
    it('moving to null', () => {
      assert.throws(() => {
        forthTopic.moveTo();
      }, 'target topic does not exist');
    });
    it('moving to itself', () => {
      assert.throws(() => {
        forthTopic.moveTo(forthTopic);
      }, 'cannot move to itself');
    });
    it('moving to child', () => {
      assert.throws(() => {
        secondTopic.moveTo(forthTopic);
      }, 'cannot move to a child topic');
    });
    it('moving to ancestor', () => {
      assert.doesNotThrow(() => {
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
        const childrenNode = utils.findOrCreateChildNode(
          parentTopic.doc, CONST.TAG_CHILDREN
        );
        const childrenTopicsNode = utils.findOrCreateChildNode(
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
  describe('topic.setLabels(labels)', () => {
    const labelsStr = 'a, bc , d';
    const labels = [
      'hello',
      'world '
    ];
    it('set with string', () => {
      assert.doesNotThrow(() => {
        topic.setLabels(labelsStr);
      }, 'failed to execute sheet.setLabels(labels)');
      assert.equal(
        JSON.stringify(topic.getLabels()),
        JSON.stringify([
          'a',
          'bc',
          'd'
        ]), 'topic.setLabels(labels) not working: labels is not correct'
      );
      assert.equal(
        JSON.stringify(topic.setLabels(labels).getLabels()),
        JSON.stringify([
          'hello',
          'world'
        ]), 'topic.setLabels(labels) not working: labels is not correct'
      );
    });
    it('set with array', () => {
    });
  });
  describe('topic.addChild(/*instance or options*/)', () => {
    it('add with an instance', () => {
    });
    it('add with options', () => {
    });
  });
  describe('topic.removeChild(child/*id or instance*/, dryrun)', () => {
    it('remove by id', () => {
    });
    it('remove by instance', () => {
    });
    it('remove in dryrun mode', () => {
    });
  });
  describe('topic.setModifiedTime()', () => {
    const newModifiedTime = 1;
    it('set by timestamp(number)', () => {
      assert.doesNotThrow(() => {
        topic.setModifiedTime(newModifiedTime);
      }, 'failed to execute topic.setModifiedTime(timestamp)');
      assert.equal(
        topic.getModifiedTime(),
        newModifiedTime,
        'topic.setModifiedTime(timestamp) not working: timestamp is not correct'
      );
    });
    it('set by instance of Date', () => {
      assert.doesNotThrow(() => {
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

