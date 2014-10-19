/**
 * Author: Luuk van de Scheur, David Stam
 * Date: 19-10-2014
 *
 * jslint browser: false
 * jslint devel: true
 * jslint node: true
 */
/*global window, document, location*/

var app = angular.module("davukApp",["ngRoute"]);

app.config( function($routeProvider) {
      $routeProvider.
          when('/login', {
              templateUrl: '/templates/loginForm.html',
              controller: 'loginFormController'
          }).
		  when('/adminPanel', {
              templateUrl: '/templates/adminPanel.html',
              controller: 'adminPanelController'
          }).
		  when('/game/:name', {
			  templateUrl: '/templates/game.html',
              controller: 'gameController'
          }).
          otherwise({
              redirectTo: '/login'
          });
});

// I don't know what this does but its necessary:
app.factory('socketIO', function ($rootScope) {
  var socket = io();
  socket.on("connect", function() {
     console.log("connected", socket.io.engine.id);
  })
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
   },
    id: function() {
      return socket.io.engine.id
   }
  };
});

// LOGIN FORM FOR ALL USERS
app.controller("loginFormController", function($scope, $routeParams, socketIO, $location) {
   $scope.userName = "";
   $scope.error = false;
   
   // submit user to the server and redirect to the correct page (admin/player)
   $scope.submitUserName = function() {
	   socketIO.emit("sign in", { name: $scope.userName} )
	   socketIO.on("sign in reply", function(reply) {
		if(reply.error) {
			$scope.message = reply.message;
			$scope.error = reply.error;
			
		} else {
			if(reply.admin) { $location.path("/adminPanel"); } // = admin
			else { $location.path("/game/" + reply.player.name); } // = player
		}
		
	   });
   }
});

// THIS IS A ADMIN LOGGED IN:
app.controller("adminPanelController", function($scope, $location, socketIO) {
   $scope.playerList = [];
   $scope.admin = null;
   $scope.error = false;
   $scope.maxConnected = 30; // max users connected (server allows more @TODO)
   $scope.selectedList = [];
   $scope.questionList = [
   {id: 1, question: 'Hoe oud ben jij?'},
   {id: 2, question: 'Wat is David zijn achternaam?'},
   {id: 3, question: 'Had je een grote bek?'},
   {id: 4, question: 'Wat is een ginger?'},
   {id: 5, question: 'Is het antwoord A, B of C?'},
   {id: 6, question: 'Hoe lang is een chinees?'}
   ]; // this should be taken out of the database.

   // submit the selected questions to the players (game is starting!)
   $scope.submitQuestions = function() {
		var inputs = document.getElementsByTagName('input');
		for (var i = 0; i < inputs.length; i++) {
			if(inputs[i].checked) {
				$scope.selectedList.push($scope.questionList[i]);
			}
		}
		if($scope.selectedList[0]){
			socketIO.emit('listUpload', $scope.selectedList); // this is starting the game
		} else {
			$scope.error = true;
			$scope.message = 'Selecteer minstens 1 vraag!';
		}
   }
   
   // if user answers a question, update answer table and update local playerList var
   socketIO.on('userAnswer', function (answer) {
	for(var i = 0; i < $scope.playerList.length; i++) {
		if($scope.playerList[i].id === answer.playerID) {
			$scope.playerList[i].answers[answer.questionNr] = answer.answer;
			if(!answer.answer || answer.answer == null) { answer.answer = '<b> NULL </b>'; }
			document.getElementById($scope.playerList[i].id + (answer.questionNr + 1)).innerHTML = answer.answer;
		}
	}
   });
   
   // login admin.
   socketIO.emit('adminLogin');
   // login admin reply (user and playerList)
   socketIO.on("adminLogin reply", function(gameInfo) {
	   console.log('gameInfo: ', gameInfo);
	   $scope.admin = gameInfo.list[0];
	   $scope.playerList = gameInfo.list;
   });
   
   // when a new user connects update playerList
   socketIO.on("new user", function(playerInfo) {
      console.log("NEWUSER:", playerInfo);
      $scope.playerList.push(playerInfo);
   });
   
});


// THIS IS A STUDENT LOGGED IN:
app.controller("gameController", function($scope, $interval, $timeout, $routeParams, $location, socketIO) {

   $scope.playerList = [];
   $scope.player = null;
   $scope.questionList = [];
   $scope.questionTime = 5; // in seconds
   $scope.question = 0; //index of questionList
   
   // game is starting, recieving list..
   socketIO.on('listRecieved', function(questionList) {
	$scope.questionList = shuffle(questionList); //randomize the questionList for each player (see shuffle function)
	askQuestion(); //ask the first question of the array
	if($scope.questionList.length !== 1){
		// ask the next question every questionTime seconds until array is complete
		$interval(askQuestion, ($scope.questionTime + 1)*1000, $scope.questionList.length-1);
	}
   });
   
   function askQuestion() {
	$scope.question++;
	console.log('asking question..', $scope.question);
    $scope.timeLeft = $scope.questionTime;
	$interval( function(){$scope.timeLeft--;} , 1000, $scope.questionTime  ); // reduce time each seconds
	$timeout(saveAnswer, ($scope.questionTime+0.9)*1000);
   }
   
   function saveAnswer() {
	console.log('saving answer..', $scope.question);
	var theAnswer = document.getElementById('theAnswer'); //get the answer with plain javascript
	$scope.player.answers[ ($scope.questionList[$scope.question -1].id) -1] = theAnswer.value; //save answer to local player var
	socketIO.emit('userAnswered', {playerID: $scope.player.id, questionNr: $scope.questionList[$scope.question -1].id -1, answer: theAnswer.value}); //send answer to server
	theAnswer.value = ''; //reset answer
   }
   
   // login player
   socketIO.emit('getMyInfo', { name: $routeParams.name });
   // login player reply
   socketIO.on("getMyInfo reply", function(gameInfo) {
	   console.log('gameInfo: ', gameInfo);
	   $scope.player = gameInfo.player;
	   $scope.playerList = gameInfo.list;
   });
   
   // if new user update the playerList (player doesn't use the playerList though)
   socketIO.on("new user", function(playerInfo) {
      console.log("NEWUSER:", playerInfo);
      $scope.playerList.push(playerInfo);
   });
});


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function check (div) {
	document.getElementById('question'+div.substring(div.length, div.length -1)).checked = !document.getElementById('question'+div.substring(div.length, div.length -1)).checked;
	console.log();
}

