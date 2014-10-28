var speler = function (naam) {
	this.score = 0;
	this.naam = naam;

	var verwerkAntwoord = function (gegevenAntwoord, juisteAntwoord) {
		if (gegevenAntwoord === juisteAntwoord) {
			this.score += 1;
		}
	}
}

module.exports = speler;