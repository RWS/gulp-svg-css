# gulp-svg-css

Gulp plugin that embeds svg images inside a single CSS file using data-uri.

## Usage

Example usage of the plugin:

    var gulp = require('gulp');
    var svgcss = require('gulp-svg-css');
    var svgmin = require('gulp-svgmin');

    gulp.task('create-css', function () {
        return gulp
            .src('icons/**/*.svg')
            .pipe(svgmin())
            .pipe(svgcss({ 
                fileName: 'icons',
                cssPrefix: 'icon-',
                addSize: false
            }))
            .pipe(gulp.dest('dist/'));
        });
    });

## API

### svgcss(options)

#### options.fileName
Type: `String`
Default value: `icons`

Name of the target css file.

#### options.cssPrefix
Type: `String`
Default value: `icon-`

A string to prefix all css classes with.

#### options.addSize
Type: `Boolean`
Default value: `false`

Adds width and height property to the css class.
The size is retrieved using the width and height attribute on the svg root element. If no size is set the `options.defaultWidth` and `options.defaultHeight` will be used.

#### options.defaultWidth
Type: `String`
Default: `"16px"`

Only used if `options.addSize` is true.

A string that MUST be defined in px that will be the size of the background-image if there is no width given in the SVG element.

#### options.defaultHeight
Type: `String`
Default: `"16px"`

Only used if `options.addSize` is true.

Similar to defaultWidth, but for height.

## Running tests

    npm install
    npm test

## License

Copyright (c) 2015 All Rights Reserved by the SDL Group.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.