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
        // Remove line breaks
        svgContent = svgContent.replace(/\r\n/gi, '');

        // Put it inside a css file
        var normalizedFileName = path.normalize(path.basename(file.path, '.svg')).toLowerCase();

        // Replace dots with hypens inside file name
        normalizedFileName = normalizedFileName.replace(/\./gi, '-');

        // Encode svg data
        var encodedSvg = svgContent;
        encodedSvg = encodedSvg.replace(/%/gi, '%25');
        encodedSvg = encodedSvg.replace(/</gi, '%3C');
        encodedSvg = encodedSvg.replace(/>/gi, '%3E');
        encodedSvg = encodedSvg.replace(/#/gi, '%23');
        encodedSvg = encodedSvg.replace(/\"/gi, '\'');

        cssRules.push('.icon-' + normalizedFileName + ' { background-image: url("data:image/svg+xml;charset=utf8, ' + encodedSvg + '");}');

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
