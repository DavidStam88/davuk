var vraag = require('../models/vraag.js');

// Het wachtwoord voor de docenten komt niet uit een database omdat het wachtwoord:
// A. Alleen de docenten van de leerlingen hoeft te scheiden.
// B. Er geen mega-kwetsbaar materiaal door beschermd hoeft te worden (Daarom hoeft het ook niet te worden gesalt).
// C. Het veel handiger is als dit wachtwoord voor iedere docent hetzelfde is.
var wachtwoord = "d0centje";
var exports = module.exports = {};

exports.gaVerder = function (req, res) {
	if(req.body.wachtwoord === wachtwoord) {
  		req.session.userName = req.body.naam;
		res.send({
			ingelogd : true,
			message : "Welkom!"
		});
	} else {
		res.send({
			ingelogd : false,
			message : "Het gegeven wachtwoord is onjuist of de gegeven username is leeg."
		});
	}
};

exports.eindigSessie = function (req, res) {
	if(req.session.userName) {
  		req.session.destroy();
		res.redirect("/#/docent");
	} else {
		res.redirect("/#/docent");
	}
};

exports.postVraag = function (req, res) {
	vraag.postVraag(req.body, function(data) {
		res.send(data);
	});
};

exports.putVraag = function (req, res) {
	vraag.putVraag(req.body, function(data) {
		res.send(data);
	});
};

exports.getVragen = function (req, res) {
	vraag.getVragen(function(data) {
		res.send(data);
	});
};

exports.getVraag = function (req, res) {
	vraag.getVraag(req.params.id, function(data) {
		res.send(data);
	});
};

exports.getVragenLes = function (req, res) {
	vraag.getVragenLes(req.params.id, function(data) {
		res.send(data);
	});
};

exports.deleteVraag = function (req, res) {
	vraag.deleteVraag(req.params.id, function(data) {
		res.send(data);
	});
};