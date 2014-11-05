var q = require('../models/quiz.js');
var socketControllers = require('../controllers/socketControllers.js');
var quiz = false;
var spelers = [];

var verwijderSpeler = function (spelerId) {
	var i;
	for (i = 0; i < spelers.length; i += 1) {
		if (spelers[i].id === spelerId) {
    		spelers.splice(i, 1);
		}
	}
}

module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		if (!quiz) {
			socket.emit('message', {
				error : 'Er is geen quiz actief',
				spelen : false
			});
		} else if (quiz && quiz.getQuizActief()) {
			socket.emit('message', {
				error : 'Er is een quiz bezig en de kamer is gesloten! Probeer het later nog eens.',
				spelen : false
			});
		} 
		else {
			socket.emit('message', {
				message : 'Er is een quiz actief.. Speel mee!',
				spelen : true
			});
		}

		//Docentgedeelte
		socket.on('startQuiz', function (data) {
			socket.docent = {};
			socket.docent = {
				id : 'docent'
			}
			quiz = new q(data.titel, data.lesNummer);
			io.emit('quizActief', 'Er is een quiz actief. Speel mee!');
		});
		socket.on('sluitKamerEnStart', function () {
			quiz.sluitKamer();
			io.emit('vraag', quiz.getVraag());

			quiz.telAf();
			quiz.on('secondeVoorbij', function(tijd) {
				io.emit('secondeVoorbij', tijd);
			});

		});
		socket.on('volgendeVraag', function () {
			quiz.volgendeVraag();
			if (!quiz.getVraag()) {
				io.emit('eindeQuiz', spelers);
			} else {
				io.emit('vraag', quiz.getVraag());
				
				quiz.telAf();
				quiz.on('secondeVoorbij', function(tijd) {
					io.emit('secondeVoorbij', tijd);
				});
			}
		});
		socket.on('eindigQuiz', function () {
      		spelers = [];
      		quiz = false;
      		io.emit('quizOnderbroken', 'De docent heeft de quiz beëindigd!');
		});

		//Leerlinggedeelte
		socket.on('addSpeler', function (speler) {
			socket.speler = {};
			var newSpeler = {
				naam : speler.naam,
				score : 0,
				id : spelers.length
			}
			socket.speler = newSpeler;
			spelers[newSpeler.id] = newSpeler;
			io.emit('veranderingSpelers', spelers);
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
				socket.emit('updateScore', socket.speler.score);
				io.emit('vraagAntwoorden', quiz.getVraag());
				io.emit('veranderingSpelers', spelers);
			}
		});

		//Beide
		socket.on('disconnect', function() {
      		if (socket.docent) {
      			spelers = [];
      			quiz = false;
      			console.log('De docent heeft er geen zin meer in!');
      			io.emit('quizOnderbroken', 'De docent heeft er geen zin meer in!');
      		} else if (socket.speler) {
      			io.emit('spelerVerlaatQuiz', socket.speler.naam);
      			verwijderSpeler(socket.speler.id);
      			socket.speler = false;
      			io.emit('veranderingSpelers', spelers);
      		}
   		});
	});
}
