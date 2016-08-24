'use strict';
/**
 * svg-sprite module
 * @module svg-sprite
 * @see module:index
 */
const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('svg-sprite', shell.task([
  './node_modules/.bin/svg-icon build -s lib/data/icons.json -t dist -n xmind'
]));
