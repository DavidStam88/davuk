var lesNummer = 0;

var docentController = function ($routeParams, $scope, $window, dbService) {
	$scope.message = '';
	dbService.sessie.get({}, function (res) {
		if (!res.ingelogd) {
			$window.location = '/#/docent';
		}
	});

	$scope.addVraag = function() {
		if ($scope.vraag._id) {
			dbService.vraag.update({id : $routeParams.id}, $scope.vraag, function (res) {
				$scope.vraag = res.data;
				$scope.message = res.message;
			});
		} else {
			dbService.vraag.post($scope.vraag, function (res) {
				$scope.message = res.message;
			});
		}
	}
	$scope.vragen = [];
	$scope.vraag = {};
	$scope.vraag.lesNummer = lesNummer;
	$scope.getVragen = function () {
		if($routeParams.les) {
			$scope.les = $routeParams.les;
			lesNummer = $routeParams.les;
			$scope.vraag.lesNummer = lesNummer;
			dbService.vragen.get({id : $routeParams.les}, function (res) {
				$scope.vragen = res.data;
				$scope.message = res.message;
			});
		}
	};
	$scope.getVragen();
	$scope.getVraag = function () {
		if($routeParams.id) {
			dbService.vraag.get({id : $routeParams.id}, function (res) {
				$scope.vraag = res.data;
				$scope.message = res.message;
			});
		}
	};
	$scope.getVraag();
	$scope.deleteVraag = function (vraag) {
		dbService.vraag.delete({id : vraag._id}, function (res) {
			$scope.getVragen();
			$scope.message = res.message;
		});
	}
	$scope.lessen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}