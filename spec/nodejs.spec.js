const assert = require('assert');
const path = require('path');
const spawn = require('child_process').spawn;

const xmind = require('../lib/index');
const Workbook = xmind.Workbook;


xmind.open(path.resolve(__dirname, './fixtures/simple.xmind')).then((workbook) => {
  console.log(workbook);
});

assert.doesNotThrow(function () {
  xmind.open(path.resolve(__dirname, './fixtures/simple.xmind')).then((workbook) => {
    console.log(workbook);
  });
}, 'failed to open xmind file');

var saveToPath = path.resolve(__dirname, './fixtures/save-test.xmind');
assert.doesNotThrow(() => {
  xmind.save(
    new Workbook({
      firstSheetName: 'test sheet',
      rootTopicName: 'test topic'
    }),
    saveToPath
  );
  spawn('rm', [
    saveToPath
  ], {
    stdio: 'inherit'
  });
}, 'failed to save xmind file');
