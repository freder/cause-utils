'use strict';

const assert = require('assert');
const FeedParser = require('feedparser');
const fs = require('fs');

const util = require('./util.js');

const scrapingUtils = require('../scraping/index.js');
const feedUtils = require('../feed/index.js');
const parsingUtils = require('../parsing/index.js');
// const formattingUtils = require('../formatting/index.js');


describe(util.f1('scraping'), () => {
	describe(util.f2('.query()'), () => {
		it(util.f3('should work with css and jquery'), () => {
			const html = ' \
				<div id="container"> \
					<div class="div">div</div> \
					<span>span</span> \
				</div>';
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

	describe(util.f2('.requestDefaults()'), () => {
		it(util.f3('should set a user agent'), () => {
			const opts = scrapingUtils.requestDefaults();
			assert(opts.headers !== undefined && opts.headers['User-Agent'] !== undefined);
		});
	});
});


describe(util.f1('parsing'), () => {
	describe(util.f2('.time()'), () => {
		it(util.f3('should parse time'), () => {
			let parsed;
			parsed = parsingUtils.time('12 minutes');
			assert(parsed.minutes === 12);

			parsed = parsingUtils.time('12 minutes ago');
			assert(parsed.minutes === 12);
		});

		it(util.f3('should throw errors'), () => {
			assert.throws(() => {
				parsingUtils.time('12');
			});
			assert.throws(() => {
				parsingUtils.time('five minutes');
			});
		});
	});
});


describe(util.f1('feed'), () => {
	describe(util.f2('.processFeed()'), () => {
		it(util.f3('should work'), (done) => {
			const feedparser = new FeedParser();
			fs.createReadStream('test/files/feed.xml')
				.pipe(feedparser);

			feedUtils.processFeed(
				feedparser, {
					seenGuids: ['1111'],
					seenPubdate: undefined
				},
				(err, result) => {
					if (err) { throw err; }
					assert(result.items.length === 3);
					assert(result.newItems.length === 2);
					assert(result.newItems.indexOf('1111') === -1);
					done();
				}
			);
		});
	});
});


describe(util.f1('formatting'), () => {
	// TODO: write tests
});
