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

	socket.on('updateScore', function(res){
		nieuweScore = res.data;
		$scope.$digest();
	});

	socket.on('vraag', function(res){
		if($scope.speler.naam) {
			$scope.message = res.message;
			$scope.error = res.error;
			$scope.vraag = res.data;
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

	socket.on('secondeVoorbij', function(res) {
		if($scope.speler.naam) {
			$scope.timeLeft = res.data;
			if ($scope.timeLeft < 1) {
				$scope.message = '';
				$scope.error = '';
				$scope.stand = 'Tussenstand';
				$scope.view = 'stand';
			}
			$scope.$digest();
		}
	});

	socket.on('message', function(res){
		if (res.data) {
			$scope.view = 'speelMee';
		} else {
			$scope.view = '';
		}
		$scope.message = res.message;
		$scope.error = res.error;
		$scope.$digest();
	});

	socket.on('veranderingSpelers', function(res) {
		$scope.spelers = res.data;
		$scope.$digest();
	});

	socket.on('eindeQuiz', function (res) {
		if ($scope.speler.naam) {
			$scope.message = res.message;
			$scope.error = res.error;
			$scope.spelers = res.data;
			$scope.stand = 'Eindstand';
			$scope.view = 'stand';
			$scope.speler.score = nieuweScore;
			$scope.$digest();
		}
	});

	socket.on('quizOnderbroken', function (res) {
		$scope.message = res.message;
		$scope.error = res.error;
		$scope.view = '';
		$scope.$digest();
	});

	socket.on('spelerVerlaatQuiz', function (res) {
		console.log(res.message);
	});

	socket.on('quizActief', function (res) {
		$scope.message = res.message;
		$scope.error = res.error;
		$scope.view = 'speelMee';
		$scope.$digest();
	});

	socket.on('geenVraagActief', function(res) {
		$scope.error = res.error;
		$scope.message = res.message;
		$scope.$digest();
	});
};
