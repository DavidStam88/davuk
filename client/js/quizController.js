var quizController = function ($scope, socket) {
	$scope.vraag = {};
	$scope.timer = 0;
	$scope.message = '';

	socket.on('message', function(message){
		console.log(message);
		$scope.message = message;
		$scope.$digest();
	});

	socket.on('timer', function(timer){
		$scope.timer = timer.tijd;
		$scope.$digest();
	});
};