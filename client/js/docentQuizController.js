var docentQuizController = function ($scope, $routeParams, $location, $window, dbService) {
	var socket = {};
	dbService.sessie.get({}, function (res) {
		if (!res.ingelogd) {
			$window.location = '/#/docent';
		} else {
			socket = io.connect('http://localhost:3000');

			var data = {
				titel : "Quiz voor les " + $routeParams.id,
				lesNummer : $routeParams.id
			};
			socket.emit('startQuiz', data);

			$scope.volgendeVraagButton = false;
			$scope.view = 'spelersKamer';
			$scope.vraag = {};
			$scope.spelers = [];
			$scope.lesNummer = $routeParams.id;
			$scope.stand = 'Tussenstand';
			$scope.timer = 30;
			$scope.timeLeft = $scope.timer;

			$scope.startQuiz = function () {
				socket.emit('sluitKamerEnStart', {});
				$scope.view = 'vraag';
			}

			$scope.volgendeVraag = function () {
				socket.emit('volgendeVraag', {});
			}

			$scope.eindigQuiz = function() {
				socket.emit('eindigQuiz', {});
				$window.location = '/#/docent/lessen';
			}
			$scope.vraagKleur = function(optie){
				if(optie == $scope.vraag.antwoord.trim()){
					return 'progress-bar-success';
				}
			}

			socket.on('veranderingSpelers', function(spelers) {
				$scope.spelers = spelers;
				$scope.$digest();
			});

			socket.on('vraag', function(vraag){
				$scope.volgendeVraagButton = false;
				$scope.vraag = vraag;
				$scope.$digest();
			});

			socket.on('vraagAntwoorden', function(vraag){
				$scope.vraag = vraag;
				$scope.$digest();
			});

			socket.on('eindeQuiz', function (spelers) {
				$scope.spelers = spelers;
				$scope.stand = 'Eindstand';
				$scope.view = 'stand';
				$scope.$digest();
			});

			socket.on('secondeVoorbij', function(tijd) {
				$scope.timeLeft = tijd;
				if ($scope.timeLeft < 1) {
					$scope.message = '';
					$scope.volgendeVraagButton = true;
				}
				$scope.$digest();
			});

		}
	});

};
