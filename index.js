'use strict';

var ExecBuffer = require('exec-buffer');
var imageType = require('image-type');
var pngquant = require('pngquant-bin').path;

/**
 * pngquant image-min plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};

	return function (file, imagemin, cb) {
		if (imageType(file.contents) !== 'png') {
			cb();
			return;
		}

		var args = [];
		var exec = new ExecBuffer();

		if (opts.nofs) {
			args.push('--nofs');
		}

		if (opts.quality) {
			args.push('--quality', opts.quality);
		}

		if (opts.speed) {
			args.push('--speed', opts.speed);
		}

		if (opts.verbose) {
			args.push('--verbose');
		}

		exec
			.use(pngquant, args.concat(['-f', '-o', exec.dest(), exec.src()]))
			.run(file.contents, function (err, buf) {
				if (err) {
					cb(err);
					return;
				}

				file.contents = buf;
				cb();
			});
	};
};
