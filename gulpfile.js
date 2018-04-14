var gulp = require('gulp');

/***
 * Include plugins
***/
var del = require('del');
var cached = require('gulp-cached');

// js
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// css
var stylus = require('gulp-stylus');
var stylint = require('gulp-stylint');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');

// html
var pug = require('gulp-pug');
var pugLinter = require('gulp-pug-linter');


// necessary paths
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


/***
* gulp functions
***/
// Lint task for .js-files
function lintingJS() {
    return gulp
        .src(APP_FILES)
        .pipe(cached(lintingJS))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
}

// JS for development: concatenate, uglify and & minify .js-files
function scriptsDev() {
    return gulp
        .src(BUILD.source.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest(BUILD.dirs.js))
}

// JS for production: concatenate, uglify and & minify .js-files
function scriptsProd() {
    return gulp
        .src(BUILD.source.js)
        .pipe(concat('app.js'))
        .pipe(uglify({"compress": true})) //{compress: true}
        .pipe(gulp.dest(BUILD.dirs.js));
}


// styl for development: render .styl to .css
function stylesDev() {
    return gulp
        .src(BUILD.source.stylus)
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true
        }))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest(BUILD.dirs.css));
}

// styl for production: render .styl to .css
function stylesProd() {
    return gulp
        .src(BUILD.source.stylus)
        .pipe(stylus({
            compress: true
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(BUILD.dirs.css));
}

// lint task for .styl-files
function lintingStyl() {
    return gulp
        .src(STYL_FILES)
        .pipe(cached(lintingStyl))
        .pipe(stylint({
            config: './.stylintrc'
        }))
        .pipe(stylint.reporter('fail'));
}


// render .pug to .html
function templatesPug() {
    return gulp
        .src(BUILD.source.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(BUILD.dirs.html));
}

// lint task for .pug-files
function lintingPug() {
    return gulp
        .src(PUG_FILES)
        .pipe(cached(lintingPug))
        .pipe(pugLinter())
        .pipe(pugLinter.reporter('fail'));
}


// Watch files for changes
function watching() {
    gulp.watch(BUILD.source.js, gulp.series(lintingJS, scriptsDev));
    gulp.watch(STYL_FILES, gulp.series(lintingStyl, stylesDev));
    gulp.watch(PUG_FILES, gulp.series(lintingPug, templatesPug));
}


// clean build directory
function clean(done) {
    del([BUILD.dirs.out]);
    done();// Async callback for completion
}



//linting
gulp.task('linting',
    gulp.parallel(
        lintingJS,
        lintingStyl,
        lintingPug
    ),
    function(done) {
        done();
    }
);

// rendering development
gulp.task('rendering:dev',
    gulp.parallel(
        scriptsDev,
        stylesDev,
        templatesPug
    ),
    function(done) {
        done();
    }
);

// rendering production
gulp.task('rendering:prod',
    gulp.parallel(
        scriptsProd,
        stylesProd,
        templatesPug
    ),
    function(done) {
        done();
    }
);


// gulp chain for development
gulp.task('develop',
    gulp.series(
        clean,
        'linting',
        'rendering:dev',
        watching
    ),
    function(done) {
        done();
    }
);

// gulp chain for production
gulp.task('production',
    gulp.series(
        clean,
        'linting',
        'rendering:prod'
    ),
    function(done) {
        done();
    }
);


/***
 MAIN TASKS
 ***/

// development task
gulp.task('default',
    gulp.series(
        'develop'
    ),
    function(done) {
        done();
    }
);

// short for development task
gulp.task('dev',
    gulp.series(
        'develop'
    ),
    function(done) {
        done();
    }
);

// production task
gulp.task('prod',
    gulp.series(
        'production'
    ),
    function(done) {
        done();
    }
);