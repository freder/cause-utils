'use strict';

const assert = require('assert');
const _ = require('lodash');
const cheerio = require('cheerio');
const FeedParser = require('feedparser');
const fs = require('fs');

const taskUtils = require('../task/index.js');
const scrapingUtils = require('../scraping/index.js');
const feedUtils = require('../feed/index.js');
const parsingUtils = require('../parsing/index.js');
const formattingUtils = require('../formatting/index.js');


describe('task', function() {
	describe('.flowDecision()', function() {
		it('should work with boolean argument', function() {
			const decision = taskUtils.flowDecision(false);
			assert(decision['if'] === false);
			assert(decision['else'] === true);
		});

		it('should work with object argument', function() {
			const decision = taskUtils.flowDecision({
				'if': false
			});
			assert(decision['if'] === false);
			assert(decision['else'] === true);
		});

		it('should work with undefined/null argument', function() {
			let decision = taskUtils.flowDecision(null);
			assert(decision['if'] === false);
			assert(decision['else'] === false);

			decision = taskUtils.flowDecision(undefined);
			assert(decision['if'] === false);
			assert(decision['else'] === false);
		});

		it('`always` should always be true', function() {
			const decision = taskUtils.flowDecision({ 'always': false });
			assert(decision['always'] === true);
		});

		it('should leave defaults untouched', function() {
			taskUtils.flowDecision({
				'if': false,
				'else': false,
				'always': false
			});
			assert(taskUtils.flowDecisionDefaults['if'] === true);
			assert(taskUtils.flowDecisionDefaults['else'] === true);
			assert(taskUtils.flowDecisionDefaults['always'] === true);
		});

		it('should throw error on wrong argument type', function() {
			const decision = [
				{ 'if': false },
				{ 'else': false },
				{ 'always': false }
			];
			assert.throws(() => {
				taskUtils.flowDecision(decision);
			});
		});
	});
});


describe('scraping', function() {
	describe('.query()', function() {
		it('should work with css and jquery', function() {
			const html = ' \
				<div id="container"> \
					<div class="div">div</div> \
					<span>span</span> \
				</div>';
			const $ = cheerio.load(html);
			let query, $result;

			query = '$("#container div").first()';
			$result = scrapingUtils.query('jquery', query, html);
			assert($result.text().trim() == 'div');

			query = '#container span';
			$result = scrapingUtils.query('css', query, html);
			assert($result.text().trim() == 'span');

			query = '#notfound';
			$result = scrapingUtils.query('css', query, html);
			assert($result.length === 0);

			$result = scrapingUtils.query('never_heard_of_this', query, html);
			assert($result === null);
		});
	});

	describe('.requestDefaults()', function() {
		it('should set a user agent', function() {
			const opts = scrapingUtils.requestDefaults();
			assert(opts.headers !== undefined && opts.headers['User-Agent'] !== undefined);
		});
	});
});


describe('parsing', function() {
	describe('.time()', function() {
		it('should parse time', function() {
			let parsed;
			parsed = parsingUtils.time('12 minutes');
			assert(parsed.minutes === 12);

			parsed = parsingUtils.time('12 minutes ago');
			assert(parsed.minutes === 12);
		});

		it('should throw errors', function() {
			assert.throws(() => {
				parsingUtils.time('12');
			});
			assert.throws(() => {
				parsingUtils.time('five minutes');
			});
		});
	});
});


describe('feed', function() {
	describe('.process_feed()', function() {
		it('should work', function(done) {
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


describe('formatting', function() {
	// TODO: write tests
});
