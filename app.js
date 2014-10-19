var express     = require('express');
var path        = require('path');
var http        = require('http');
var socketio    = require('socket.io');

/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/kittyDB');
var db = mongoose.connection;
*/

var app        = express();
var httpServer = http.Server(app);
var io         = socketio(httpServer);

app.use(express.static(path.join(__dirname, 'client')));

//require('security.js')(app); //install security to the app

app.get('/', function(req, res){
  res.sendfile('index.html');
});
	
/* * * * * * * * * * * * * * * * * * * * * * */
/*     WebSocket Messages                    */
/* * * * * * * * * * * * * * * * * * * * * * */

var playerList = [];
var gameActive = false;
io.on("connection", function(socket){
   console.log("User Connected", socket.id);
   
   // if there is a new user:
   socket.on("sign in", function(data) {
      if(gameActive) {
		socket.emit("sign in reply", {error: true, message: 'Game is already active'});
	  } else {
		  var newPlayer = {
			 id: socket.id,
			 name: data.name,
			 answers: []
		  }
		  
		  // the first user will be a admin (isAdmin = true)
		  if( playerList.length < 1) { isAdmin = true; } else { isAdmin = false; }
		
		  socket.emit("sign in reply", {admin: isAdmin, player: newPlayer});
		  socket.broadcast.emit("new user", newPlayer);
		  playerList.push(newPlayer);
	  }
   });
   // admin logs in and recieves the playerList
   socket.on("adminLogin", function() {
		socket.emit('adminLogin reply', {list: playerList});
   });
   // if user has filled in a answer 
   socket.on('userAnswered', function(answer){
	for(var i = 0; i < playerList.length; i++) {
		if(playerList[i].id === answer.playerID) {
			// insert answer in server playerList
			playerList[i].answers[answer.questionNr] = answer.answer;
		}
	}
	// send the answer to the admin
	socket.broadcast.emit('userAnswer', answer);
   });
   
   // if the admin uploads the questionList (game is starting!)
   socket.on('listUpload', function(questionList) {
		gameActive = true;
		socket.broadcast.emit('listRecieved', questionList);
		//console.log('questionList recieved: ', questionList);
   });
   
   // for a new user, recieving user and playerList
   socket.on("getMyInfo", function(user) {
		for(var i = 0; i < playerList.length; i++) {
		   if(playerList[i].name === user.name) {
			 var thisPlayer = playerList[i];
		   }
		}
		socket.emit("getMyInfo reply", {list: playerList, player: thisPlayer });
   });
})

/* * * * * * * * * * * * * * * * * * * * * * */
/*     HTTP Routes                           */
/* * * * * * * * * * * * * * * * * * * * * * */
/*
var mainRoutes = express.Router();

mainRoutes.get('/', function(req, res) {
   res.send("<h1>Hi there</h1>");
});
app.use(mainRoutes);
*/

/* * * * * * * * * * * * * * * * * * * * * * */
/*     Let's rock 'n roll...                 */
/* * * * * * * * * * * * * * * * * * * * * * */

httpServer.listen(3000, function(){
   console.log("Server running on port 3000!");
});