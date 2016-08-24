const assert = chai.assert;

const Workbook = xmind.Workbook;

const options = {
  firstSheetId: 'firstSheet',
  rootTopicId: 'rootTopic',
  firstSheetName: 'sheet 1',
  rootTopicName: 'root topic',
};
const workbook = new Workbook(options); // first sheet added
const sheet = workbook.getPrimarySheet();

const secondTopicOptions = {
  id: 'secondTopic',
  title: 'second topic'
};

const relationshipOptions = {
  id: 'relationship',
  sourceId: options.rootTopicId,
  targetId: secondTopicOptions.id
};
const secondRelationshipOptions = {
  id: 'secondRelationship',
  sourceId: options.rootTopicId,
  targetId: secondTopicOptions.id
};

let relationship;
let rootTopic;
let legend;

describe('Sheet', () => {
  it('sheet.rootTopic', () => {
    rootTopic = sheet.rootTopic;
    rootTopic.addChild(secondTopicOptions);
    assert.ok(
      rootTopic,
      'sheet.rootTopic is null'
    );
  });
  it('sheet.topics', () => {
    assert.equal(
      sheet.topics.length,
      2,
      'sheet.topics is not correct'
    );
  });
  it('sheet.topicById', () => {
    assert.equal(
      sheet.topicById[options.rootTopicId],
      rootTopic,
      'sheet.topicById is not correct'
    );
  });
  it('sheet.relationships', () => {
    relationship = sheet.addRelationship(relationshipOptions); // the first relationship added
    assert.equal(
      sheet.relationships.length,
      1,
      'sheet.relationships is not correct'
    );
  });
  it('sheet.relationshipById', () => {
    assert.equal(
      sheet.relationshipById[relationshipOptions.id],
      relationship,
      'sheet.relationshipById is not correct'
    );
  });
  it('sheet.legend', () => {
    legend = sheet.addLegend();
    assert.ok(
      legend,
      'sheet.legend is not correct'
    );
  });
  it('sheet.getTitle()', () => {
    assert.equal(
      sheet.getTitle(),
      options.firstSheetName,
      'sheet.getTitle() not working: title is not correct'
    );
  });
  it('sheet.setTitle(title)', () => {
    const newTitle = 'new sheet';
    assert.doesNotThrow(() => {
      sheet.setTitle(newTitle);
    }, 'failed to execute sheet.setTitle(title)');
    assert.equal(
      sheet.getTitle(),
      newTitle,
      'sheet.setTitle(title) not working: title is not correct'
    );
  });
  it('sheet.getModifiedTime()', () => {
    assert.doesNotThrow(() => {
      new Date(sheet.getModifiedTime());
    }, 'failed to execute sheet.getModifiedTime()');
  });
  it('sheet.getTheme()', () => {
    assert.equal(
      sheet.getTheme(),
      '',
      'sheet.getTheme() not working: theme is not correct'
    );
  });
  it('sheet.setTheme(theme)', () => {
    const newTheme = 'theme';
    const oldModifiedTime = sheet.getModifiedTime();
    assert.doesNotThrow(() => {
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
  it('sheet.getRootTopic()', () => {
    assert.equal(
      sheet.getRootTopic(),
      rootTopic,
      'sheet.getRootTopic() not working: rootTopic is not correct'
    );
  });
  describe('sheet.addRelationship(options)', () => {
    it('adding normally', () => {
      assert.doesNotThrow(() => {
        sheet.addRelationship(secondRelationshipOptions);
      }, 'failed to execute sheet.addRelationship(options)');
      assert.equal(
        sheet.relationships.length,
        2,
        'sheet.addRelationship(options) not working: relationship not added'
      );
    });
    it('adding with the same parameters', () => {
      assert.throws(() => {
        sheet.addRelationship(relationshipOptions);
      }, 'the same relationship already exists');
    });
  });
  describe('sheet.setModifiedTime()', () => {
    const newModifiedTime = 1;
    it('set by timestamp(number)', () => {
      assert.doesNotThrow(() => {
        sheet.setModifiedTime(newModifiedTime);
      }, 'failed to execute sheet.setModifiedTime(timestamp)');
      assert.equal(
        sheet.getModifiedTime(),
        newModifiedTime,
        'sheet.setModifiedTime(timestamp) not working: timestamp is not correct'
      );
    });
    it('set by instance of Date', () => {
      assert.doesNotThrow(() => {
        sheet.setModifiedTime(new Date(newModifiedTime));
      }, 'failed to execute sheet.setModifiedTime(date)');
      assert.equal(
        sheet.getModifiedTime(),
        newModifiedTime,
        'sheet.setModifiedTime(timestamp) not working: timestamp is not correct'
      );
    });
  });
  describe('sheet.removeRelationship(relationship/*index, id, instance or sourceId, targetId*/)', () => {
    it('sheet.relationshipsNode is a shortcut', () => {
    });

    function checkRelationships(type) {
      assert.equal(
        workbook.doc.childNodes.length,
        1,
        `workbook.removeSheet(${type}) not working: xml structure did not changed`
      );
      assert.equal(
        workbook.sheets.length,
        1,
        `workbook.removeSheet(${type}) not working: workbook.sheets did not changed`
      );
      assert.ok(
        !workbook.sheetById[secondRelationshipOptions.id],
        `workbook.removeSheet(${type}) not working: workbook.sheetById did not changed`
      );
    }

    it('remove by id', () => {
      assert.doesNotThrow(() => {
        sheet.removeRelationship(secondRelationshipOptions.id); // secondSheet
      }, 'failed to execute workbook.removeSheet(id)');
      checkRelationships();
    });
    it('remove by index', () => {
      sheet.addRelationship(secondRelationshipOptions); // reverse
      assert.doesNotThrow(() => {
        sheet.removeRelationship(1); // secondSheet
      }, 'failed to execute workbook.removeSheet(id)');
      checkRelationships();
    });
    it('remove by instance', () => {
      const secondRelationship = sheet.addRelationship(secondRelationshipOptions); // reverse
      assert.doesNotThrow(() => {
        sheet.removeRelationship(secondRelationship); // secondSheet
      }, 'failed to execute workbook.removeSheet(instance)');
      checkRelationships();
    });
    it('remove by sourceId & targetId', () => {
      sheet.addRelationship(secondRelationshipOptions); // reverse
      assert.doesNotThrow(() => {
        sheet.removeRelationship(
          secondRelationshipOptions.sourceId,
          secondRelationshipOptions.targetId
        ); // secondSheet
      }, 'failed to execute workbook.removeSheet(sourceId, targetId)');
      checkRelationships();
    });
  });
  it('sheet.destroy()', () => {
  });
});

