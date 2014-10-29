var speler = function (naam, id) {
	this.score = 0;
	this.naam = naam;
	this.id = id;

	this.verwerkAntwoord = function (gegevenAntwoord, juisteAntwoord) {
		if (gegevenAntwoord === juisteAntwoord) {
			this.score += 1;
		}
	}
}

module.exports = speler;