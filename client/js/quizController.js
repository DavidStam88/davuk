var quizController = function ($scope, socket) {
	$scope.vraag = {};
	$scope.timer = 0;
	$scope.message = '';
	$scope.spelers = [];
	$scope.view = '';
	$scope.antwoord = '';
	var geantwoord = false;
	var nieuweScore = 0;
	$scope.speler = {};

	$scope.addSpeler = function (speler) {
		socket.emit('addSpeler', speler);
		$scope.speler.naam = speler.naam;
		$scope.message = 'Aangemeld';
		$scope.view = 'spelersKamer';
	}

	$scope.geefAntwoord = function (antwoord) {
		if (!geantwoord) {
			socket.emit('antwoord', antwoord);
			geantwoord = true;
			$scope.message = "Je antwoord is verwerkt.";
		} else {
			$scope.message = "Je hebt al een antwoord gegeven.";
		}
	}

	socket.on('updateScore', function(score){
		nieuweScore = score;
	});

	socket.on('vraag', function(vraag){
		$scope.message = "Er is een nieuwe vraag";
		$scope.vraag = vraag;
		$scope.speler.score = nieuweScore;
		$scope.view = 'quiz';
		geantwoord = false;
		$scope.$digest();
	});

	socket.on('message', function(data){
		if (data.spelen) {
			$scope.view = 'speelMee';
		} else {
			$scope.view = '';
		}
		$scope.message = data.message;
		$scope.$digest();
	});

	socket.on('nieuweSpeler', function(speler) {
		$scope.spelers.push(speler);
		$scope.$digest();
	});

	socket.on('eindeQuiz', function (spelers) {
		$scope.spelers = spelers;
		$scope.view = 'eindeQuiz';
		$scope.speler.score = nieuweScore;
		$scope.$digest();
	});
};