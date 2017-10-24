var gulp = require('gulp');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var nodemon = require('nodemon');
var sass = require('gulp-sass');

gulp.task('angular', function () {
  return gulp.src([
    'app/app.js',
    'app/controllers/*.js',
    'app/services/*.js'
  ])
    .pipe(concat('application.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function(){
  return gulp.src('app/assets/styles/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('public/css'))
});

gulp.task('templates', function () {
  return gulp.src('app/partials/**/*.html')
    .pipe(templateCache({ root: 'partials', module: 'MyApp' }))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'))
    .pipe(livereload());
});

gulp.task('vendor', function () {
  return gulp.src('app/vendor/*.js')
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js/lib'));
});

gulp.task('watch',['angular','templates', 'sass'], function () {
  livereload.listen();
  gulp.watch('app/assets/styles/**/*.scss', ['sass']);
  gulp.watch('public/css/**/*.css', function (files) {
    livereload.changed(files)
  });
  gulp.watch('app/**/*.js', ['angular']);
  gulp.watch('app/partials/**/*.html', ['templates']);
});

gulp.task('server', function () {
  nodemon({
    'script': 'server.js',
    'ignore': 'public/js/*.js'
  });
});

gulp.task('build', ['angular', 'vendor', 'templates']);
gulp.task('default', ['build', 'watch']);
gulp.task('serve', ['default', 'server']);
