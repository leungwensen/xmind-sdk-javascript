const lang = require('zero-lang');
const path = require('path');
const webpackConf = require('./webpack.config');

module.exports = lang.extend({}, webpackConf, {
  entry: {
    'dist/xmind-without-deps': path.resolve(__dirname, './lib/index-browser.js'),
  },
  externals: {
    'filesaver.js': 'window',
    'jquery': 'jQuery',
    'jszip': 'JSZip',
    'xml-lite/lib/index-browser': 'XMLLite',
  },
});
