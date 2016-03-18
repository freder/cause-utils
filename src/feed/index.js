'use strict';

const _ = require('lodash');
const debug = require('debug')('cause-utils:feed');


const processFeed = module.exports.processFeed =
function processFeed(feedparser, options, done) {
	let meta;
	let newItems;
	feedparser.on('meta', (metadata) => {
		meta = metadata;
		newItems = {};
	});

	let guids = [];
	let allItems = [];
	feedparser.on('readable', function() {
		if (!_.isEmpty(meta['pubdate'])
			&& meta['pubdate'] === options.seenPubdate) {
			return;
		}

		let item;
		while (item = this.read()) {
			if (meta['#type'] === 'rss') {
				// TODO: rename keys
			}

			if (options.seenGuids.indexOf(item.guid) === -1) {
				newItems[item.guid] = item;
			}
			guids.push(item.guid);
			allItems.push(item);
		}
	});

	feedparser.on('end', () => {
		done(null, {
			meta, guids,
			items: allItems,
			newItems: _.values(newItems)
		});
	});
};
