"use strict";
var davukApp = angular.module("davukApp", ["ngResource"]);

davukApp.factory('socket', function() {
	var socket = io.connect('http://localhost:3000');
	return socket;
});

davukApp.service('dbService', function dbService($resource) {
    "use strict";
    var actions = {
            "get": {method: "GET"},
            "post": {method: "POST"},
            "update": {method: "PUT"},
            "query": {method: "GET", isArray: true},
            "delete": {method: "DELETE"}
        },
        db = {};
    db.gaVerder = $resource("/docent/gaVerder", {}, actions);
    db.sessie = $resource("/docent/sessie", {}, actions);
    db.vraag = $resource("/docent/vraag/:id", {}, actions);
    db.vragen = $resource("/docent/vragen/:id", {}, actions);
    return db;
});

davukApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/docent', {
		templateUrl: '../views/docent.html',
		controller: sessieController
	});
	$routeProvider.when('/docent/vraag', {
		templateUrl: '../views/docent_vraag.html',
		controller: docentController
	});
	$routeProvider.when('/docent/lessen', {
		templateUrl: '../views/docent_lessen.html',
		controller: docentController
	});
	$routeProvider.when('/docent/vragen/:les', {
		templateUrl: '../views/docent_vragen.html',
		controller: docentController
	});
	$routeProvider.when('/docent/vraag/:id', {
		templateUrl: '../views/docent_vraag.html',
		controller: docentController
	});
	$routeProvider.when('/docent/quiz/:id', {
		templateUrl: '../views/docent_quiz.html',
		controller: docentQuizController
	});
	$routeProvider.when('/quiz', {
		templateUrl: '../views/quiz.html',
		controller: quizController
	});
	$routeProvider.otherwise({
		redirectTo: "/docent"
	});
}]);