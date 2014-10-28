var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var port = process.env.PORT || 3000;
var docentRouter = require('./routes/docentRouter.js')(express);

// Deze regel zorgt ervoor dat de socketrouters geintergreerd worden.
var quizSockets = require('./routes/socketRouter.js')(io);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(expressSession({secret: 'madMen', saveUninitialized: true, resave: true}));

// Op deze manier worden de docentrouters geintergreerd.
app.use('/docent', docentRouter);

app.use(express.static(path.join(__dirname, '../client')));
server.listen(port);
console.log("DaVuk-app is actief op port " + port);
