'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var DOMParser = require('xmldom').DOMParser;

module.exports = function (options) {
    options = options || {};

    // Init default options
    if (!options.fileName) {
        options.fileName = 'icons';
    }
    if (!options.cssPrefix) {
        options.cssPrefix = 'icon-';
    }
    if (!options.defaultWidth) {
        options.defaultWidth = '16px';
    }
    if (!options.defaultHeight) {
        options.defaultHeight = '16px';
    }

    /**
     * Returns encoded string of svg file.
     * @method buildSvgDataURI
     * @param {String} data Contents of svg file.
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
            .replace(/\"/gmi, '\''); // "
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
        return '.' + options.cssPrefix + normalizedFileName + ' {\n' +
        '    background-image: url("data:image/svg+xml;charset=utf8, ' + encodedSvg + '");\n' +
        '    width: ' + width + ';\n' +
        '    height: ' + height + ';\n' +
        '}\n'
    }

    /**
     * Get svg image dimensions.
     * @method getDimensions
     * @param {String} data Contents of svg file.
     */
    function getDimensions(svgContent) {
        var doc = new DOMParser().parseFromString(svgContent, 'text/xml');
        var svgel = doc.getElementsByTagName('svg')[0];
        var width = svgel.getAttribute('width');
        var height = svgel.getAttribute('height');

        return { width: width, height: height }
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

        // Replace dots with hypens inside file name
        normalizedFileName = normalizedFileName.replace(/\./gi, '-');

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
            path: options.fileName + '.css',
            contents: new Buffer(cssRules.join('\n'))
        });
        this.push(cssFile);
        cb();
    });
};
