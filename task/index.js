'use strict';

var debug = require('debug')('cause-utils:task');
var _ = require('lodash');


var flowDecisionDefaults = module.exports.flowDecisionDefaults = {
	'if': true,
	'else': true,
	'always': true // always true
};

var flowDecision = module.exports.flowDecision =
function(decision) {
	var decisionObj;

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
