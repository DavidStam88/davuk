var quizController = function ($scope, socket) {
	$scope.vraag = {};
	$scope.timer = 30;
	$scope.timeLeft = $scope.timer;
	$scope.message = '';
	$scope.error = '';
	$scope.stand = 'Tussenstand';
	$scope.spelers = [];
	$scope.view = '';
	$scope.antwoord = '';
	$scope.geantwoord = false;
	var nieuweScore = 0;
	$scope.speler = {};
	$scope.speler.naam = '';

	$scope.addSpeler = function (speler) {
		nieuweScore = 0;
		$scope.speler.score = 0;
		socket.emit('addSpeler', speler);
		$scope.speler.naam = speler.naam;
		$scope.message = 'Aangemeld, de quiz begint bijna..';
		$scope.error = '';
		$scope.view = 'spelersKamer';
	}

	$scope.geefAntwoord = function (antwoord) {
		if (!$scope.geantwoord) {
			socket.emit('antwoord', antwoord);
			$scope.geantwoord = true;
			$scope.message = "Je antwoord is opgeslagen.";
			$scope.error = '';
		} else {
			$scope.message = '';
			$scope.error = "Je hebt al een antwoord gegeven.";
		}
	}
	$scope.checkAntwoord = function (id) {
		for (var index = 0; index < document.getElementsByTagName('input').length; ++index) {
			document.getElementsByTagName('input')[index].checked = false;
		}
		$scope.antwoord = id;
		document.getElementById('antwoord'+id).checked = true;
	}

	socket.on('updateScore', function(score){
		nieuweScore = score;
		$scope.$digest();
	});

	socket.on('vraag', function(vraag){
		if($scope.speler.naam) {
			$scope.message = "Er is een nieuwe vraag!";
			$scope.error = '';
			$scope.vraag = vraag;
			$scope.speler.score = nieuweScore;
			$scope.view = 'quiz';
			$scope.geantwoord = false;
		} else {
			$scope.view = '';
			$scope.message = "";
			$scope.error = "Er is een quiz actief en je bent te laat met aanmelden :(..";
		}
		$scope.$digest();
	});

	socket.on('secondeVoorbij', function(tijd) {
		$scope.timeLeft = tijd;
		if ($scope.timeLeft < 1) {
			$scope.message = '';
			$scope.error = '';
			$scope.stand = 'Tussenstand';
			$scope.view = 'stand';
		}
		$scope.$digest();
	});

	socket.on('message', function(data){
		if (data.spelen) {
			$scope.view = 'speelMee';
		} else {
			$scope.view = '';
		}
		$scope.message = data.message;
		$scope.error = data.error;
		$scope.$digest();
	});

	socket.on('veranderingSpelers', function(spelers) {
		$scope.spelers = spelers;
		$scope.$digest();
	});

	socket.on('eindeQuiz', function (spelers) {
		if ($scope.speler.naam) {
			$scope.message = '';
			$scope.error = '';
			$scope.spelers = spelers;
			$scope.stand = 'Eindstand';
			$scope.view = 'stand';
			$scope.speler.score = nieuweScore;
			$scope.$digest();
		}
	});

	socket.on('quizOnderbroken', function (message) {
		$scope.message = '';
		$scope.error = message;
		$scope.view = '';
		$scope.$digest();
	});

	socket.on('spelerVerlaatQuiz', function (spelerNaam) {
		console.log(spelerNaam + ' heeft de quiz verlaten.');
	});

	socket.on('quizActief', function (message) {
		$scope.message = message;
		$scope.error = '';
		$scope.view = 'speelMee';
		$scope.$digest();
	});

	socket.on('geenVraagActief', function(error) {
		$scope.error = error;
		$scope.message = '';
		$scope.$digest();
	});
};
