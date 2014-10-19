/**
	niet werkende,
	is van cria
*/

module.exports = function (app) {
	/*
    var mongoose = require('mongoose')
        , User = mongoose.model('User');
	*/

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login')
    }

    // Routes
    app.get('/account', ensureAuthenticated, function (req, res) {
        var retObj = {
            isVerified: true,
            user: req.user,
            meta: {
                action: "account",
                timestamp: new Date()
            }
        };
        return res.send(retObj);


        res.render('account', { user: req.user });
    });

    app.get('/login', function (req, res) {
        var retObj = {
            isVerified: false,
            meta: {
                action: "login",
                description: "Access is not allowed. Please login",
                timestamp: new Date()
            }
        };
        return res.send(retObj);

        //res.render('login', { user: req.user, message: req.flash('error') });
    });

    app.get("/myLogin", function (req, res) {
        var isVerified;
        isVerified = false;
        if (req.user && req.user !== null) {
            isVerified = true;
        }

        //
        var retObj = {
            meta: {action: "get myLogin",
                timestamp: new Date()
            },
            isVerified: isVerified
        };
        return res.send(retObj);
    });

    app.post('/myLogin',
        function (req, res) {
            console.log('app.post(\'/myLogin\'');

            var retObj = {
                meta: {action: "post myLogin",
                    timestamp: new Date()
                },
                isVerified: true
            };
            return res.send(retObj);
        });

    app.get('/logout', function (req, res) {
        req.logout();
        var retObj = {
            isVerified: false,
            meta: {
                description: "You have successfully logged out.",
                timestamp: new Date()
            }
        };
        return res.send(retObj);

//        res.redirect('/');
    });

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    // Attach the method to app, so that we have it available when we need it.
    app.ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login')
    }


}