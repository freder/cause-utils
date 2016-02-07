'use strict';

const debug = require('debug')('cause-utils:task');
const _ = require('lodash');


const flowDecisionDefaults = module.exports.flowDecisionDefaults = {
	'if': true,
	'else': true,
	'always': true // always true
};

const flowDecision = module.exports.flowDecision =
function(decision) {
	let decisionObj;

	if (_.isBoolean(decision)) {
		decisionObj = {
			'if': decision,
			'else': !decision
		};
	} else if (decision === null || decision === undefined) {
		decisionObj = {
			'if': false,
			'else': false
		};
	} else if (_.isObject(decision)) {
		decisionObj = decision;
	} else {
		throw new Error('invalid argument');
	}

	return _.merge({}, flowDecisionDefaults, decisionObj, { 'always': true });
};
