var app = angular.module('expenses', ['ngStorage', 'ngRoute']);

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
		// Ensure storage has been creatd for this revenueType
		$localStorage['revenue'] = $localStorage['revenue'] || [];
		this.localStorage = $localStorage;
}
/**
 * Function model()
 *  @return - Blank Model containing default starting values
 */
Revenue.prototype.model = function() {
	return {
		type: this.revenueType,
		id: null,
		name: "",
		amount: "",
		frequency: this.FREQUENCY.ONCE,
		start: "",
		startFormatted: ""
	}
}

/**
 * function add() - adds a model instance to the defined revenue type collection
 * @param model - A revenue Model
 */
Revenue.prototype.add = function(model) {
	model.id = this.localStorage['revenue'].length;
	if (parseFloat(model.amount) <= 0) {
		model.amount = parseFloat(model.amount) * -1;
	}
	this.localStorage['revenue'].push(model);
	this.revenueScope.$emit(this.revenueType+'-added', model);
};

/**
 * function remove() - removes a model instance from the defined revenue type collection
 * @param model - A revenue Model
 */
Revenue.prototype.remove = function(model) {
	var i = this.localStorage['revenue'].indexOf(model);
	this.localStorage['revenue'].splice(i, 1); // remove the item
	this.revenueScope.$emit(this.revenueType+'-removed', model);
};

/**
 * function items()
 * @return - the entire revenue collection
 */
Revenue.prototype.items = function() {
	var items = [];
	// filter the items for only those that are of the defined revenueType
	for(i in this.localStorage['revenue']) {
		if(this.localStorage['revenue'][i].type == this.revenueType) {
			items.push(this.localStorage['revenue'][i]);
		}
	}
	return items;
};

/**
 * function get()
 * @return - a single revenue item, false if it cannot be found
 */
Revenue.prototype.get = function(id) {
	var items = this.items();
	var item = false;
	for(i in items) {
		if(items[i].id == id) {
			item = items[i];
		}
	}
	return item;
}

/**
 * function total()
 * @return - the accumulative financial value of the entire revenue collection
 *   of this instance's revenue type
 */
Revenue.prototype.total = function() {
	var total = 0;
	for (var i = 0; i < this.localStorage['revenue'].length; i++) {
		if(this.localStorage['revenue'][i].type == this.revenueType) {
			total += parseFloat(this.localStorage['revenue'][i].amount);
		}
	}
	return total;
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

/**
 * app Config
 */
app.config([
  '$routeProvider',
  function(
    $routeProvider) {

    $routeProvider.
      when('/', {
        templateUrl: '_partials/overview.html',
        controller: 'OverviewCtrl',
      }).
      when('/revenue/:action/:typeOrId', {
        templateUrl: '_partials/revenue_detail.html',
        controller: 'RevenueCtrl',
      }).
      otherwise({
        redirectTo: '/'
      });
}]);