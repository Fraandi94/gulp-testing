var gulp = require('gulp');

// Include plugins
var del = require('del');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var cached = require('gulp-cached');
var nib = require('nib');
var gutil = require('gulp-util');
var Promise = require('promise');
var jade = require('gulp-jade');


// Lint task
function linting() {
    return gulp.src('./app/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

};

// Concatenate & minify JS
function scripts() {
    return gulp.src('./app/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

};

// render .styl to .css
function styles() {
    return gulp.src('./app/statics/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true
        }))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest('./build/css'))
        //.pipe(notify('Stylus was compiled succesfully'));
};


// render .jade to .html
function templates() {
    return gulp.src('./app/statics/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./build/html'))
};


// Watch files for changes
function watching() {
    gulp.watch('./app/**/*.js', gulp.series(linting, scripts));
    gulp.watch('./app/**/*.styl', gulp.series(styles));
    gulp.watch('./app/**/*.jade', gulp.series(templates));

};


// clean build directory
function clean(done) {
    del(['build']);
    done();// Async callback for completion
};



gulp.task('styles', gulp.series(
    clean,
    styles
));

// default gulp task
gulp.task('default', gulp.series(
    clean,
    linting,
    scripts,
    styles,
    templates,
    watching
));