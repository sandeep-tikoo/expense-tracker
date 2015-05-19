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

app.controller('HandleCtrl', ['$scope', 'expenseService', 'incomeService', function($scope, expenseService, incomeService) {
	$scope.addExpense = function(expense) {
		expenseService.addExpense(expense);
	};
	$scope.addIncome = function(income) {
		incomeService.addIncome(income);
	};
}]);

app.controller('OutputCtrl', ['$scope', 'expenseService', 'incomeService', function($scope, expenseService, incomeService) {
	$scope.expenses = expenseService.getExpenses();
	$scope.income = incomeService.getIncome();
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

	var addExpense = function(newExpense) {
		expenses.push(newExpense);
	};

	var getExpenses = function() {
		return expenses;
	};

	return {
		addExpense: addExpense,
		getExpenses: getExpenses
	};
});

app.factory('incomeService', function() {
	var income = [
		{
			'name': 'Food',
			'amount': 10.24
		},
		{
			'name': 'Gas',
			'amount': 50.45
		}
	];

	var addIncome = function(newIncome) {
		income.push(newIncome);
	};

	var getIncome = function() {
		return income;
	};

	return {
		addIncome: addIncome,
		getIncome: getIncome
	};
});