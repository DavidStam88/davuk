var q = require('../models/quiz.js');
var quiz;

var exports = module.exports = {};

exports.startQuiz = function (data) {
	quiz = new q(data.titel, data.lesNummer);
};

exports.getQuizActief = function () {
	if (quiz) {
		if (quiz.quizActief) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
};

exports.addSpeler = function (speler) {
	return quiz.addSpeler(speler.naam);
}

exports.getSpelers = function () {
	return quiz.getSpelers();
}

exports.verwerkAntwoord = function (antwoord) {
	quiz.verwerkAntwoord(antwoord);
	if (antwoord === quiz.getVraag().antwoord) {
		return true;
	} else {
		return false;
	}
}

exports.getVraag = function () {
	return quiz.getVraag();
};

exports.sluitKamerEnStartQuiz = function () {
	quiz.sluitKamer();
};

exports.startVraag = function () {
	return quiz.startVraag();
};

exports.volgendeVraag = function () {
	quiz.volgendeVraag();
};

exports.startVragen = function () {
	quiz.startVragen();
};

exports.eindeQuiz = function () {
	quiz.eindeQuiz();
};