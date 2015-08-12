'use strict';
var fs = require('fs');
var assert = require('assert');
var streamAssert = require('stream-assert');
var gutil = require('gulp-util');
var inlinesvg = require('./');

it('should minify svg and output css file', function (done) {
	var stream = inlinesvg();
	var collpasedSvg = __dirname + '/testdata/collapsed.svg';
	var expandedSvg = __dirname + '/testdata/expanded.svg';
	fs.readFile(collpasedSvg, 'utf8', function (err, dataCollapsed) {
		if (err) {
			throw err;
		}
		fs.readFile(expandedSvg, 'utf8', function (err, dataExpanded) {
			stream
				.pipe(streamAssert.length(1))
				.pipe(streamAssert.first(function (newFile) {
					assert.equal(newFile.basename, 'icons.css');
					assert.equal(newFile.contents.length, 504);
					console.log(newFile.contents.toString());
				}))
				.pipe(streamAssert.end(done));

			stream.write(new gutil.File({
				path: collpasedSvg,
				contents: new Buffer(dataCollapsed)
			}));
			stream.write(new gutil.File({
				path: expandedSvg,
				contents: new Buffer(dataExpanded)
			}));
			stream.end();
		});
	});
});
