# gulp-svg-css

Gulp plugin that embeds svg images inside a single CSS file using data-uri.

# Usage

Example usage of the plugin:

    var gulp = require('gulp');
    var svgcss = require('gulp-svg-css');
    var svgmin = require('gulp-svgmin');

    gulp.task('create-css', function () {
        return gulp
            .src('icons/**/*.svg')
            .pipe(svgmin())
            .pipe(svgcss())
            .pipe(gulp.dest('dist/'));
        });
    });

# Options

TODO

# Running tests

    npm install
    npm test