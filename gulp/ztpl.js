/**
 * Created by liangwensen on 3/9/16.
 */
var gulp = require('gulp');
var compileTemplate = require('gulp-ztpl-compiler');
var path = require('path');

gulp.task('ztpl', function () {
    return gulp.src([
            path.resolve(__dirname, '../lib/**/*.xml'),
            path.resolve(__dirname, '../lib/**/*.ztpl')
        ])
        .pipe(compileTemplate({
            template: 'commonjs'
        }))
        .pipe(gulp.dest(path.resolve(__dirname, '../lib/')));
});
