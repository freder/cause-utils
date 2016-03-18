'use strict';

const chalk = require('chalk');
const numeral = require('numeral');
const sf = require('sf');


const list = module.exports.list =
function list(l) {
	return l.join('\n');
};


const money = module.exports.money =
function money(x) {
	return numeral(x).format('0.00');
};


const price = module.exports.price =
function price(_price, options) {
	// options: { currency: 'EUR' }
	let formattedPrice = _price
		.replace(options.currency, '')
		.replace(' ', '');
	switch (options.currency) {
		case 'EUR':
			formattedPrice = formattedPrice
				.replace('.', '')
				.replace(',', '.');
			break;
		default:
			formattedPrice = formattedPrice.replace(',', '');
			break;
	}
	return formattedPrice;
};


const delta = module.exports.delta =
function delta(d) {
	let arrow = chalk.gray('=');
	let sign = ' ';
	if (d > 0) {
		arrow = chalk.green('▲');
		sign = '+';
	}
	if (d < 0) {
		arrow = chalk.red('▼');
		sign = '';
	}
	return sf('{0}{1:0.00} {2}', sign, d, arrow);
};


const priceDelta = module.exports.priceDelta =
function priceDelta(price, prevPrice, task) {
	const deltaStr = delta(price - prevPrice);
	const message = chalk.green(money(price));
	return `${cliMsg(task.name, deltaStr)} | ${message}`;
};


// —————————————


const blockName = module.exports.blockName =
function blockName(name) {
	return `${chalk.bgMagenta.white(name)}`;
};


const taskName = module.exports.taskName =
function taskName(name) {
	return `${chalk.bgBlue.white(name)}`;
};


const cliMsg = module.exports.cliMsg =
function cliMsg(prefix, msg='') {
	return `${chalk.bgBlue(prefix)} ${msg}`;
};


const taskMsg = module.exports.taskMsg =
function taskMsg(task, msg='') {
	return `${cliMsg(taskName(task.name))} ${msg}`;
};


const stepMsg = module.exports.stepMsg =
function stepMsg(task, step, msg='') {
	const prefix = `${taskName(task.name)} ${step.block}`;
	return `${cliMsg(prefix)} ${msg}`;
};
