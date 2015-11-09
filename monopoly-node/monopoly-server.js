var modelo=require("./server/modelo.js");
var fs = require("fs");
var http= require("http");
var express =require("express");
var config = JSON.parse(fs.readFileSync("./config.json"));
var port = config.port;
var host=config.host;

var app=express();
var server = http.createServer(app);

//Juego
var juego = new FactoryJuego();
var partida = juego.crearPartida();
console.log(partida.fase.nombre);

app.get("/", function(request,response){
	var contenido=fs.readFileSync("./client/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
})


server.listen(port,host);
console.log("servidor iniciado en puerto "+port+" y host "+host);