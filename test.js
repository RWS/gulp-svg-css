/*!
 * Copyright (c) 2015 All Rights Reserved by the SDL Group.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var fs = require('fs');
var assert = require('assert');
var streamAssert = require('stream-assert');
var gutil = require('gulp-util');
var svgcss = require('./');
var css = require('css');
var testData = {
    collpasedSvg: fs.readFileSync(__dirname + '/testdata/collapsed.svg'),
    expandedSvg: fs.readFileSync(__dirname + '/testdata/expanded.svg'),
    noDimensions: fs.readFileSync(__dirname + '/testdata/nodimensions.svg'),
    customDimensions: fs.readFileSync(__dirname + '/testdata/customdimensions.svg'),
    nopxInDimensions: fs.readFileSync(__dirname + '/testdata/nopxindimensions.svg')
};

it('should minify svg and output css file', function (done) {
    var stream = svgcss();

    stream
        .pipe(streamAssert.length(1))
        .pipe(streamAssert.first(function (newFile) {
            var fileContents = newFile.contents.toString();
            assert.equal(newFile.basename, 'icons.css');
            assert.equal(newFile.contents.length, 1265);
            // Check if special characters are escaped
            assert.equal(fileContents.indexOf("<"), -1, "Contains < char");
            assert.equal(fileContents.indexOf(">"), -1, "Contains > char");
            assert.equal(fileContents.indexOf("#"), -1, "Contains # char");
            // Check if rules are ok
            var parsedCss = css.parse(fileContents);
            assert.equal(parsedCss.stylesheet.rules.length, 2);
            // No dots inside
            assert.equal(parsedCss.stylesheet.rules[0].selectors[0], '.icon-collapsed-16x16');
            // Check dimensions
            assert.equal(parsedCss.stylesheet.rules[0].declarations[1].property, 'width');
            assert.equal(parsedCss.stylesheet.rules[0].declarations[1].value, '16px');
            assert.equal(parsedCss.stylesheet.rules[0].declarations[2].property, 'height');
            assert.equal(parsedCss.stylesheet.rules[0].declarations[2].value, '16px');
        }))
        .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'collapsed.16x16.svg',
        contents: new Buffer(testData.collpasedSvg)
    }));
    stream.write(new gutil.File({
        path: 'expanded.16x16.svg',
        contents: new Buffer(testData.expandedSvg)
    }));
    stream.end();
});

it('should use dimensions from svg source', function (done) {
    var stream = svgcss();

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           var fileContents = newFile.contents.toString();
           // Check if rules are ok
           var parsedCss = css.parse(fileContents);
           assert.equal(parsedCss.stylesheet.rules.length, 2);
           // Check dimensions
           assert.equal(parsedCss.stylesheet.rules[0].declarations[1].property, 'width');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[1].value, '1234px');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[2].property, 'height');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[2].value, '4321px');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[1].property, 'width');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[1].value, '12345px');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[2].property, 'height');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[2].value, '54321px');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'customdimensions.svg',
        contents: new Buffer(testData.customDimensions)
    }));
    stream.write(new gutil.File({
        path: 'nopxindimensions.svg',
        contents: new Buffer(testData.nopxInDimensions)
    }));
    stream.end();
});


it('should be able to change css file name', function (done) {
    var stream = svgcss({
        fileName: 'common'
    });

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           var fileContents = newFile.contents.toString();
           assert.equal(newFile.basename, 'common.css');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'collapsed.16x16.svg',
        contents: new Buffer(testData.collpasedSvg)
    }));
    stream.end();
});

it('should be able to change css prefix', function (done) {
    var stream = svgcss({
        cssPrefix: 'icons-list-'
    });

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           var fileContents = newFile.contents.toString();
           // Check if rules are ok
           var parsedCss = css.parse(fileContents);
           assert.equal(parsedCss.stylesheet.rules.length, 1);
           // No dots inside
           assert.equal(parsedCss.stylesheet.rules[0].selectors[0], '.icons-list-collapsed-16x16');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'collapsed.16x16.svg',
        contents: new Buffer(testData.collpasedSvg)
    }));
    stream.end();
});

it('should be able to change default height and width', function (done) {
    var stream = svgcss({
        defaultHeight: '32px',
        defaultWidth: '32px'
    });

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           var fileContents = newFile.contents.toString();
           // Check if rules are ok
           var parsedCss = css.parse(fileContents);
           assert.equal(parsedCss.stylesheet.rules.length, 2);
           // Check dimensions
           assert.equal(parsedCss.stylesheet.rules[0].declarations[1].property, 'width');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[1].value, '32px');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[2].property, 'height');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[2].value, '32px');
           // Check dimensions
           assert.equal(parsedCss.stylesheet.rules[1].declarations[1].property, 'width');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[1].value, '1234px');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[2].property, 'height');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[2].value, '4321px');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'nodimensions.svg',
        contents: new Buffer(testData.noDimensions)
    }));
    stream.write(new gutil.File({
        path: 'customdimensions.svg',
        contents: new Buffer(testData.customDimensions)
    }));
    stream.end();
});
