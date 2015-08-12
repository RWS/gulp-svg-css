# Gulp inline svg

Gulp plugin that embeds svg images inside a single CSS file.

# Usage

Example usage of the plugin:

    gulp.task('create-css', function () {
        return gulp
            .src('icons/**/*.svg')
            .pipe(inlinesvg())
            .pipe(gulp.dest('dist/'));
        });
    });

# Options

TODO

# Running tests

    npm install
    npm test