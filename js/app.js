var app = angular.module('expenses', ['ngStorage']);

app.controller('ExpenseCtrl',['expenseService', function(expenseService) {
	var vm = this;
	
	vm.expense = {
		name: "",
		amount: ""
	};

	vm.addExpense = function(expense) {
		expenseService.addExpense(expense);
		vm.expense = {};
	};

}]);

app.controller('IncomeCtrl',['incomeService', function(incomeService) {
	var vm = this;
	
	vm.income = {
		name: "",
		amount: ""
	};

	vm.addIncome = function(income) {
		incomeService.addIncome(income);
		vm.income = {};
	};

}]);

app.controller('HandleCtrl', [function() {
	var vm = this;

	vm.expenseVisible = false;
	vm.incomeVisible = false;
	
	vm.showExpense = function() {
		vm.incomeVisible = false;
		vm.expenseVisible = true;
	};

	vm.showIncome = function() {
		vm.expenseVisible = false;
		vm.incomeVisible = true;
	};
}]);

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
	
	return {
		updateTotals: updateTotals,
		on: function(evt, cb) {
			return summaryScope.$on(evt, cb);
		}
	};

}]);

app.controller('OutputCtrl', ['$scope', 'summaryService', function($scope,summaryService) {
	var vm = this;
	var summaryHandler = summaryService.on('totals-updated', updateTotals);

  function updateTotals(evt, totals) {

  	vm.income = totals.income;
  	vm.expenses = totals.expenses;
		vm.totalExpenses = totals.totalExpenses;
		vm.netIncome = totals.netIncome;
		vm.grossIncome = totals.grossIncome;
  }	

	$scope.$on('$destroy', function() {
		summaryHandler();
	});

	summaryService.updateTotals();

}]);

app.factory('expenseService', 
	['$rootScope', '$localStorage',
	function($rootScope, $localStorage) {

	var expenseScope = $rootScope.$new();
	$localStorage.expenses = $localStorage.expenses || [
		{
			'name': 'Food',
			'amount': 10.24
		},
		{
			'name': 'Gas',
			'amount': 50.45
		}
	];

	var addExpense = function(newExpense) {
		$localStorage.expenses.push(newExpense);
		expenseScope.$emit('expense-added',newExpense);
	};

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
		{
			'name': 'Paycheque',
			'amount': 300.00
		},
		{
			'name': 'Lottery',
			'amount': 45.00
		}
	];

	var addIncome = function(newIncome) {
		$localStorage.income.push(newIncome);
		incomeScope.$emit('income-added',newIncome);
	};

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
		getIncome: getIncome,
		getNetAmount: getNetAmount,
		on : function(evt, cb) {
			return incomeScope.$on(evt, cb);
		}
	};
}]);