const assert = chai.assert;

const Workbook = xmind.Workbook;

const options = {
  firstSheetId: 'firstSheet',
  rootTopicId: 'rootTopic',
  firstSheetName: 'sheet 1',
  rootTopicName: 'root topic'
};
const workbook = new Workbook(options); // first sheet added
const sheet = workbook.getPrimarySheet();
const rootTopic = sheet.rootTopic;

const secondTopicOptions = {
  id: 'secondTopic',
  title: 'second topic'
};
rootTopic.addChild(secondTopicOptions);

const thirdTopicOptions = {
  id: 'thirdTopic',
  title: 'third topic'
};
rootTopic.addChild(thirdTopicOptions);

const relationship = sheet.addRelationship({
  sourceId: options.rootTopicId,
  targetId: secondTopicOptions.id
});

describe('Relationship', () => {
  it('relationship.getSource()', () => {
    assert.equal(
      relationship.getSource(),
      options.rootTopicId,
      'relationship.getSource() not working: sourceId not correct'
    );
  });
  it('relationship.setSource(value)', () => {
    assert.doesNotThrow(() => {
      relationship.setSource(thirdTopicOptions.id);
    }, 'failed to execute relationship.setSource(value)');
    assert.equal(
      relationship.getSource(),
      thirdTopicOptions.id,
      'relationship.setSource(value) not working: source not correct'
    );
    assert.throws(() => {
      relationship.setSource(secondTopicOptions.id);
    }, 'source & target should not be the same');
  });
  it('relationship.getTarget()', () => {
    assert.equal(
      relationship.getTarget(),
      secondTopicOptions.id,
      'relationship.getTarget() not working: targetId not correct'
    );
  });
  it('relationship.setTarget(value)', () => {
    assert.doesNotThrow(() => {
      relationship.setTarget(options.rootTopicId);
    }, 'failed to execute relationship.setTarget(value)');
    assert.equal(
      relationship.getTarget(),
      options.rootTopicId,
      'relationship.setTarget(value) not working: target not correct'
    );
    assert.throws(() => {
      relationship.setTarget(thirdTopicOptions.id);
    }, 'source & target should not be the same');
  });
  it('relationship.getTitle()', () => {
    assert.equal(
      relationship.getTitle(),
      '',
      'relationship.getTitle() not working: title not correct'
    );
  });
  it('relationship.setTitle(value)', () => {
    const title = 'strange relationship';
    assert.doesNotThrow(() => {
      relationship.setTitle(title);
    }, 'failed to execute relationship.setTitle(value)');
    assert.equal(
      relationship.getTitle(),
      title,
      'relationship.setTitle(value) not working: title not correct'
    );
  });
  it('relationship.toPlainObject()', () => {
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
