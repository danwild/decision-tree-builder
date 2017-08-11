const gulp          = require('gulp');
const babel         = require('gulp-babel');
const concat        = require('gulp-concat');
const concatCss     = require('gulp-concat-css');
const rename        = require('gulp-rename');
const uglify        = require('gulp-uglify');
const cssNano       = require('gulp-cssnano');

// Concatenate & Minify src and dependencies
gulp.task('scripts', function() {
	return gulp.src([
			'src/js/**.js'
		])
		.pipe(concat('rule-builder.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist'))
		.pipe(rename('rule-builder.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('concatCss', function () {
	return gulp.src('./src/css/*.css')
		.pipe(concatCss('rule-builder.css'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('cssNano', ['concatCss'], function() {
	gulp.src('./dist/rule-builder.css')
		.pipe(cssNano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'));
});

// Default Task
gulp.task('default', ['scripts', 'concatCss', 'cssNano', 'watch']);

// Watch Files For Changes
gulp.task('watch', function() {
	// We watch both JS and HTML files.
	gulp.watch('src/js/*.js', ['scripts']);
	gulp.watch('src/css/*.css', ['concatCss', 'cssNano']);
});