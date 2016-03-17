/**
 * Created by liangwensen on 3/17/16.
 */

var gulp = require('gulp');
var watch = require('gulp-watch');
var path = require('path');

gulp.task('watch', function (done) {
    watch([
        path.resolve(__dirname, '../lib/**/*.html'),
        path.resolve(__dirname, '../lib/**/*.xml'),
        path.resolve(__dirname, '../lib/**/*.ztpl'),
    ], function () {
        gulp.start('ztpl');
    });
});

