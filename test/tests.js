'use strict';

const assert = require('assert');
const _ = require('lodash');
const cheerio = require('cheerio');
const FeedParser = require('feedparser');
const fs = require('fs');

const util = require('./util.js');

const scrapingUtils = require('../scraping/index.js');
const feedUtils = require('../feed/index.js');
const parsingUtils = require('../parsing/index.js');
const formattingUtils = require('../formatting/index.js');


describe(util.f1('scraping'), function() {
	describe(util.f2('.query()'), function() {
		it(util.f3('should work with css and jquery'), function() {
			const html = ' \
				<div id="container"> \
					<div class="div">div</div> \
					<span>span</span> \
				</div>';
			const $ = cheerio.load(html);
			let query, $result;

			query = '$("#container div").first()';
			$result = scrapingUtils.query('jquery', query, html);
			assert($result.text().trim() === 'div');

			query = '#container span';
			$result = scrapingUtils.query('css', query, html);
			assert($result.text().trim() === 'span');

			query = '#notfound';
			$result = scrapingUtils.query('css', query, html);
			assert($result.length === 0);

			$result = scrapingUtils.query('never_heard_of_this', query, html);
			assert($result === null);
		});
	});

	describe(util.f2('.requestDefaults()'), function() {
		it(util.f3('should set a user agent'), function() {
			const opts = scrapingUtils.requestDefaults();
			assert(opts.headers !== undefined && opts.headers['User-Agent'] !== undefined);
		});
	});
});


describe(util.f1('parsing'), function() {
	describe(util.f2('.time()'), function() {
		it(util.f3('should parse time'), function() {
			let parsed;
			parsed = parsingUtils.time('12 minutes');
			assert(parsed.minutes === 12);

			parsed = parsingUtils.time('12 minutes ago');
			assert(parsed.minutes === 12);
		});

		it(util.f3('should throw errors'), function() {
			assert.throws(() => {
				parsingUtils.time('12');
			});
			assert.throws(() => {
				parsingUtils.time('five minutes');
			});
		});
	});
});


describe(util.f1('feed'), function() {
	describe(util.f2('.process_feed()'), function() {
		it(util.f3('should work'), function(done) {
			const feedparser = new FeedParser();
			fs.createReadStream('test/files/feed.xml')
				.pipe(feedparser);

			feedUtils.process_feed(
				feedparser, {
					seen_guids: ['1111'],
					seen_pubdate: undefined
				},
				function(err, result) {
					if (err) { throw err; }
					assert(result.items.length === 3);
					assert(result.new_items.length === 2);
					assert(result.new_items.indexOf('1111') === -1);
					done();
				}
			);
		});
	});
});


describe(util.f1('formatting'), function() {
	// TODO: write tests
});
