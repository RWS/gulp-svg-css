'use strict';
var fs = require('fs');
var assert = require('assert');
var streamAssert = require('stream-assert');
var gutil = require('gulp-util');
var inlinesvg = require('./');
var css = require('css');

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
					var fileContents = newFile.contents.toString();
					assert.equal(newFile.basename, 'icons.css');
					assert.equal(newFile.contents.length, 548);
					// Check if special characters are escaped
					assert.equal(fileContents.indexOf("<"), -1, "Contains < char");
					assert.equal(fileContents.indexOf(">"), -1, "Contains > char");
					assert.equal(fileContents.indexOf("#"), -1, "Contains # char");
					// Check if rules are ok
					var parsedCss = css.parse(fileContents);
					assert.equal(parsedCss.stylesheet.rules.length, 2);
					// No dots inside
					assert.equal(parsedCss.stylesheet.rules[0].selectors[0], '.icon-collapsed-16x16');
				}))
				.pipe(streamAssert.end(done));

			stream.write(new gutil.File({
				path: 'collapsed.16x16.svg',
				contents: new Buffer(dataCollapsed)
			}));
			stream.write(new gutil.File({
				path: 'expanded.16x16.svg',
				contents: new Buffer(dataExpanded)
			}));
			stream.end();
		});
	});
});
