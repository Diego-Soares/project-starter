var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

var files = {
	sass_watch_path: 'src/scss/**/*.scss',
	css_path: 'build/css/',
  js_watch_path: 'src/js/**/*.js',
	js_path: 'build/js/'
};

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
  })
})

gulp.task('styles', function(){
  gulp.src(files.sass_watch_path)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(files.css_path))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(files.css_path))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src(files.js_watch_path)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(files.js_path))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(files.js_path))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('watch', ['browserSync', 'styles', 'scripts'], function(){
  gulp.watch(files.js_watch_path, ['styles']);
  gulp.watch(files.scss_watch_path, ['scripts']);
  gulp.watch('./*.html', browserSync.reload);
});

gulp.task('default', ['watch']);