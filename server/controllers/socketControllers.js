var quiz = new(require('../models/quiz.js'));

var exports = module.exports = {};

exports.getQuizActief = function () {
	return quiz.getQuizActief();
};

exports.startVraag = function () {
	return quiz.startVraag();
};

exports.getQuizActief = function () {
	return quiz.getQuizActief();
};

exports.volgendeVraag = function () {
	return quiz.volgendeVraag();
};

exports.startQuiz = function () {
	quiz.startQuiz();
};

exports.startVragen = function () {
	quiz.startVragen();
};

exports.eindeQuiz = function () {
	quiz.eindeQuiz();
};