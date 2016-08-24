const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConf = require('../webpack.config');
const webpackConfWithoutDeps = require('../webpack-without-deps.config');

gulp.task('pack', [/* 'eslint' */], () => {
  webpack(webpackConf, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
  });
  webpack(webpackConfWithoutDeps, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
  });
});
