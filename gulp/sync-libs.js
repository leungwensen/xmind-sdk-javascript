const gulp = require('gulp');
const path = require('path');
// const rename = require('gulp-rename');

gulp.task('sync-libs', () => {
  gulp.src(path.resolve(__dirname, '../node_modules/github-markdown-css/github-markdown.css'))
    .pipe(gulp.dest(path.resolve(__dirname, '../dist/lib/')));

  gulp.src([
    path.resolve(__dirname, '../node_modules/jquery/dist/jquery.min.js'),
    path.resolve(__dirname, '../node_modules/jquery/dist/jquery.min.map'),
  ])
    .pipe(gulp.dest(path.resolve(__dirname, '../dist/lib/')));

  gulp.src(path.resolve(__dirname, '../node_modules/codemirror/**/*.*'))
    .pipe(gulp.dest(path.resolve(__dirname, '../dist/lib/codemirror/')));

  gulp.src(path.resolve(__dirname, '../node_modules/webcomponents.js/webcomponents*.js'))
    .pipe(gulp.dest(path.resolve(__dirname, '../dist/lib/')));

  gulp.src(path.resolve(__dirname, '../node_modules/filesize/lib/*.js'))
    .pipe(gulp.dest(path.resolve(__dirname, '../dist/lib/')));

  gulp.src(path.resolve(__dirname, '../node_modules/mousetrap/mousetrap.*'))
    .pipe(gulp.dest(path.resolve(__dirname, '../dist/lib/')));
});
