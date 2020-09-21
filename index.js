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
// @ts-check
'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var DOMParser = require('xmldom').DOMParser;

/**
 * @typedef {Object} gulp_svg_css_options
 * @property {string=} fileName
 * @property {string=} cssPrefix
 * @property {string=} cssSelector
 * @property {string=} cssProperty
 * @property {boolean=} addSize
 * @property {string=} defaultWidth
 * @property {string=} defaultHeight
 * @property {string=} fileExt
 * 
 * @param {?gulp_svg_css_options=} options 
 */
function gulp_svg_css(options) {
    options = options || {};

    // Init default options
    if (options.fileName == null) { // == null is true for null and undefined, but not empty string.
        options.fileName = 'icons';
    }
    if (options.cssPrefix == null) {
        options.cssPrefix = 'icon-';
    }
    if (options.cssSelector == null) {
        options.cssSelector = '.';
    }
    if (!options.cssProperty == null) {
        options.cssProperty = 'background-image';
    }
    if (!options.addSize) {
        options.addSize = false;
    }
    if (!options.defaultWidth) { // empty string not allowed
        options.defaultWidth = '16px';
    }
    if (!options.defaultHeight) { // empty string not allowed
        options.defaultHeight = '16px';
    }
    if (options.fileExt == null) {
        options.fileExt = 'css';
    }

    /**
     * Returns encoded string of svg file.
     * @method buildSvgDataURI
     * @param {String} svgContent Contents of svg file.
     */
    function buildSvgDataURI(svgContent) {
        return svgContent
            .replace(/^<\?xml.*?>/gmi, '') // Xml declaration
            .replace(/<\!\-\-(.*(?=\-\->))\-\->/gmi, '') // Comments
            .replace(/[\r\n]/gmi, '') // Line breaks
            .replace(/(\r\n|\n|\r)$/, '') // New line end of file
            .replace(/\t/gmi, ' ') // Tabs (replace with space)
            .replace(/%/gmi, '%25') // %
            .replace(/</gmi, '%3C') // <
            .replace(/>/gmi, '%3E') // >
            .replace(/#/gmi, '%23') // #
            .replace(/\"/gmi, '\''); // " (replace double-quotes with single-quotes)
    }

    /**
     * Returns css rule for svg file.
     * @method buildCssRule
     * @param {String} normalizedFileName rule for svg file.
     * @param {String} encodedSvg Encoded svg content.
     * @param {String} width Image width.
     * @param {String} height Image height.
     */
    function buildCssRule(normalizedFileName, encodedSvg, width, height) {
        var cssRule = [];
        cssRule.push(options.cssSelector + options.cssPrefix + normalizedFileName + ' {');
        cssRule.push('    ' + options.cssProperty + ': url("data:image/svg+xml,' + encodedSvg + '");');
        if (options.addSize) {
            cssRule.push('    width: ' + width + ';');
            cssRule.push('    height: ' + height + ';');
        }
        cssRule.push('}');
        return cssRule.join('\n');
    }

    /**
     * Get svg image dimensions.
     * @method getDimensions
     * @param {String} svgContent Contents of svg file.
     */
    function getDimensions(svgContent) {
        var doc = new DOMParser().parseFromString(svgContent, 'text/xml');
        var svgel = doc.getElementsByTagName('svg')[0];
        var width = svgel.getAttribute('width');
        var height = svgel.getAttribute('height');

        if (width && !isNaN(width)) {
            width = width + 'px';
        }

        if (height && !isNaN(height)) {
            height = height + 'px';
        }

        return { width: width, height: height };
    }

    var cssRules = [];

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-svg-css', 'Streaming not supported'));
            return;
        }

        var svgContent = file.contents.toString();

        // Put it inside a css file
        var normalizedFileName = path.normalize(path.basename(file.path, '.svg')).toLowerCase();

        // Replace dots / spaces with hypens inside file name
        normalizedFileName = normalizedFileName.replace(/(\.|\s)/gi, '-');

        // Encode svg data
        var encodedSvg = buildSvgDataURI(svgContent);

        // Get dimensions
        var dimensions = getDimensions(svgContent);

        // Push rule
        cssRules.push(buildCssRule(normalizedFileName, encodedSvg,
            dimensions.width || options.defaultWidth, dimensions.height || options.defaultHeight));

        // Don't pipe svg image
        cb();
    }, function (cb) {
        var cssFile = new gutil.File({
            path: options.fileName + '.' + options.fileExt,
            contents: new Buffer(cssRules.join('\n'))
        });
        this.push(cssFile);
        cb();
    });
};

module.exports = gulp_svg_css;