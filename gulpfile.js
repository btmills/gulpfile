'use strict';

var autoprefixer = require('gulp-autoprefixer'),
	babelify     = require('babelify'),
	browserify   = require('browserify'),
	buffer       = require('vinyl-buffer'),
	del          = require('del'),
	gulp         = require('gulp'),
	gutil        = require('gulp-util'),
	minifyCss    = require('gulp-minify-css'),
	path         = require('path'),
	plumber      = require('gulp-plumber'),
	sass         = require('gulp-sass'),
	source       = require('vinyl-source-stream'),
	sourcemaps   = require('gulp-sourcemaps'),
	uglify       = require('gulp-uglify');

var paths = {
	css: {
		src:  './src/css/**/*.scss',
		main: './src/css/main.scss',
		dest: './public/css',
		maps: '/scss'
	},
	dest: './public',
	html: {
		src: './src/*.html',
		dest: './public'
	},
	js: {
		src:  './src/js/**/*.js',
		main: './src/js/main.js',
		dest: './public/js',
		maps: '/jsx'
	}
};

function handleError(err) {
	gutil.log(err.toString());
	this.emit('end');
}

gulp.task('clean', function () {
	return del(paths.dest, { force: true });
});

gulp.task('css', function () {
	return gulp.src(paths.css.main)
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(sourcemaps.write({ sourceRoot: paths.css.maps }))
		.pipe(gulp.dest(paths.css.dest));
});

gulp.task('html', function () {
	return gulp.src(paths.html.src)
		.pipe(gulp.dest(paths.html.dest));
});

gulp.task('js', function () {
	return browserify(paths.js.main, { debug: true })
		.transform(babelify)
		.bundle()
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(source(path.basename(paths.js.main)))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write({ sourceRoot: paths.js.maps }))
		.pipe(gulp.dest(paths.js.dest));
});

gulp.task('default', ['css', 'html', 'js']);

gulp.task('watch', ['default'], function () {
	gulp.watch(paths.css.src, ['css']);
	gulp.watch(paths.html.src, ['html']);
	gulp.watch(paths.js.src, ['js']);
});
