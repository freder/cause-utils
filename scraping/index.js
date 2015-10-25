'use strict';

var debug = require('debug')('cause-utils:scraping');
var cheerio = require('cheerio');
var ua = require('random-useragent');


function query(method, selector, html) {
	method = method || 'css';

	var $ = cheerio.load(html);
	var $result;

	switch (method) {
		case 'css':
			$result = $(selector);
			break;
		case 'jquery':
			$result = eval(selector);
			break;
		default:
			debug('unknown query method: '+method);
			return null;
	}

	return $result;
}


function requestDefaults() {
	var defaults = {};

	try {
		var user_agent = ua.getRandom(function(agent) {
			return agent.browserName.toLowerCase() === 'chrome'
				&& parseFloat(agent.browserVersion) >= 30;
		});
		defaults.headers = { 'User-Agent': user_agent };
	} catch (e) {
		debug('creating random user agent failed');
		return defaults;
	}

	return defaults;
}

module.exports = {
	query: query,
	requestDefaults: requestDefaults
};
