var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var jade = require('gulp-jade');

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./views/*.jade')
    .pipe(jade({
      locals : YOUR_LOCALS
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('sass', function() {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass( {errLogToConsole: true} ))
    .pipe(gulp.dest('./public/css'));
  });

gulp.task('livereload', function() {
  gulp.src('./public/**/*')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('./views/**/*.jade', ['templates']);
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./public/**/*', ['livereload']);
});

gulp.task('default', ['connect', 'watch', 'sass']);