var util         = require("util");
var EventEmitter = require("events").EventEmitter;
var vraag = require('../models/vraag.js');

var quiz = function (titel, lesNummer) {
	var vraagActief = false;
	var secondePerVraag = 30;
	var timer;

	this.titel = titel;
	this.lesNummer = lesNummer;
	this.quizActief = false;
	this.eindeVanQuiz = true;
	this.vragen = [];
	this.vraag = {};
	this.vraagNummer = 0;
	EventEmitter.call(this);

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
		if (!vraagActief) {
			if ((this.vragen.length - 1) > this.vraagNummer) {
				this.vraagNummer += 1;
				this.setVraag();
			} else {
				this.eindeQuiz();
			}
		}
	}
	this.eindeQuiz = function () {
		this.eindeVanQuiz = false;
	}
	this.sluitKamer = function () {
		this.quizActief = true;
	}
	
	this.telAf = function () {
		vraagActief = true;
		var self = this;
		var tijd = secondePerVraag;
		var alertTijd = function () {
			if (tijd - 1 < 1) {
				clearInterval(timer);
				tijd = 0;
				vraagActief = false;
			} else {
				tijd -= 1;
			}
			self.emit('secondeVoorbij', tijd);
		}
		timer = setInterval(function () {
			alertTijd();
		}, 1000);
	}

	this.getVraag = function () {
		if (this.eindeVanQuiz) {
			return this.vraag;
		} else {
			return this.eindeVanQuiz;
		}
	}
	this.getVraagActief = function () {
		return vraagActief;
	}
	this.getQuizActief = function () {
		return this.quizActief;
	}
	this.setVragen();

	this.verwerkAntwoord = function (antwoord) {
		if (!vraagActief) {
			if (antwoord === 'A') {
				this.vraag.antwoorden.A += 1;
			} else if (antwoord === 'B') {
				this.vraag.antwoorden.B += 1;
			} else if (antwoord === 'C') {
				this.vraag.antwoorden.C += 1;
			} else if (antwoord === 'D') {
				this.vraag.antwoorden.D += 1;
			}

			if (antwoord.toString().trim() === this.vraag.antwoord.toString().trim()) {
				return true;
			} else {
				return false;
			}
		}
	}
}

util.inherits(quiz, EventEmitter);

module.exports = quiz;