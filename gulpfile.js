
var gulp          = require('gulp'),
    karma         = require('karma').server,
    child_process = require("child_process"),
    tslint        = require('gulp-tslint'),
    typescript    = require('gulp-typescript');

gulp.task('build', function () {
  gulp.src('src/*.ts')
      .pipe(typescript())
      .pipe(gulp.dest('build'));
});

gulp.task('lint', function () {
  gulp.src('src/*.ts')
      .pipe(tslint())
      .pipe(tslint.report('verbose'))
});

gulp.task('docs', function (done) {
  child_process.exec('typedoc --out docs/ src/', done);
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('test', ['watch'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
  }, done);
});

gulp.task('dist', ['lint', 'docs', 'build']);
gulp.task('default', ['dist']);

