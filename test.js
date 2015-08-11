'use strict';
var fs = require('fs');
var assert = require('assert');
var streamAssert = require('stream-assert');
var gutil = require('gulp-util');
var inlinesvg = require('./');

it('should minify svg and output css file', function (done) {
	var stream = inlinesvg();
	var collpasedSvg = __dirname + '/testdata/collapsed.svg';
	fs.readFile(collpasedSvg, 'utf8', function (err, data) {
		if (err) {
			throw err;
		}
		stream
			.pipe(streamAssert.length(1))
			.pipe(streamAssert.first(function (newFile) {
				assert.equal(newFile.basename, 'icons.css');
				assert.equal(newFile.contents.length, 254);
				console.log(newFile.contents.toString());
			}))
			.pipe(streamAssert.end(done));

		stream.write(new gutil.File({
			path: collpasedSvg,
			contents: new Buffer(data)
		}));
		stream.end();
	});
});
