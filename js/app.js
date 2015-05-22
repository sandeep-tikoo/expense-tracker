var app = angular.module('expenses', []);

app.controller('ExpenseCtrl',['$scope','expenseService', function($scope, expenseService) {
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

app.controller('IncomeCtrl',['$scope','incomeService', function($scope, incomeService) {
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

app.controller('OutputCtrl', ['$scope', 'expenseService', 'incomeService', function($scope, expenseService, incomeService) {
	$scope.expenses = expenseService.getExpenses();
	$scope.income = incomeService.getIncome();
	$scope.totalExpenses = expenseService.getNetAmount();
	$scope.netIncome = incomeService.getNetAmount() - expenseService.getNetAmount();
	$scope.grossIncome = incomeService.getNetAmount();

  function updateTotals() {
		$scope.totalExpenses = expenseService.getNetAmount();
		$scope.netIncome = incomeService.getNetAmount() - expenseService.getNetAmount();
		$scope.grossIncome = incomeService.getNetAmount();
  }

  var expenseHandler = expenseService.on('expense-added', updateTotals);
  var incomeHandler = incomeService.on('income-added', updateTotals);
	
	$scope.$on('$destroy',function() {
		expenseHandler();
		incomeHandler();
	});

}]);

app.factory('expenseService', function($rootScope) {

	var expenseScope = $rootScope.$new();
	var expenses = [
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
		expenses.push(newExpense);
		expenseScope.$emit('expense-added',newExpense);
	};

	var getExpenses = function() {
		return expenses;
	};

	var getNetAmount = function() {
		var total = 0;
		for (var i = 0; i < expenses.length; i++) {
			var obj = expenses[i];
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
});

app.factory('incomeService', function($rootScope) {
	var incomeScope = $rootScope.$new();
	var income = [
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
		income.push(newIncome);
		incomeScope.$emit('income-added',newIncome);
	};

	var getIncome = function() {
		return income;
	};

	var getNetAmount = function() {
		var total = 0;
		for (var i = 0; i < income.length; i++) {
			var obj = income[i];
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
});
