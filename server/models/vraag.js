var mongoose = require('mongoose');
mongoose.connect("localhost/davukQuiz");
var VraagSchema = mongoose.Schema({
    vraag : {type : String, required : true},
    lesNummer : {type : Number, required : true},
    opties : {
        A : {type : String, required : true},
        B : {type : String, required : true},
        C : {type : String, required : true},
        D : {type : String, required : true}
    },
    antwoord : {type : String, required : true},
    datum : { type: Date, default : Date.now }
}, {collection : "vragen"});

var Vraag = mongoose.model('Vraag', VraagSchema);
var exports = module.exports = {};

var response = function (message, data) {
    return {
        message : message,
        data : data
    }
}
exports.getLessen = function (id, callback) {
    'use strict';
    Vraag.find({lesNummer : id}, function (err, vragen) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de vragen is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de vragen is gelukt.", vragen));
        }
    });
}
exports.getVragenLes = function (id, callback) {
    'use strict';
    Vraag.find({lesNummer : id}, function (err, vragen) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de vragen is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de vragen is gelukt.", vragen));
        }
    });
}
exports.getVragen = function (callback) {
    'use strict';
    Vraag.find(function (err, vragen) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar vragen is mislukt.", {}));
            return;
        } else {
            callback(response("het zoeken naar vragen is gelukt.", vragen));
        }
    });
}
exports.getVraag = function (id, callback) {
    'use strict';
    Vraag.findOne({_id : id}, function (err, vraag) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de vraag is mislukt.", {}));
            return;
        }
        callback(response("het zoeken naar de vraag is gelukt.", vraag));
    });
}

exports.postVraag = function (vraag, callback) {
    'use strict';
    var newVraag = new Vraag();
    newVraag.vraag = vraag.vraag;
    newVraag.lesNummer = vraag.lesNummer;
    newVraag.opties = vraag.opties;
    newVraag.antwoord = vraag.antwoord;
    
    newVraag.save(function (err, vraag) {
        if (err) {
            console.log(err);
            callback(response("Het opslaan van de vraag is mislukt.", err));
        } else {
            callback(response("Het opslaan van de vraag is gelukt.", vraag));
        }
    });
}
exports.deleteVraag = function (id, callback) {
    console.log("Ik ga dus verwijderen he..");
    Vraag.remove({_id : id}).exec(function (err) {
        if (err) {
            callback(response("Het verwijderen van de vraag is mislukt.", {}));
        } else {
            callback(response("Het verwijderen van de vraag is gelukt.", {}));
        }
    });
}
exports.putVraag = function (vraag, callback) {
    'use strict';
    var slaVraagOp = function (putVraag) {
        putVraag.save(function (err, putVraag) {
            if (err) {
                callback(response("Er is iets misgegaan tijdens het opslaan van de gegevens.", {}));
            } else {
                callback(response("De vraag is succesvol geupdate.", putVraag));
            }
        });
    },
    updateVraag = function (putVraag) {
        putVraag.vraag = vraag.vraag;
        putVraag.opties = vraag.opties;
        putVraag.antwoord = vraag.antwoord;
        putVraag.lesNummer = vraag.lesNummer;
        slaVraagOp(putVraag);
    },
    getVraagVoorUpdate = function () {
        console.log(vraag._id);
        Vraag.findOne({ _id : vraag._id }, function (err, putVraag) {
            if (err) {
                res.send(response("Er is geen vraag voor een update gevonden.", {}));
            } else {
                console.log(putVraag);
                updateVraag(putVraag);
            }
        });
    }
    getVraagVoorUpdate();
}

// Deze functie moest helaas apart (i.p.v. de bestaande getVragenLes-methode te gebruiken).. 
// Vrij lelijk maar deze krijgt een instantie van de quiz zelf mee.. Anders werkt het niet.
// Het kan vast wel anders maar ik weet nog ff niet hoe..
exports.getVragenLesQuiz = function (lesId, callback, quiz) {
    'use strict';
    Vraag.find({lesNummer : lesId}, function (err, vragen) {
        if (err) {
            console.log(err);
            callback(err, quiz);
        } else {
            callback(vragen, quiz);
        }
    });
}