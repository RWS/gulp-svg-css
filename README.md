# gulp-svg-css
[![Build Status](https://travis-ci.org/sdl/gulp-svg-css.svg?branch=master)](https://travis-ci.org/sdl/gulp-svg-css)
[![Coverage Status](https://coveralls.io/repos/github/sdl/gulp-svg-css/badge.svg?branch=master)](https://coveralls.io/github/sdl/gulp-svg-css?branch=master)
[![npm version](https://badge.fury.io/js/gulp-svg-css.svg)](https://badge.fury.io/js/gulp-svg-css)
[![Dependency Status](https://david-dm.org/sdl/gulp-svg-css.svg)](https://david-dm.org/sdl/gulp-svg-css)
[![devDependency Status](https://david-dm.org/sdl/gulp-svg-css/dev-status.svg)](https://david-dm.org/sdl/gulp-svg-css#info=devDependencies)

Gulp plugin that embeds svg images inside a single CSS file using data-uri.

## Usage

Example usage of the plugin:

```javascript
var gulp = require('gulp');
var svgcss = require('gulp-svg-css');
var svgmin = require('gulp-svgmin');

gulp.task('create-css', function () {
	return gulp
		.src('icons/**/*.svg')
		.pipe(svgmin())
		.pipe(svgcss({
			cssPrefix: '',
			cssProperty: '--img'
		}))
		.pipe(gulp.dest('dist/'));
	});
});
```

For example, your initial .css file might look like this before processing:
```css
.cssimg {
    display: inline-block;
    --size: 32px;
    width: var(--size);
    height: var(--size);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
    background-color: #9f9697;
    -webkit-mask-image: var(--img);
    mask-image: var(--img);
}

.ban {
    --img: url(../img/ban.svg);
}

.bars {
    --img: url(../img/bars.svg);
}
```

After processing, this is added to the end of the .css file:
```css

.ban {
    --img: url("data:image/svg+xml,%3Csvg viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='red' d='M1440 893q0-161-87-295l-754 753q137 89 297 89 111 0 211.5-43.5T1281 1280t116-174.5 43-212.5zm-999 299l755-754q-135-91-300-91-148 0-273 73T425 619t-73 274q0 162 89 299zm1223-299q0 157-61 300t-163.5 246-245 164-298.5 61-298.5-61-245-164T189 1193t-61-300 61-299.5T352.5 348t245-164T896 123t298.5 61 245 164T1603 593.5t61 299.5z'/%3E%3C/svg%3E")
}

.bars {
    --img: url("data:image/svg+xml,%3Csvg viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%239f9697' d='M1664 1344v128q0 26-19 45t-45 19H192q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19H192q-26 0-45-19t-19-45V832q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19H192q-26 0-45-19t-19-45V320q0-26 19-45t45-19h1408q26 0 45 19t19 45z'/%3E%3C/svg%3E")
}
```


## API

### svgcss(options)

#### options.fileName
Type: `String`
Default value: `icons`

Name of the target css file.

#### options.fileExt
Type: `String`
Default value: `css`

File extension of the target file.

#### options.cssPrefix
Type: `String`
Default value: `icon-`

A string to prefix all css classes with.

#### options.cssSelector
Type: `String`
Default value: `.`

A selector to use for the CSS prefix. This is particularly useful if you're outputting a SASS partial, and would rather use a `%` placeholder selector.

#### options.cssProperty
Type: `String`
Default value: `background-image`

The CSS property to write. Typically used background-image: or --img:

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
    
## Check code style

    npm install
    npm run lint

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
