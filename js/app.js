var app = angular.module('expenses', ['appControllers', 'ngStorage']);

app.factory('summaryService', ['expenseService', 'incomeService', '$rootScope', function(expenseService, incomeService, $rootScope){

  var summaryScope = $rootScope.$new();
	function updateTotals() {
		var totals = {};
		totals.expenses = expenseService.getExpenses();
		totals.income = incomeService.getIncome();
		totals.totalExpenses = expenseService.getNetAmount();
		totals.netIncome = incomeService.getNetAmount() - expenseService.getNetAmount();
		totals.grossIncome = incomeService.getNetAmount();
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

app.factory('expenseService', 
	['$rootScope', '$localStorage',
	function($rootScope, $localStorage) {

	var expenseScope = $rootScope.$new();
	$localStorage.expenses = $localStorage.expenses || [
	];

	var addExpense = function(newExpense) {
		$localStorage.expenses.push(newExpense);
		expenseScope.$emit('expense-added',newExpense);
	};

	var removeExpense = function(expense) {
		var i = $localStorage.expenses.indexOf(expense);
		$localStorage.expenses.splice(i, 1); // remove the item
		expenseScope.$emit('expense-removed',expense);
	}

	var getExpenses = function() {
		return $localStorage.expenses;
	};

	var getNetAmount = function() {
		var total = 0;
		for (var i = 0; i < $localStorage.expenses.length; i++) {
			var obj = $localStorage.expenses[i];
			total += parseFloat(obj.amount);
		}
		return total;
	}

	return {
		addExpense: addExpense,
		removeExpense: removeExpense,
		getExpenses: getExpenses,
		getNetAmount: getNetAmount,
		on : function(evt,cb) {
			return expenseScope.$on(evt, cb);
		}
	};
}]);

app.factory('incomeService', 
	['$rootScope', '$localStorage',
	function($rootScope, $localStorage) {

	var incomeScope = $rootScope.$new();
	$localStorage.income = $localStorage.income || [
	];

	var addIncome = function(newIncome) {
		$localStorage.income.push(newIncome);
		incomeScope.$emit('income-added',newIncome);
	};

	var removeIncome = function(income) {
		var i = $localStorage.income.indexOf(income);
		$localStorage.income.splice(i, 1); // remove the item
		incomeScope.$emit('income-removed',income);
	}

	var getIncome = function() {
		return $localStorage.income;
	};

	var getNetAmount = function() {
		var total = 0;
		for (var i = 0; i < $localStorage.income.length; i++) {
			var obj = $localStorage.income[i];
			total += parseFloat(obj.amount);
		}
		return total;
	}

	return {
		addIncome: addIncome,
		removeIncome: removeIncome,
		getIncome: getIncome,
		getNetAmount: getNetAmount,
		on : function(evt, cb) {
			return incomeScope.$on(evt, cb);
		}
	};
}]);