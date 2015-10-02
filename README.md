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

## options.fileName
Type: `String`
Default value: `icons`

Name of the target css file.

## options.cssPrefix
Type: `String`  
Default value: `icon-`  

A string to prefix all css classes with.

## options.defaultWidth
Type: `String`  
Default: `"16px"`  

A string that MUST be defined in px that will be the size of the background-image if there is no width given in the SVG element.

## options.defaultHeight
Type: `String`  
Default: `"16px"`  

Similar to defaultWidth, but for height.

# Running tests

    npm install
    npm test