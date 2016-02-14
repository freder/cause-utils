'use strict';

const _ = require('lodash');
const debug = require('debug')('cause-utils:parsing');


// simple time parsing
// "12 minutes" → { minutes: 12 }
const time = module.exports.time =
function time(s) {
	const parts = s.split(' ');

	if (parts.length < 2) {
		throw new Error(`unable to parse: ${s}`);
	}

	var num = parseFloat(parts[0]);
	if (_.isNaN(num)) {
		throw new Error(`not a number: ${s}`);
	}

	return { [parts[1]]: num };
};
