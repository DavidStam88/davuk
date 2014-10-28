var sessieController = function ($routeParams, $scope, $location, dbService) {
	$scope.gaVerder = function() {
		console.log($scope.docent.naam);
		console.log($scope.docent.wachtwoord);
	}
}