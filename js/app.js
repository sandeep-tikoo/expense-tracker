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
		totals.expenses = expenseService.items();
		totals.income = incomeService.items();
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
 * Object Revenue.
 *  An abstraction of Incomes and Expenses that defines a base model,
 *  mutators, and functions that both Incomes and Expenses use
 *
 * @param revenueType - the REVENUE_TYPE (app constant) that this instance should
 *   be constructed as
 */
function Revenue($rootScope, $localStorage, FREQUENCY, revenueType) {
		this.revenueScope = $rootScope.$new();
		this.revenueType = revenueType;
		this.FREQUENCY = FREQUENCY;
		this.storage = $localStorage[revenueType] || [];
}
/**
 * Function model()
 *  @return - Blank Model containing default starting values
 */
Revenue.prototype.model = function() {
	return {
		name: "",
		amount: "",
		frequency: this.FREQUENCY.ONCE
	}
}

/**
 * function add() - adds a model instance to the defined revenue type collection
 * @param model - A revenue Model
 */
Revenue.prototype.add = function(model) {
	this.storage.push(model);
	this.revenueScope.$emit(this.revenueType+'-added', model);
};

/**
 * function remove() - removes a model instance from the defined revenue type collection
 * @param model - A revenue Model
 */
Revenue.prototype.remove = function(model) {
	var i = this.storage.indexOf(model);
	this.items().splice(i, 1); // remove the item
	this.revenueScope.$emit(this.revenueType+'-removed', model);
};

/**
 * function items()
 * @return - the entire revenue collection
 */
Revenue.prototype.items = function() {
	return this.storage;
};

/**
 * function total()
 * @return - the accumulative financial value of the entire revenue collection
 */
Revenue.prototype.total = function() {
	var total = 0;
	for (var i = 0; i < this.storage.length; i++) {
		total += parseFloat(this.storage[i].amount);
	}
	return total;
}

Revenue.prototype.edit = function(model) {
	var i = this.storage.indexOf(model);
}

/**
 * function on() - Wrapper function for the $rootScope $on() function.
 */
Revenue.prototype.on = function(evt,cb) {
	return this.revenueScope.$on(evt, cb);
}

/**
 * Service expenseService - simply a wrapper to provide a Revenue instantiated as an Expense
 */
app.factory('expenseService', ['$injector', 'REVENUE_TYPE', function ($injector, REVENUE_TYPE) {
		return $injector.instantiate(Revenue,{ revenueType: REVENUE_TYPE.EXPENSE });
}]);
/**
 * Service incomeService - simply a wrapper to provide a Revenue instantiated as an Income
 */
app.factory('incomeService', ['$injector', 'REVENUE_TYPE', function ($injector, REVENUE_TYPE) {
		return $injector.instantiate(Revenue,{ revenueType: REVENUE_TYPE.INCOME });
}]);