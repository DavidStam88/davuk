var express     = require('express');
var path        = require('path');
var http        = require('http');
var socketio    = require('socket.io');

var app        = express();
var httpServer = http.Server(app);
var io         = socketio(httpServer);

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function(req, res){
  res.sendfile('index.html');
});
	
/* * * * * * * * * * * * * * * * * * * * * * */
/*     WebSocket Messages                    */
/* * * * * * * * * * * * * * * * * * * * * * */

var playerList = [];
io.on("connection", function(socket){
   console.log("User Connected", socket.id);
   
   socket.on("sign in", function(data) {
      var newPlayer = {
		 id: socket.id,
         name: data.name
      }
	  
	  if( playerList.length < 1) { isAdmin = true; } else { isAdmin = false; }
	  
      socket.emit("sign in reply", {admin: isAdmin, player: newPlayer});
      socket.broadcast.emit("new user", newPlayer);
      playerList.push(newPlayer);
   });
   socket.on("adminLogin", function() {
		socket.emit('adminLogin reply', {list: playerList});
   });
   
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