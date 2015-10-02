# gulp-svg-css

Gulp plugin that embeds svg images inside a single CSS file using data-uri.

# Usage

Example usage of the plugin:

    gulp.task('create-css', function () {
        return gulp
            .src('icons/**/*.svg')
            .pipe(svgcss())
            .pipe(gulp.dest('dist/'));
        });
    });

# Options

TODO

# Running tests

    npm install
    npm test