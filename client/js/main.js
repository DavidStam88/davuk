var app = angular.module("SockBlocksApp",["ngRoute"]);

app.config( function($routeProvider) {
      $routeProvider.
          when('/login', {
              templateUrl: '/templates/loginForm.html',
              controller: 'loginFormController'
          }).
		  when('/config/:name', {
			  templateUrl: '/templates/loginForm.html',
              controller: 'configController'
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
app.controller("loginFormController", function($scope, $location) {
   $scope.userName = "";
   $scope.submitUserName = function() {
      $location.path("/config/" + $scope.userName);
   }
});
// REGISTER/CREATE A USER/ADMIN
app.controller("configController", function($scope, $routeParams, $location, socketIO) {
   
   socketIO.emit("sign in", { name: $routeParams.name} )
   socketIO.on("sign in reply", function(reply) {
	
	if(reply.admin) { $location.path("/adminPanel"); }
	else { $location.path("/game/" + reply.player.name); }
	
   });
 
});

// THIS IS A ADMIN LOGGED IN:
app.controller("adminPanelController", function($scope, $location, socketIO) {
   $scope.playerList = [];
   $scope.player = null;
   
   socketIO.emit('adminLogin');
   socketIO.on("adminLogin reply", function(gameInfo) {
	   console.log('gameInfo: ', gameInfo);
	   $scope.player = gameInfo.list[0];
	   $scope.playerList = gameInfo.list;
   });
   
   socketIO.on("new user", function(playerInfo) {
      console.log("NEWUSER:", playerInfo);
      $scope.playerList.push(playerInfo);
   });
   
});


// THIS IS A STUDENT LOGGED IN:
app.controller("gameController", function($scope, $routeParams, $location, socketIO) {

   $scope.playerList = [];
   $scope.player = null;
   
   socketIO.emit('getMyInfo', { name: $routeParams.name });
   socketIO.on("getMyInfo reply", function(gameInfo) {
	   console.log('gameInfo: ', gameInfo);
	   $scope.player = gameInfo.player;
	   $scope.playerList = gameInfo.list;
   });
   
   socketIO.on("new user", function(playerInfo) {
      console.log("NEWUSER:", playerInfo);
      $scope.playerList.push(playerInfo);
   });
});

