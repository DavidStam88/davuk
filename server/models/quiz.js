var vraag = require('../models/vraag.js');

// Hier moeten nog een hoop dingen ingevuld worden en het spelermodel aan toegevoegd worden.
var quiz = function () {
	this.quizActief = false;
	this.vraagActief = false;
	this.vragen = [];
	this.vraag = {};
	this.vraagNummer = 0;
	this.spelers = [];
	this.lesNummer = 1;

	this.setVraag = function () {
		if (this.vragen.length > 0) {
			this.vraag = this.vragen[this.vraagNummer];
			this.vraag.aantalA = 0;
			this.vraag.aantalB = 0;
			this.vraag.aantalC = 0;
			this.vraag.aantalD = 0;
		}
	}

	this.setVragen = function () {
		vraag.getVragenLesQuiz(this.lesNummer, function (data, quiz) {
			quiz.vragen = data;
        	quiz.setVraag();
		}, this);
	};
	this.startVraag = function () {
		this.vraagActief = true;
		return this.vraag;
	}

	this.volgendeVraag = function () {
		if (this.vraagActief = false) {
			if (this.vragen.length > this.vraagNummer) {
				this.vraagNummer += 1;
				this.setVraag();
				return this.vraag();
			} else {
				this.eindeQuiz();
				return;
			}
		} else {
			return this.vraag;
		}
	}

	this.startVragen = function () {
		this.vraagActief = true;
	}

	this.startQuiz = function () {
		this.quizActief = true;
	}

	this.eindeQuiz = function () {
		console.log("einde quiz.");
	}

	this.getTussenstand = function () {

	}

	this.getQuizActief = function () {
		return this.quizActief;
	}

	this.setVragen();
}

module.exports = quiz;