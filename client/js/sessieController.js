var sessieController = function ($routeParams, $scope, $window, dbService) {
	$scope.message = '';
	$scope.gaVerder = function() {
		dbService.gaVerder.post($scope.docent, function (res) {
			if (res.ingelogd) {
				$window.location = '/#/docent/lessen';
			} else {
				$scope.message = res.message;
			}
		});
	}
}