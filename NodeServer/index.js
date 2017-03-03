// var http = require('http');
var express = require('express');
var app = express();

const PORT = 8080;

const musicFolder = "E:/Dan\'s\ Music/";
const fs = require ('fs');

// function handleRequest(request, response){
// 	response.writeHead(200, {"Content-Type" : "text/plain"});
// 	fs.readdir(musicFolder, (err, files) => {
// 		files.forEach(file => {
// 		response.write(file + "\n");
// 		});
// 		response.end();
// 	});
// }

app.get('/', function(request, response){
	response.writeHead(200, {"Content-Type" : "text/plain"});
	fs.readdir(musicFolder, (err, files) => {
		files.forEach(file => {
		response.write(file + "\n");
		});
		response.end();
	});
});

// var server = http.createServer(handleRequest);

// server.listen(PORT);

// console.log("Server running at http://127.0.0.1:" + PORT);
var server = app.listen(PORT, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server running at http://%s:%s", host, port);
});