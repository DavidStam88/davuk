var app = angular.module("SockBlocksApp",["ngRoute"]);

app.config( function($routeProvider) {
      $routeProvider.
          when('/name', {
              templateUrl: '/templates/nameForm.html',
              controller: 'nameFormController'
          }).
          when('/blocks/:name', {
              templateUrl: '/templates/blocks.html',
              controller: 'blocksController'
          }).
          otherwise({
              redirectTo: '/name'
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


app.controller("nameFormController", function($scope, $location) {

   $scope.userName = "";

   $scope.submitUserName = function() {
      $location.path("/blocks/"+$scope.userName);
   }

});

app.controller("blocksController", function($scope, $routeParams, socketIO) {

   $scope.playerList = [];
   $scope.player = null;

   socketIO.on("connect", function() {
      console.log("connected", socketIO.id() );
   });

   socketIO.emit("sign in", { name: $routeParams.name} )

   socketIO.on("sign in reply", function(gameInfo) {
      console.log("SIGNINREPLY", gameInfo.player);

      $scope.player = gameInfo.player;
      $scope.playerList = gameInfo.list;
      $scope.playerList.push( $scope.player );
   });

   socketIO.on("new user", function(playerInfo) {
      console.log("NEWUSER:", playerInfo);
      $scope.playerList.push(playerInfo);
   });
});