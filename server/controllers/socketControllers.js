var q = require('../models/quiz.js');
var socketControllers = require('../controllers/socketControllers.js');
var quiz = false;
var spelers = [];

var verwijderSpeler = function(spelerId) {
	var i;
	for (i = 0; i < spelers.length; i += 1) {
		if (spelers[i].id === spelerId) {
    		spelers.splice(i, 1);
		}
	}
}

var response = function(message, error, data) {
	return {
		message : message,
		error : error,
		data : data
	};
}

module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		if (!quiz) {
			socket.emit('message', response('', 'Er is geen quiz actief.', false));
		} else if (quiz && quiz.getQuizActief()) {
			socket.emit('message', response('', 'Er is een quiz bezig en de kamer is gesloten! Probeer het later nog eens.', false));
		} 
		else {
			socket.emit('message', response('Er is een quiz actief.. Speel mee!', "", true));
		}

		socket.on('startQuiz', function (data) {
			socket.docent = {};
			socket.docent = {
				id : 'docent'
			}
			quiz = new q(data.titel, data.lesNummer);
			io.emit('quizActief', response('Er is een quiz actief. Speel mee!', "", {}));
		});
		socket.on('sluitKamerEnStart', function () {
			quiz.sluitKamer();
			io.emit('vraag', response("Er is een nieuwe vraag!", "", quiz.getVraag()));

			quiz.telAf();
			quiz.on('secondeVoorbij', function(tijd) {
				io.emit('secondeVoorbij', response("", "", tijd));
			});

		});
		socket.on('volgendeVraag', function () {
			quiz.volgendeVraag();
			if (!quiz.getVraag()) {
				io.emit('eindeQuiz', response("", "De quiz is afgelopen.", spelers));
			} else {
				io.emit('vraag', response("Er is een nieuwe vraag!", "", quiz.getVraag()));
				
				quiz.telAf();
				quiz.on('secondeVoorbij', function(tijd) {
					io.emit('secondeVoorbij', response("", "", tijd));
				});
			}
		});
		socket.on('eindigQuiz', function () {
      		spelers = [];
      		quiz = false;
      		io.emit('quizOnderbroken', response("", 'De docent heeft de quiz beëindigd!', {}));
		});

		socket.on('addSpeler', function (speler) {
			socket.speler = {};
			var newSpeler = {
				naam : speler.naam,
				score : 0,
				id : spelers.length
			}
			socket.speler = newSpeler;
			spelers[newSpeler.id] = newSpeler;
			io.emit('veranderingSpelers', response(socket.speler.naam + " heeft zich aangemeld.", "", spelers));
		});

		socket.on('antwoord', function (antwoord) {
			if (quiz.getVraagActief()) {
				if (quiz.verwerkAntwoord(antwoord)) {
					socket.speler.score += 1;
				}
				var i;
				for (i = 0; i < spelers.length; i += 1) {
					if (spelers[i].id === socket.speler.id) {
    					spelers[i] = socket.speler;
					}
				}
				socket.emit('updateScore', response("", "", socket.speler.score));
				io.emit('vraagAntwoorden', response("Er is een nieuwe vraag!", "", quiz.getVraag()));
				io.emit('veranderingSpelers', response("Er is een verandering in spelers aangetroffen.", "", spelers));
			}
		});

		socket.on('disconnect', function() {
			var naam;
      		if (socket.docent) {
      			spelers = [];
      			quiz = false;
      			console.log('De docent heeft er geen zin meer in!');
      			io.emit('quizOnderbroken', response("", 'De docent heeft er geen zin meer in!', {}));
      		} else if (socket.speler) {
      			io.emit('spelerVerlaatQuiz', response(socket.speler.naam + " heeft de quiz verlaten.", "", spelers));
      			naam = socket.speler.naam;
      			verwijderSpeler(socket.speler.id);
      			socket.speler = false;
      			io.emit('veranderingSpelers', response("", "", spelers));
      		}
   		});
	});
}
