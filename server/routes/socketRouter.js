var socketControllers = require('../controllers/socketControllers.js');
var spelers = [];

module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		if (!socketControllers.getQuizActief()) {
			socket.emit('message', {
				error : 'Er is geen quiz actief',
				spelen : false
			});
		} else {
			socket.emit('message', {
				message : 'Er is een quiz actief.. Speel mee!',
				spelen : true
			});
		}

		//Docentgedeelte
		socket.on('startQuiz', function (data) {
			socketControllers.startQuiz(data);
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
			var newSpeler = {
				naam : speler.naam,
				score : 0,
				id : spelers.length
			}
			socket.speler = {};
			socket.speler = newSpeler;
			spelers[newSpeler.id] = newSpeler;
			io.emit('nieuweSpeler', speler);
		});

		socket.on('antwoord', function (antwoord) {
			if (socketControllers.verwerkAntwoord(antwoord)) {
				socket.speler.score += 1;
			}
			spelers[socket.speler.id] = socket.speler;
			socket.emit('updateScore', socket.speler.score);
			io.emit('vraagAntwoorden', socketControllers.getVraag());
		});
	});
}
