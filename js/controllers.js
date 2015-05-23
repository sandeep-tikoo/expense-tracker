var appControllers = angular.module('appControllers', []);

appControllers.controller('ExpenseCtrl',['expenseService', function(expenseService) {
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

appControllers.controller('IncomeCtrl',['incomeService', function(incomeService) {
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

appControllers.controller('HandleCtrl', [function() {
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

appControllers.controller('OutputCtrl', 
	['$scope', 'summaryService', 'expenseService', 'incomeService', 
	function($scope,summaryService, expenseService, incomeService) {

	var vm = this;
	var summaryHandler = summaryService.on('totals-updated', updateTotals);

  function updateTotals(evt, totals) {

  	vm.income = totals.income;
  	vm.expenses = totals.expenses;
		vm.totalExpenses = totals.totalExpenses;
		vm.netIncome = totals.netIncome;
		vm.grossIncome = totals.grossIncome;
  }	

  vm.removeIncome = function(income) {
  	incomeService.removeIncome(income);
  }

  vm.removeExpense = function(expense) {
  	expenseService.removeExpense(expense);
  }

	$scope.$on('$destroy', function() {
		summaryHandler();
	});

	summaryService.updateTotals();

}]);