const lang = require('zero-lang');
const path = require('path');
const webpackConf = require('./webpack.config');

module.exports = lang.extend({}, webpackConf, {
  entry: {
    'dist/xmind-without-deps': path.resolve(__dirname, './lib/index-browser.js'),
  },
  externals: {
    'jquery': 'jQuery',
    'filesaver.js': 'window',
    'jszip': 'JSZip',
  },
});
