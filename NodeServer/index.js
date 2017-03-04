var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

const PORT = 8080;

const musicFolder = "E:/Dan\'s\ Music/";
const fs = require ('fs');

const mediaplayerconnection = {};
const deviceconnections = {};

var songnames = [];
var songpaths = [];

var playlist = [];

fs.readdir(musicFolder, (err, files) => {
	files.forEach(file => {
	songnames.push(file);
	songpaths.push("E:/Dan\'s\ Music/" + file);
	});
});


app.get('/', function(request, response){
	response.writeHead(200, {"Content-Type" : "text/plain"});
	songnames.forEach(function(song){
		response.write(song + "\n");
	});
	response.end();
});

app.get('/songpaths', function(request, response){
	response.writeHead(200, {"Content-Type" : "text/plain"});
	songpaths.forEach(function(path){
		response.write(path + "\n");
	});
	response.end();
});

app.ws('/mediaplayer', (ws, req) => {
	ws.on('open', function connect(){
		mediaplayerconnection[ws.sessionId].push(ws);
		console.log("WS connection opened with media player \n");
		ws.send(songpaths[0]);
	});
	ws.on('message', function incoming(message, flags){
		var data = JSON.parse(message);
		if(data.type === "nextsong"){
			if(playlist.length > 0){
				var nextsong = playlist.shift();
				//here send message back with next song
			}
		}
	})
});

app.ws('/mobileapp', (ws, req) => {
	ws.on('open', function connect(){
		deviceconnections[ws.sessionId].push(ws);
	});
	ws.on('message', function incoming(message, flags){
		var data = JSON.parse(message);
		switch(data.type){
			case "requestSong":
				console.log("Requesting song: " + data.data);
			break;
			case "resetPlaylist":
				console.log("Requesting to reset playlist");
			break;
			case "removeSong":
				console.log("Requesting to remove song: " + data.data);
			break;
		}
	})
});

var server = app.listen(PORT, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server running at http://127.0.0.1:" + PORT);
});