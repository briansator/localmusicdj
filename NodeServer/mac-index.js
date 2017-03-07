var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
const PORT = 8080;

const musicFolder = "/Users/briansator/Music/Dan\'s\ Music/";
const fs = require ('fs');

var mediaplayerconnection;
const deviceconnections = {};

var songnames = [];
var songpaths = [];

var playlist = [];

fs.readdir(musicFolder, (err, files) => {
	files.forEach(file => {
		if(file.indexOf(".mp3") != -1){
			songnames.push(file);
			songpaths.push("/Users/briansator/Music/Dan\'s\ Music/" + file);
		}
	});

	playlist.push(1);
	playlist.push(3);
	playlist.push(5);
});


app.get('/', function(request, response){
	response.writeHead(200, {"Content-Type" : "text/plain"});
	songnames.forEach(function(song){
		response.write(song + "\n");
	});
	response.end();
});

app.get('/playlist', function(request, response){
	response.writeHead(200, {"Content-Type" : "text/plain"});
	playlist.forEach(function(song){
		response.write(songnames[song] + "\n");
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

app.get('/addsong/:id', function(request, response){
	if(songpaths.length > request.params.id){
		playlist.push(request.params.id);
	}
	response.writeHead(200, {"Content-Type" : "text/plain"});
	response.write(songnames[request.params.id] + " added to playlist! \n");
	response.end();
});

app.get('/skipsong', function(request, response){
	try{
		var nextsong = playlist[0];
		mediaplayerconnection.send(songpaths[nextsong]);
	} catch (err){
		console.log(err);
	} finally {
		playlist.shift();
	}
	response.end();
});

app.ws('/mediaplayer', (ws, req) => {
	ws.on('open', function connect(){
		// mediaplayerconnection[ws.sessionId].push(ws);
		mediaplayerconnection = ws;
		console.log("WS connection opened with media player \n");
		ws.send(songpaths[0]);
	});
	ws.on('message', function incoming(message, flags){
		if(mediaplayerconnection == null){
			mediaplayerconnection = ws;
		}
		// var data = JSON.parse(message);
		// if(data.type === "nextsong"){
		// 	if(playlist.length > 0){
		// 		var nextsong = playlist.shift();
		// 		//here send message back with next song
		// 	}
		// }
		console.log("Received message from mediaplayer: " + message);
		switch(message){
			case "next-song":
				if(playlist.length > 0){
					var nextsong = playlist.shift();
					ws.send(songpaths[nextsong]);
				}
				break;
			case "error":
				console.log("Music player had error!");
				break;
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
				playlist.push(data.index);
			break;
			case "resetPlaylist":
				console.log("Requesting to reset playlist");
				playlist.length = 0;
			break;
			case "removeSong":
				console.log("Requesting to remove song: " + data.data);
				playlist.splice(data.index, 1);
			break;
		}
	})
});

var server = app.listen(PORT, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server running at http://127.0.0.1:" + PORT);
});