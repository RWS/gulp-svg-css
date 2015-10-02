'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');

module.exports = function (options) {
    options = options || {};

    // Init default options
    if (typeof options.cssFileName === 'undefined') {
        options.cssFileName = "icons";
    }

    var cssRules = [];

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
     */
    function buildCssRule(normalizedFileName, encodedSvg) {
        return '.icon-' + normalizedFileName + ' {\n' +
        '    background-image: url("data:image/svg+xml;charset=utf8, ' + encodedSvg + '");\n' +
        '}\n'
    }

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
        cssRules.push(buildCssRule(normalizedFileName, encodedSvg));

        // Don't pipe svg image
        cb();
    }, function (cb) {
        var cssFile = new gutil.File({
            path: options.cssFileName + '.css',
            contents: new Buffer(cssRules.join('\n'))
        });
        this.push(cssFile);
        cb();
    });
};
