const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const through = require('through2');
const lebab = require('lebab');

const transformOptions = [
  'arg-spread',
  'arrow',
  'class',
  'commonjs',
  'default-param',
  'exponent',
  'for-of',
  'includes',
  'let',
  // 'multi-var',
  'no-strict',
  'obj-method',
  'obj-shorthand',
  'template',
];

function toES6() {
  return through.obj(function render(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('commonjs2es6', 'Streaming not supported'));
    }

    try {
      gutil.log(file.path);
      const result = lebab.transform(file.contents.toString('utf8'), transformOptions);
      file.contents = new Buffer(result.code);
    } catch (err) {
      this.emit('error', new gutil.PluginError('commonjs2es6', err.toString()));
    }

    this.push(file);
    return cb();
  });
}

// 这个脚本不能多次执行，因此在临时文件夹内进行
gulp.task(
  'commonjs2es6',
  () => gulp.src(path.resolve(__dirname, '../spec/**/*.js')) // FIXME modify this to specify target
    .pipe(plumber())
    .pipe(toES6())
    .on('error', (err) => {
      gutil.log(gutil.colors.red(err.message));
    })
    .pipe(gulp.dest(path.resolve(__dirname, '../spec/'))) // FIXME modify this to specify target
);
