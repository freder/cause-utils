'use strict';

var assert = require('assert');
var taskUtils = require('../task/index.js');


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
