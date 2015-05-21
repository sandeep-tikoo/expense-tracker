var app = angular.module('expenses', []);

app.controller('ExpensesCtrl', function($scope) {
	$scope.dialogOpen = false;

	$scope.addExpense = function() {
		$('#base').append('<div class="expense">Expense:<input type="text">Amount:<input type="text"></div>');
		$scope.dialogOpen = true;
	};

	$scope.addIncome = function() {
		$('#base').append('<div class="expense">Income:<input type="text">Amount:<input type="text"></div>');
	}
});

app.controller('HandleCtrl', ['$scope', '$rootScope', 'expenseService', 'incomeService', function($scope, $rootScope, expenseService, incomeService) {
	$scope.expenseVisible = false;
	$scope.incomeVisible = false;

	$scope.expense = {
		name: "",
		amount: ""
	};
	$scope.income = {
		name: "",
		amount: ""
	};

	$scope.addExpense = function(expense) {
		expenseService.addExpense(expense);
		$scope.expense = {};

	};
	$scope.addIncome = function(income) {
		incomeService.addIncome(income);
		$scope.income = {};
	};

	$scope.showExpense = function() {
		$scope.incomeVisible = false;
		$scope.expenseVisible = true;
	};
	$scope.showIncome = function() {
		$scope.expenseVisible = false;
		$scope.incomeVisible = true;
	}
}]);

app.controller('OutputCtrl', ['$scope', 'expenseService', 'incomeService', function($scope, expenseService, incomeService) {
	$scope.expenses = expenseService.getExpenses();
	$scope.income = incomeService.getIncome();
	$scope.totalExpenses = expenseService.getNetAmount();
	$scope.netIncome = incomeService.getNetAmount() - expenseService.getNetAmount();
	$scope.grossIncome = incomeService.getNetAmount();

	$scope.$on('update-totals', function(event, args) {
		$scope.totalExpenses = expenseService.getNetAmount();
		$scope.netIncome = incomeService.getNetAmount() - expenseService.getNetAmount();
		$scope.grossIncome = incomeService.getNetAmount();
	});
}]);

app.factory('expenseService', function() {
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

	var Tts = {
		net: 0
	};

	var addExpense = function(newExpense) {
		expenses.push(newExpense);
	};

	var getExpenses = function() {
		return expenses;
	};

	var getNetAmount = function() {
		var total = 0;
		for (var i = 0; i < expenses.length; i++) {
			var obj = expenses[i];
			total += obj.amount;
		}
		
		return total;
	}

	return {
		addExpense: addExpense,
		getExpenses: getExpenses,
		getNetAmount: getNetAmount
	};
});

app.factory('incomeService', function() {
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
	};

	var getIncome = function() {
		return income;
	};

	var getNetAmount = function() {
		var total = 0;
		for (var i = 0; i < income.length; i++) {
			var obj = income[i];
			total += obj.amount;
		}
		
		return total;
	}

	return {
		addIncome: addIncome,
		getIncome: getIncome,
		getNetAmount: getNetAmount
	};
});