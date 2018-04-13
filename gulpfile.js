var gulp = require('gulp');

// Include plugins
var del = require('del');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var stylint = require('gulp-stylint');
var sourcemaps = require('gulp-sourcemaps');
var cached = require('gulp-cached');
var pug = require('gulp-pug');


var APP_FILES, STYL_FILES, BUILD, PUG_FILES;

APP_FILES = "./app/**/*.js";
STYL_FILES = "./app/**/*.styl";
PUG_FILES = "./app/**/*.pug";

BUILD = {
    source: {
        js: ["./app/app.js", "./app/**/*.js"],
        stylus: ["./app/statics/master.styl"],
        pug: ["./app/statics/master.pug"],
        html: ["./build/html/**/*.html"]
    },
    dirs: {
        out: "./build",
        js: "./build/js",
        css: "./build/css",
        html: "./build/html"
    }
};


// Lint task for JS
function lintingJS() {
    return gulp.src(APP_FILES)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

}


// Concatenate & minify JS
function scripts() {
    return gulp.src(BUILD.source.js)
        //.pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(BUILD.dirs.js))
        .pipe(rename('all.min.js'))
        //.pipe(sourcemaps.write('./map'))
        .pipe(uglify()) //{compress: true}
        .pipe(gulp.dest(BUILD.dirs.js));

}


// render .styl to .css
function styles() {
    return gulp.src(BUILD.source.stylus)
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true
        }))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest(BUILD.dirs.css));
        //.pipe(notify('Stylus was compiled succesfully'));
}


// lint task for .styl
function lintingStyl() {
    return gulp.src(STYL_FILES)
        .pipe(cached(lintingStyl))
        .pipe(stylint({
            config: './.stylintrc'
        }))
        .pipe(stylint.reporter('fail'));
}


// render .pug to .html
/*function templates() {
    return gulp.src('./app/statics/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(BUILD.dirs.html));
};*/


// render .pug to .html
function templatesPug() {
    return gulp.src(BUILD.source.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(BUILD.dirs.html));
}


// Watch files for changes
function watching() {
    gulp.watch(BUILD.source.js, gulp.series(lintingJS, scripts));
    gulp.watch(STYL_FILES, gulp.series(lintingStyl, styles));
    gulp.watch(PUG_FILES, gulp.series(templatesPug));

}


// clean build directory
function clean(done) {
    del([BUILD.dirs.out]);
    done();// Async callback for completion
}



gulp.task('styles', gulp.series(
    clean,
    styles
));

// default gulp task
gulp.task('default',
    gulp.series(clean, lintingJS, lintingStyl,
        gulp.parallel(
            scripts,
            styles,
            templatesPug
        ),
        watching
));