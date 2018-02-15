var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var imagemin = require('gulp-imagemin');
var soften = require('gulp-soften');
var htmlbeautify = require('gulp-html-beautify');

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("src/scss/*.scss", ['sass']);
	gulp.watch("src/*.html").on('change', browserSync.reload);
	gulp.watch("src/js/*.js").on('change', browserSync.reload);
});

gulp.task('htmlbeautify', function() {

	var options = {
		
			"indentsize": 3,
			"indent_with_tabs": true,
			"eval_code": true,
			"wrap_attributes": 'auto',
			"wrap_attributes_indent_size": 4,

	};
	gulp.src('src/*.html')
	.pipe(htmlbeautify(options))
	.pipe(gulp.dest('./dist/'))

});

gulp.task('sass', function() {
	gulp.src('./src/sass/**/*.+(scss|sass)')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(gulp.dest('./dist/scss'))
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./src/css'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('images', function() {
   gulp.src('src/img/**')
	.pipe(imagemin({ optimizationLevel: 9, progressive: false, interlaced: false }))
	.pipe(gulp.dest('dist/img'))
  });
  
  gulp.task('scripts', function() {
	gulp.src(['src/js/raw/**.js'])
	.pipe(jshint())
	.pipe(jshint.reporter())
	.pipe(plumber({
		errorHandler: notify.onError('Error: <%= error.message %>')
	}))
    .pipe(soften(4))
	.pipe(concat('script.js'))
	.pipe(gulp.dest('./src/js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename('script.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./src/js'))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('watch', [/* 'scripts', 'browserSync', */ 'sass'], function() {
	gulp.watch('src/js/*Controller.js', ['jshint', 'scripts'], browserSync.reload);
	gulp.watch('src/sass/**/*.+(scss|sass)', ['sass'], browserSync.reload);
	gulp.watch('src/*.html', browserSync.reload);
});



gulp.task('default', ['htmlbeautify', 'sass', 'images', 'scripts', 'serve', 'watch']);