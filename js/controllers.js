var appControllers = angular.module('appControllers', []);

appControllers.controller('ExpenseCtrl',['expenseService', function(expenseService) {
	var vm = this;
	
	vm.expense = expenseService.model();
	// Add a tempary date format field to hold the date picker
	// date string in
	vm.expense.startFormatted = '';
	vm.formatStartDate = function(expense) {
		vm.expense.start = moment(expense.startFormatted, 'DD, MMM YYYY').unix()
	}
	vm.addExpense = function(expense) {
		expenseService.add(expense);
		vm.expense = expenseService.model();
	};

}]);

appControllers.controller('IncomeCtrl',['incomeService', function(incomeService) {
	var vm = this;
	
	vm.income = incomeService.model();
	// Add a tempary date format field to hold the date picker
	// date string in
	vm.income.startFormatted = '';
	vm.formatStartDate = function(income) {
		vm.income.start = moment(income.startFormatted, 'DD, MMM YYYY').unix()
	}
	vm.addIncome = function(income) {
		incomeService.add(income);
		vm.income = incomeService.model();
	};

}]);

appControllers.controller('OutputCtrl', 
	['$scope', 'summaryService', 'expenseService', 'incomeService', 
	function($scope, summaryService, expenseService, incomeService) {

	var vm = this;
	var summaryHandler = summaryService.on('totals-updated', updateTotals);

  function updateTotals(evt, totals) {

  	vm.income = totals.income;
  	console.log(vm.income);
  	vm.expenses = totals.expenses;
		vm.totalExpenses = totals.totalExpenses;
		vm.netIncome = totals.netIncome;
		vm.grossIncome = totals.grossIncome;
  }	

  vm.removeIncome = function(income) {
  	incomeService.remove(income);
  }

  vm.editIncome = function(income) {
		var inst = $.remodal.lookup[$('[data-remodal-id=incomeModal]').data('remodal')];
		inst.open();
	};

  vm.removeExpense = function(expense) {
  	expenseService.remove(expense);
  }

	vm.editExpense = function(expense) {
		var inst = $.remodal.lookup[$('[data-remodal-id=expenseModal]').data('remodal')];
		inst.open();
	};

	$scope.$on('$destroy', function() {
		summaryHandler();
	});

	summaryService.updateTotals();

}]);