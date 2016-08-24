const lang = require('zero-lang');
const path = require('path');
const htmlhint = require('gulp-htmlhint');
const gulp = require('gulp');
const config = require('./config');

lang.each(config.htmlhintDirs, (dir) => {
  gulp.task(
    `htmlhint-${dir}`, () => {
      const srcPath = path.resolve(__dirname, `../${dir}/**/*.html`);
      gulp.src(srcPath)
        .pipe(htmlhint());
    }
  );
});

gulp.task('htmlhint', lang.map(config.htmlhintDirs, (dir) => `htmlhint-${dir}`));
