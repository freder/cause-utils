'use strict';

var _ = require('lodash');
var debug = require('debug')('cause-utils:feed');


function process_feed(feedparser, opts, done) {
	var meta;
	var new_items;
	feedparser.on('meta', function(metadata) {
		meta = metadata;
		new_items = {};
	});

	var guids = [];
	var all_items = [];
	feedparser.on('readable', function() {
		if (!_.isEmpty(meta['pubdate']) && meta['pubdate'] === opts.seen_pubdate) {
			return;
		}

		var item;
		while (item = this.read()) {
			if (meta['#type'] === 'rss') {
				// TODO: rename keys
			}

			if (opts.seen_guids.indexOf(item.guid) === -1) {
				new_items[item.guid] = item;
			}
			guids.push(item.guid);
			all_items.push(item);
		}
	});

	feedparser.on('end', function() {
		done(null, {
			meta: meta,
			guids: guids,
			items: all_items,
			new_items: _.values(new_items)
		});
	});
}


module.exports = {
	process_feed: process_feed
};
