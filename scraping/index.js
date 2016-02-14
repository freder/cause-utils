'use strict';

const debug = require('debug')('cause-utils:scraping');
const cheerio = require('cheerio');
const ua = require('random-useragent');


const query = module.exports.query =
function query(method='css', selector, html) {
	const $ = cheerio.load(html);
	let $result;

	switch (method) {
		case 'css':
			$result = $(selector);
			break;
		case 'jquery':
			$result = eval(selector); // TODO: don't use `eval()`
			break;
		default:
			debug('unknown query method: '+method);
			return null;
	}

	return $result;
};


const requestDefaults = module.exports.requestDefaults =
function requestDefaults() {
	let defaults = {};

	try {
		const userAgent = ua.getRandom((agent) => {
			return agent.browserName.toLowerCase() === 'chrome'
				&& parseFloat(agent.browserVersion) >= 30;
		});
		defaults.headers = { 'User-Agent': userAgent };
	} catch (e) {
		debug('creating random user agent failed');
		return defaults;
	}

	return defaults;
};
