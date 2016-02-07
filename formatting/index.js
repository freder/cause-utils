'use strict';

const chalk = require('chalk');
const numeral = require('numeral');
const sf = require('sf');


function money(x) {
	return numeral(x).format('0.00');
}


function price(price, options) {
	// options: { currency: 'EUR' }
	var price = price
		.replace(options.currency, '')
		.replace(' ', '');
	switch (options.currency) {
		case 'EUR':
			price = price.replace('.', '');
			price = price.replace(',', '.');
			break;
		default:
			price = price.replace(',', '');
			break;
	}
	return price;
}


function delta(d) {
	var arrow = chalk.gray('=');
	var sign = ' ';
	if (d > 0) {
		arrow = chalk.green('▲');
		sign = '+';
	}
	if (d < 0) {
		arrow = chalk.red('▼');
		sign = '';
	}
	return sf('{0}{1:0.00} {2}', sign, d, arrow);
}


function priceDelta(price, prevPrice, task) {
	var d = delta(price - prevPrice);
	var message = chalk.green(money(price));
	return sf('{0} | {1}', cliMsg(task.name, d), message);
}


function cliMsg(prefix, msg) {
	msg = msg || '';
	return sf('{0} {1}', chalk.bgBlue(prefix), msg);
}


module.exports = {
	cliMsg: cliMsg,
	delta: delta,
	price: price,
	priceDelta: priceDelta,
	money: money
};
