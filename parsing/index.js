'use strict';

var _ = require('lodash');
var debug = require('debug')('cause-utils:parsing');


// simple time parsing
// "12 minutes" → { minutes: 12 }
function time(s) {
	var parsed = {};
	var parts = s.split(' ');

	if (parts.length < 2) {
		throw new Error('unable to parse: ' + s);
	}

	var num = parseFloat(parts[0]);
	if (_.isNaN(num)) {
		throw new Error('not a number: ' + s);
	}

	parsed[parts[1]] = num;
	return parsed;
}


module.exports = {
	time: time,
};
