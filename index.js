'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var chalk = require('chalk');
var path = require('path');
var Svgo = require('svgo');
var svgo = new Svgo();

module.exports = function (options) {
	options = options || {};

	var cssRules = [];

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-inlinesvg', 'Streaming not supported'));
			return;
		}

		var svgContent = file.contents.toString();
		
		// Minify SVG file
		svgo.optimize(svgContent, function (minifiedSvgContent) {
			gutil.log('Saved ' + chalk.green(svgContent.length - minifiedSvgContent.data.length) + ' characters');
			
			// Put it inside a css file
			var normalizedFileName = path.normalize(path.basename(file.path, '.svg')).toLowerCase();
			cssRules.push('.icon-' + normalizedFileName + ' { background-image: url("data:image/svg+xml;charset=utf8, ' + minifiedSvgContent.data + ');}');

			// Don't pipe svg image
			cb();
		});
	}, function (cb) {
		var cssFile = new gutil.File({
			path: 'icons.css',
			contents: new Buffer(cssRules.join('\n'))
		});
		this.push(cssFile);
		cb();
	});
};
