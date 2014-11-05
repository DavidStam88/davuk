var socketControllers = require('../controllers/socketControllers.js');
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
		if (!socketControllers.getQuiz()) {
			socket.emit('message', {
				error : 'Er is geen quiz actief',
				spelen : false
			});
		} else if (socketControllers.getQuiz() && socketControllers.getQuizActief()) {
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
			socketControllers.startQuiz(data);
			io.emit('quizActief', 'Er is een quiz actief. Speel mee!');
		});
		socket.on('sluitKamerEnStart', function () {
			socketControllers.sluitKamerEnStartQuiz();
			var vraag = socketControllers.getVraag();
			io.emit('vraag', socketControllers.getVraag());
		});
		socket.on('volgendeVraag', function () {
			socketControllers.volgendeVraag();
			if (!socketControllers.getVraag()) {
				io.emit('eindeQuiz', spelers);
			} else {
				io.emit('vraag', socketControllers.getVraag());
			}
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
			console.log(antwoord);
			if (socketControllers.verwerkAntwoord(antwoord)) {
				socket.speler.score += 1;
				console.log(antwoord);
			}
			var i;
			for (i = 0; i < spelers.length; i += 1) {
				if (spelers[i].id === socket.speler.id) {
    				spelers[i] = socket.speler;
				}
			}
			socket.emit('updateScore', socket.speler.score);
			io.emit('vraagAntwoorden', socketControllers.getVraag());
			io.emit('veranderingSpelers', spelers);
		});

		//Beide
		socket.on('disconnect', function() {
			console.log("Iemand verlaat het spel.");
      		if (socket.docent) {
      			spelers = [];
      			socketControllers.ontmantelQuiz();
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
