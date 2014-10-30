var quizController = function ($scope, socket) {
	$scope.vraag = {};
	$scope.timer = 30;
	$scope.timeLeft = $scope.timer;
	$scope.message = '';
	$scope.error = '';
	$scope.spelers = [];
	$scope.view = '';
	$scope.antwoord = '';
	var geantwoord = false;
	var nieuweScore = 0;
	$scope.speler = {};
	$scope.speler.naam = '';

	$scope.addSpeler = function (speler) {
		socket.emit('addSpeler', speler);
		$scope.speler.naam = speler.naam;
		$scope.message = 'Aangemeld, de quiz begint bijna..';
		$scope.error = '';
		$scope.view = 'spelersKamer';
	}

	$scope.geefAntwoord = function (antwoord) {
		if (!geantwoord) {
			socket.emit('antwoord', antwoord);
			geantwoord = true;
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
	});

	socket.on('vraag', function(vraag){
		$scope.message = "Er is een nieuwe vraag!";
		$scope.error = '';
		$scope.vraag = vraag;
		$scope.speler.score = nieuweScore;
		$scope.view = 'quiz';
		geantwoord = false;

		$scope.timeLeft = $scope.timer;
	  var myTimer = setInterval( function(){$scope.timeLeft--; console.log('intervalletje' + $scope.timeLeft); $scope.$digest();} , 1000 ); // reduce time each seconds
	  setTimeout( function(){clearInterval(myTimer);}, ($scope.timer+0.9)*1000);

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
