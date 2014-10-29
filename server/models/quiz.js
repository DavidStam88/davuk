var vraag = require('../models/vraag.js');
var Speler = require('../models/speler.js');

// Hier moeten nog een hoop dingen ingevuld worden en het spelermodel aan toegevoegd worden.
var quiz = function (titel, lesNummer) {
	this.titel = titel;
	this.lesNummer = lesNummer;
	this.quizActief = false;
	this.vraagActief = false;
	this.eindeVanQuiz = true;
	this.vragen = [];
	this.vraag = {};
	this.vraagNummer = 0;

	//Quizgedeelte
	this.setVraag = function () {
		if (this.vragen.length > 0) {
			this.vraag.vraag = this.vragen[this.vraagNummer].vraag;
			this.vraag.antwoord = this.vragen[this.vraagNummer].antwoord;
			this.vraag.lesNummer = this.vragen[this.vraagNummer].lesNummer;
			this.vraag.opties = this.vragen[this.vraagNummer].opties;
			this.vraag.antwoorden = {};
			this.vraag.antwoorden.A = 0;
			this.vraag.antwoorden.B = 0;
			this.vraag.antwoorden.C = 0;
			this.vraag.antwoorden.D = 0;
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
		if ((this.vragen.length - 1) > this.vraagNummer) {
			this.vraagNummer += 1;
			this.setVraag();
		} else {
			this.eindeQuiz();
		}
	}
	this.eindeQuiz = function () {
		console.log("einde quiz.");
		this.eindeVanQuiz = false;
	}
	this.sluitKamer = function () {
		quizActief = true;
	}
	this.getVraag = function () {
		if (this.eindeVanQuiz) {
			return this.vraag;
		} else {
			return this.eindeVanQuiz;
		}
	}
	this.setVragen();

	//Spelergedeelte
	this.verwerkAntwoord = function (antwoord) {
		if (antwoord === 'A') {
			this.vraag.antwoorden.A += 1;
		} else if (antwoord === 'B') {
			this.vraag.antwoorden.B += 1;
		} else if (antwoord === 'C') {
			this.vraag.antwoorden.C += 1;
		} else if (antwoord === 'D') {
			this.vraag.antwoorden.D += 1;
		}
	}
}

module.exports = quiz;