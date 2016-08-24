const assert = chai.assert;

const Workbook = xmind.Workbook;

describe('Workbook', () => {
  const options = {
    firstSheetId: 'firstSheet',
    rootTopicId: 'rootTopic',
    firstSheetName: 'sheet 1',
    rootTopicName: 'root topic',
  };
  let workbook, sheet, rootTopic;

  it('new Workbook(options)', () => {
    assert.doesNotThrow(() => {
      workbook = new Workbook(options); // first sheet added
      sheet = workbook.getPrimarySheet();
      rootTopic = sheet.rootTopic;
    }, 'failed to create a Workbook instance');
  });
  it('workbook.sheetById', () => {
    assert.equal(
      workbook.sheetById[options.firstSheetId],
      sheet,
      'workbook.sheetById is not working'
    );
  });
  it('workbook.sheets', () => {
    assert.equal(
      workbook.sheets[0],
      sheet,
      'workbook.sheets is not working'
    );
  });

  it('workbook.getModifiedTime()', () => {
    assert.doesNotThrow(() => {
      new Date(workbook.getModifiedTime());
    }, 'failed to execute workbook.getModifiedTime()');
  });

  it('workbook.getPrimarySheet()', () => {
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

  const secondSheetOptions = {
    id: 'secondSheet',
    title: 'sheet 2',
    rootTopicId: 'rootTopic',
    rootTopicName: 'root topic',
  };
  it('workbook.addSheet(options)', () => {
    assert.throws(() => {
      workbook.addSheet({
        id: options.firstSheetId, // duplicated id
        title: '',
        rootTopicId: 'some id',
        rootTopicName: 'some name',
      });
    }, `sheet id '${options.firstSheetId}' already exists!`);
    assert.doesNotThrow(() => {
      workbook.addSheet(secondSheetOptions); // second sheet added
    }, 'failed to execute workbook.addSheet(options)');
  });
  it('workbook.moveSheet(fromIndex, toIndex)', () => {
    assert.doesNotThrow(() => {
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
  it('workbook.destroy()', () => {
    workbook.destroy();
    assert.ok(
      workbook,
      'workbook should not be destroyed'
    );
  });
  it('workbook.toJSON()', () => {
    assert.doesNotThrow(() => {
      workbook.toJSON();
    });
  });
  describe('workbook.setModifiedTime()', () => {
    const newModifiedTime = 1;
    it('set by timestamp(number)', () => {
      assert.doesNotThrow(() => {
        workbook.setModifiedTime(newModifiedTime);
      }, 'failed to execute workbook.setModifiedTime(timestamp)');
      assert.equal(
        workbook.getModifiedTime(),
        newModifiedTime,
        'workbook.setModifiedTime(timestamp) not working: timestamp is not correct'
      );
    });
    it('set by instance of Date', () => {
      assert.doesNotThrow(() => {
        workbook.setModifiedTime(new Date(newModifiedTime));
      }, 'failed to execute workbook.setModifiedTime(date)');
      assert.equal(
        workbook.getModifiedTime(),
        newModifiedTime,
        'workbook.setModifiedTime(timestamp) not working: timestamp is not correct'
      );
    });
  });
  describe('workbook.removeSheet(/* id or index or Sheet instance */)', () => {
    it('remove by id', () => {
      assert.doesNotThrow(() => {
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
    it('remove by index', () => {
      workbook.addSheet(secondSheetOptions); // reverse
      assert.doesNotThrow(() => {
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
    it('remove by instance', () => {
      const secondSheet = workbook.addSheet(secondSheetOptions); // reverse
      assert.doesNotThrow(() => {
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

