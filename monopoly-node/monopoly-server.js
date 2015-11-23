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
var juego = new modelo.FactoryJuego();
var partida = juego.crearPartida();
console.log(partida.fase.nombre);
app.use("/",express.static(__dirname));

app.get("/", function(request,response){
	var contenido=fs.readFileSync("./client/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
})


app.get("/jugador/:nombre", function(request,response){
	
	var jsonData;
	
	if(partida.fase.nombre=="Inicial"){
		var jug = new modelo.Jugador(request.params.nombre,partida);	
		jug.asignarFicha();
		if(jug.ficha){
			jsonData={"nombre":jug.nombre,"uid":jug.uid,"ficha":jug.ficha.forma,"posicion":jug.ficha.getPosicion()}
		} else{
			jsonData={"nombre":"Lo siento","uid":"jug.uid","ficha":"no tienes ficha","posicion":"para jugar."}
		}
	}
	else{
		jsonData={"nombre":"Lo siento","uid":"jug.uid","ficha":"no tienes ficha","posicion":"para jugar."}
	}
	console.log(jsonData);
	response.send(jsonData);
})

app.get("/empezar",function(req,res){
	var jsonData;
	if(partida.fase.nombre=="Jugar"){
	partida.setTurno(partida.coleccionJugadores[0]);
		jsonData={/*"res":partida.coleccionJugadores[0].uid,*/"nombre":partida.coleccionJugadores[0].nombre}
	} else{ jsonData={"nombre":"Esperando jugadores..."};
	}
	res.send(jsonData);
})

app.get("/lanzar",function(rep,res){
	var jsonData;
	var jugador;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			if(jugador.yaLanzo==false){
				jugador.lanzar();
				jsonData={"nombre":jugador.nombre,"posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre};
			}else 
				jsonData={"res":"Ya lanzaste.","nombre":jugador.nombre};
		}
	}
	res.send(jsonData);
})
/*
app.get("/lanzar/:uidJugador",function(req,res){
	var jsonData;
	var jugador;
	for(f in partida.coleccionJugadores){
		if(req.params.uidJugador==partida.coleccionJugadores[f].uid){
			jugador=partida.coleccionJugadores[f];
			if(jugador.turno.nombre=="metoca"){
				if(jugador.yaLanzo==false){
				jugador.lanzar();
				jsonData={"res":jugador.ficha.getPosicion(),"nombre":jugador.nombre};}
				else jsonData={"res":"Ya lanzaste.","nombre":jugador.nombre};
			} else jsonData={"res":"No es tu turno.","nombre":jugador.nombre};
	}
	}
	
	res.send(jsonData);
})*/
app.get("/turno/",function(req,res){
	var jsonData;
	var letoca;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			if(partida.coleccionJugadores[f].yaLanzo==true){
				partida.coleccionJugadores[f].cambiarTurno();
			}
		}
	}
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			letoca=partida.coleccionJugadores[f];
			jsonData={"nombre":letoca.nombre};
		}
	}
	res.send(jsonData);
})

/*
app.get("/turno/:uidJugador",function(req,res){
	var jsonData;
	var jugador;
	var letoca;
	for(f in partida.coleccionJugadores){
		if(req.params.uidJugador==partida.coleccionJugadores[f].uid){
			jugador=partida.coleccionJugadores[f];
			if(jugador.turno.nombre=="metoca"){
			if(jugador.yaLanzo==true){
				jugador.cambiarTurno();
				letoca=partida.coleccionJugadores[(f+1)%(partida.coleccionJugadores.length)];
				jsonData={"nombre":letoca.nombre};
			} else if (jugador.yaLanzo==false){
				jsonData={"nombre":"No puedes pasar turno sin lanzar."};
			}
			} else jsonData={"nombre":"No es tu turno."};
	}
	}
	
	res.send(jsonData);
})*/

server.listen(port,host);
console.log("servidor iniciado en puerto "+port+" y host "+host);