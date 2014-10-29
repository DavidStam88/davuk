var docentQuizController = function ($scope, $routeParams, $location, $window, socket) {
	//dbService.sessie.get({}, function (res) {
		//if (!res.ingelogd) {
			//$window.location = '/#/docent';
		//}
	//});
	
	var data = {
		titel : "Quiz voor les " + $routeParams.id,
		lesNummer : $routeParams.id
	};
	socket.emit('startQuiz', data);

	$scope.view = 'spelersKamer';
	$scope.vraag = {};
	$scope.spelers = [];
	$scope.lesNummer = $routeParams.id;

	$scope.startQuiz = function () {
		socket.emit('sluitKamerEnStart', {});
		$scope.view = 'vraag';
	}

	$scope.volgendeVraag = function () {
		socket.emit('volgendeVraag', {});
	}

	socket.on('nieuweSpeler', function(speler) {
		$scope.spelers.push(speler);
		$scope.$digest();
	});

	socket.on('vraag', function(vraag){
		$scope.vraag = vraag;
		$scope.$digest();
	});

	socket.on('vraagAntwoorden', function(vraag){
		$scope.vraag = vraag;
		$scope.$digest();
	});

	socket.on('eindeQuiz', function (spelers) {
		$scope.spelers = spelers;
		$scope.view = 'eindeQuiz';
		$scope.$digest();
	});
};