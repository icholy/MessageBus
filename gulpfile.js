
var gulp       = require('gulp'),
    karma      = require('karma').server,
    tslint     = require('gulp-tslint'),
    typescript = require('gulp-typescript');

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

gulp.task('watch', function () {
  gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('test', ['watch'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
  }, done);
});

gulp.task('default', ['build']);

