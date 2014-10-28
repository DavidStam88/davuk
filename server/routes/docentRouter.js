// De controllers bevatten de functies voor de docent.
var docentControllers = require('../controllers/docentControllers.js');

// Deze functie controleerd of de docent wel ingelogd is, anders wordt hij ge-redirect.
function checkOpSessie (req, res, next) {
	if (req.session.userName) {
		next();
	} else {
		res.send({
			ingelogd : false
		});
	}
}

// Deze functie wordt gebruikt door Angular. Ook het front-end controleerd of de docent ingelogd is.
function sessie (req, res) {
	if (req.session.userName) {
		res.send({
			ingelogd : true
		});
	} else {
		res.send({
			ingelogd : false
		});
	}
}

// De routes die worden gebruikt door docent ('/docent').
module.exports = function (express) {
	var docentRouter = express.Router();
	docentRouter.post('/gaVerder', docentControllers.gaVerder);
	docentRouter.post('/vraag', checkOpSessie, docentControllers.postVraag);
	docentRouter.get('/vragen', checkOpSessie, docentControllers.getVragen);
	docentRouter.get('/vragen/:id', checkOpSessie, docentControllers.getVragenLes);
	docentRouter.get('/vraag/:id', checkOpSessie, docentControllers.getVraag);
	docentRouter.delete('/vraag/:id', checkOpSessie, docentControllers.deleteVraag);
	docentRouter.put('/vraag/:id', checkOpSessie, docentControllers.putVraag);
	docentRouter.get('/sessie', sessie);
	docentRouter.get('/eindigSessie', docentControllers.eindigSessie);

	return docentRouter;
}