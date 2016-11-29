var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('js', function() {
  gulp.src(['js/main.js', 'js/**/*.js'])
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  gulp.start('js');

	watch([
		'js/**/*.js'
	], function() {
		gulp.start('js');
	});
});
