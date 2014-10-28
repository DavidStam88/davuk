var docentQuizController = function ($scope, dbService, $window, socket) {
	//dbService.sessie.get({}, function (res) {
		//if (!res.ingelogd) {
			//$window.location = '/#/docent';
		//}
	//});

	$scope.vraag = {};

	$scope.spelers = [];

	$scope.startQuiz = function () {
		socket.emit('startQuiz', "Start");
	}

	$scope.startVraag = function () {
		console.log("get vraag");
		socket.emit('getVraag', {});
	}

	socket.on('vraag', function(vraag){
		console.log(vraag);
		$scope.vraag = vraag;
		$scope.$digest();
	});
};