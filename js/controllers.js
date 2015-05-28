app.controller('RevenueCtrl',[
	'$scope', '$routeParams', '$location', 'expenseService', 'incomeService', 'REVENUE_TYPE',
	function($scope, $routeParams, $location, expenseService, incomeService, REVENUE_TYPE) {
	var vm = this;
	var revenueService = null;
	vm.revenue = null;

	// Select the appropriate revenue service for this actions
	if($routeParams.action == 'new') {
		if($routeParams.typeOrId == REVENUE_TYPE.INCOME) {
			revenueService = incomeService;
		} else if($routeParams.typeOrId == REVENUE_TYPE.EXPENSE) {
			revenueService = expenseService;
		}
		vm.revenue = revenueService.model();

	// action == edit (check to be implemented..)
	} else {
		// query both the expense and income service for the provided id.
		// from this we can also tell what revenue type has been queried
		vm.revenue = expenseService.get($routeParams.typeOrId);
		revenueService = expenseService;
		if(!vm.revenue) { // expense not found, try income
			vm.revenue = incomeService.get($routeParams.typeOrId);
			revenueService = incomeService;
		}

		if(!vm.revenue) {
			// @TODO: Implement error handling for non-found ids.
		}
	}

	vm.formatStartDate = function(revenue) {
		vm.revenue.start = moment(revenue.startFormatted, 'DD, MMM YYYY').unix()
	}
	vm.addRevenue = function(revenue) {
		// Due to Angular's data binding, we dont actually
		// have to manually save existing revenues.
		if(revenue.id == null) {
			revenueService.add(revenue);
		}
		vm.revenue = revenueService.model();
		$location.path('/');
	};

}]);

app.controller('OverviewCtrl', 
	['$scope', 'summaryService', 'expenseService', 'incomeService', 
	function($scope, summaryService, expenseService, incomeService) {

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
  	incomeService.remove(income);
  }
  vm.removeExpense = function(expense) {
  	expenseService.remove(expense);
  }

	$scope.$on('$destroy', function() {
		summaryHandler();
	});

	summaryService.updateTotals();

}]);