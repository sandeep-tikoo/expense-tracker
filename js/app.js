var app = angular.module('expenses', ['appControllers', 'ngStorage']);

app.constant('REVENUE_TYPE', {
	INCOME: 'income',
	EXPENSE: 'expense'
});

// Constant: FREQUENCY - defined to help minimise potential for human error
// in typing frequencies as (unchecked) string literals throughout the app
app.constant('FREQUENCY', {
	ONCE: 'once',
	FORTNIGHT: 'fortnightly',
	MONTH: 'monthly',
	QUARTER: 'quarterly',
	YEAR: 'yearly'
});

app.factory('summaryService', ['expenseService', 'incomeService', '$rootScope', function(expenseService, incomeService, $rootScope){

  var summaryScope = $rootScope.$new();
	function updateTotals() {
		var totals = {};
		totals.expenses = expenseService.get();
		totals.income = incomeService.get();
		totals.totalExpenses = expenseService.total();
		totals.netIncome = incomeService.total() - expenseService.total();
		totals.grossIncome = incomeService.total();
		summaryScope.$emit('totals-updated', totals);
		return totals;
	}

	expenseService.on('expense-added', updateTotals);
	incomeService.on('income-added', updateTotals);
	expenseService.on('expense-removed', updateTotals);
	incomeService.on('income-removed', updateTotals);

	return {
		updateTotals: updateTotals,
		on: function(evt, cb) {
			return summaryScope.$on(evt, cb);
		}
	};

}]);

/**
 * Service revenueService.
 *  An abstraction of Incomes and Expenses that defines a base model,
 *  mutators, and functions that both Incomes and Expenses use
 *
 * @param _revenueType - the REVENUE_TYPE (app constant) that this instance should
 *   be constructed as
 */
app.factory('revenueService',
	['$rootScope', '$localStorage', 'FREQUENCY',
	function($rootScope, $localStorage, FREQUENCY) {

		var revenueScope = $rootScope.$new();

		$localStorage.expenses = $localStorage.expenses || [];
		var revenueType = null;

		/**
		 * Function model()
		 *  @return - Blank Model containing default starting values
		 */
		var model = function() {
			return {
				name: "",
				amount: "",
				frequency: FREQUENCY.ONCE
			}
		}

		/**
		 * function add() - adds a model instance to the defined revenue type collection
		 * @param model - A revenue Model
		 */
		var add = function(model) {
			$localStorage[revenueType].push(model);
			revenueScope.$emit(revenueType+'-added', model);
		};

		/**
		 * function remove() - removes a model instance from the defined revenue type collection
		 * @param model - A revenue Model
		 */
		var remove = function(model) {
			var i = $localStorage[revenueType].indexOf(model);
			$localStorage[revenueType].splice(i, 1); // remove the item
			revenueScope.$emit(revenueType+'-removed', model);
		};

		/**
		 * function get()
		 * @return - the entire revenue collection
		 */
		var get = function() {
			return $localStorage[revenueType];
		};

		/**
		 * function total()
		 * @return - the accumulative financial value of the entire revenue collection
		 */
		var total = function() {
			var total = 0;
			for (var i = 0; i < $localStorage[revenueType].length; i++) {
				var obj = $localStorage[revenueType][i];
				total += parseFloat(obj.amount);
			}
			return total;
		}

		return function(_revenueType) {
			revenueType = _revenueType;
			return  {
				model: model,
				add: add,
				remove: remove,
				get: get,
				total: total,
				on : function(evt,cb) {
					return revenueScope.$on(evt, cb);
				}
			};
		};
}]);

/**
 * Service expenseService - simply a wrapper to provide a revenueService instantiated as an Expense
 */
app.factory('expenseService',
	['$rootScope', 'revenueService', 'REVENUE_TYPE',
	function($rootScope, revenueService, REVENUE_TYPE) {

		return revenueService(REVENUE_TYPE.EXPENSE);
}]);

/**
 * Service incomeService - simply a wrapper to provide a revenueService instantiated as an Income
 */
app.factory('incomeService',
	['$rootScope', 'revenueService', 'REVENUE_TYPE',
	function($rootScope, revenueService, REVENUE_TYPE) {

		return revenueService(REVENUE_TYPE.INCOME);
}]);
