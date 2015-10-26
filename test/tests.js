'use strict';

var assert = require('assert');
var _ = require('lodash');
var cheerio = require('cheerio');
var FeedParser = require('feedparser');
var fs = require('fs');

var taskUtils = require('../task/index.js');
var scrapingUtils = require('../scraping/index.js');
var feedUtils = require('../feed/index.js');
var parsingUtils = require('../parsing/index.js');
var formattingUtils = require('../formatting/index.js');


describe('task', function() {
	describe('.flowDecision()', function() {
		it('should work with boolean argument', function() {
			var decision = taskUtils.flowDecision(false);
			assert(decision['if'] === false);
			assert(decision['else'] === true);
		});

		it('should work with object argument', function() {
			var decision = taskUtils.flowDecision({
				'if': false
			});
			assert(decision['if'] === false);
			assert(decision['else'] === true);
		});

		it('should work with undefined/null argument', function() {
			var decision = taskUtils.flowDecision(null);
			assert(decision['if'] === false);
			assert(decision['else'] === false);

			decision = taskUtils.flowDecision(undefined);
			assert(decision['if'] === false);
			assert(decision['else'] === false);
		});

		it('`always` should always be true', function() {
			var decision = taskUtils.flowDecision({ 'always': false });
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
	});
});


describe('scraping', function() {
	describe('.query()', function() {
		it('should work with css and jquery', function() {
			var html = ' \
				<div id="container"> \
					<div class="div">div</div> \
					<span>span</span> \
				</div>';
			var $ = cheerio.load(html);
			var query, $result;

			query = '$("#container div").first()';
			$result = scrapingUtils.query('jquery', query, html);
			assert($result.text().trim() == 'div');

			query = '#container span';
			$result = scrapingUtils.query('css', query, html);
			assert($result.text().trim() == 'span');

			query = '#notfound';
			var result = scrapingUtils.query('css', query, html);
			assert(result.length === 0);

			assert(scrapingUtils.query('never_heard_of_this', query, html) === null);
		});
	});

	describe('.requestDefaults()', function() {
		it('should set a user agent', function() {
			var opts = scrapingUtils.requestDefaults();
			assert(opts.headers !== undefined && opts.headers['User-Agent'] !== undefined);
		});
	});
});


describe('parsing', function() {
	describe('.time()', function() {
		it('should parse time', function() {
			var parsed;
			parsed = parsingUtils.time('12 minutes');
			assert(parsed.minutes === 12);

			parsed = parsingUtils.time('12 minutes ago');
			assert(parsed.minutes === 12);
		});

		it('should throw errors', function() {
			assert.throws(function() { parsingUtils.time('12'); });
			assert.throws(function() { parsingUtils.time('five minutes'); });
		});
	});
});


describe('feed', function() {
	describe('.process_feed()', function() {
		it('should work', function(done) {
			var feedparser = new FeedParser();
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
