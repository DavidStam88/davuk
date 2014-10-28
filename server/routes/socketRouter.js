var socketControllers = require('../controllers/socketControllers.js');

module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		if (!socketControllers.getQuizActief()) {
			socket.emit('message', 'Er is geen quiz actief');
		} else {
			socket.emit('message', 'Welkom');
		}

		socket.on('startQuiz', function () {
			socketControllers.startQuiz();
		});

		socket.on('getVraag', function () {
			var vraag = socketControllers.startVraag();
			io.sockets.emit('vraag', vraag);
		});
	});
}