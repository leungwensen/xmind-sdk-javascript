/**
 * Created by liangwensen on 3/9/16.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var path = require('path');

gulp.task('mocha', function () {
    return gulp.src([
            path.resolve(__dirname, '../test/mocha/*.js')
        ])
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'spec'
        }));
});
