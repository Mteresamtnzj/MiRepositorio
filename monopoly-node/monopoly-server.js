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

app.get("/empezar/:uid",function(req,res){
	var jsonData;
	if(partida.fase.nombre=="Jugar"){
	partida.setTurno(partida.coleccionJugadores[0]);
		
		jsonData={"res":req.params.uid/*partida.coleccionJugadores[0].uid*/,"nombre":partida.coleccionJugadores[0].nombre}
	} else{ jsonData={"nombre":"Incompleta."};
	}
	res.send(jsonData);
})


app.get("/lanzar/:uidJugador",function(req,res){
	var jsonData;
	var jugador;
	for(var f=0;f<partida.coleccionJugadores.length;f++){
		if(req.params.uidJugador==partida.coleccionJugadores[f].uid){
			jugador=partida.coleccionJugadores[f];
			if(jugador.turno.nombre=="metoca"){
				if(jugador.yaLanzo==false){
					jugador.lanzar();
					if(partida.ganador==jugador){
						jsonData={"res":"Eres el ganador!","nombre":partida.ganador.nombre};
							res.send(jsonData);
					}
					if(jugador.ficha.estado=="perdedor"){
							jugador.cambiarTurno();
							jsonData={"res":"Has agotado tu dinero.","nombre":jugador.nombre, "posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre};		
							if(partida.fase.nombre=="Fin")
								jsonData={"res":"El juego ha terminado.","nombre":partida.ganador.nombre,"posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre};
							res.send(jsonData);	
						}
					if(partida.tablero.casillas[jugador.ficha.getPosicion()].tema.comprador!=jugador.ficha && partida.tablero.casillas[jugador.ficha.getPosicion()].tema.comprador!=undefined){
						jsonData={"nombre":jugador.nombre,"posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre,"saldo":jugador.ficha.saldo,"res":0};
						
					}else 
						jsonData={"nombre":jugador.nombre,"posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre,"res":-1};
				}else 
					jsonData={"res":"Ya lanzaste.","nombre":jugador.nombre};
			} else jsonData={"res":"No es tu turno.","nombre":jugador.nombre};
		}
	}
	
	res.send(jsonData);
})


app.get("/comprar/:uidJugador",function(req,res){
	var jsonData;
	var jugador;
	for(var f=0;f<partida.coleccionJugadores.length;f++){
		if(req.params.uidJugador==partida.coleccionJugadores[f].uid){
			jugador=partida.coleccionJugadores[f];
			if(jugador.turno.nombre=="metoca"){
				if(jugador.yaLanzo==true){
					if(partida.tablero.casillas[jugador.ficha.getPosicion()].tema.titulo=="Calle" || partida.tablero.casillas[jugador.ficha.getPosicion()].tema.titulo=="Estacion"){
						if(partida.tablero.casillas[jugador.ficha.getPosicion()].tema.precio<=jugador.ficha.saldo){
							if(partida.tablero.casillas[jugador.ficha.getPosicion()].tema.comprador==undefined){
								jugador.asignarCompra(partida.tablero.casillas[jugador.ficha.getPosicion()].tema);
								jsonData={"nombre":jugador.nombre,"posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre,"saldo":jugador.ficha.saldo,"res":-1};
							} else
								jsonData={"nombre":jugador.nombre,"posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre,"saldo":jugador.ficha.saldo,"res":0};
						}else 
						jsonData={"res":"No tienes dinero suficiente.","nombre":jugador.nombre};
					}else 
						jsonData={"res":"No puedes comprar esa casilla.","nombre":jugador.nombre};
				} else
					jsonData={"res":"Primero debes lanzar.","nombre":jugador.nombre};
	} else jsonData={"res":"No es tu turno.","nombre":jugador.nombre};
	}
	}
	res.send(jsonData);
})

app.get("/turno/:uidJugador",function(req,res){
	var jsonData;
	var jugador;
	var letoca;
	for(var f=0;f<partida.coleccionJugadores.length;f++){
		if(req.params.uidJugador==partida.coleccionJugadores[f].uid){
			jugador=partida.coleccionJugadores[f];
			if(jugador.turno.nombre=="metoca"){
				if(jugador.yaLanzo==true){
				jugador.cambiarTurno();
				for(var k=0;k<partida.coleccionJugadores.length;k++){
					if(partida.coleccionJugadores[k].turno.nombre=="metoca"){
						letoca=partida.coleccionJugadores[k];
						jsonData={"res":letoca.ficha.getPosicion(),"nombre":letoca.nombre};
					}
				}
				res.send(jsonData);
				}
				else{ jsonData={"res":"No puedes pasar turno sin lanzar.","nombre":jugador.nombre};
				}
			} else{ jsonData={"res":"No es tu turno.","nombre":jugador.nombre};
			}
	}
	}
	
	res.send(jsonData);
})




app.get("/edificarAzul/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Azul" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Azul edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})

app.get("/edificarAmarillo/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Amarillo" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Amarillo edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})

app.get("/edificarMarron/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Marron" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Marron edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})

app.get("/edificarVerde/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Verde" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Verde edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})

app.get("/edificarNaranja/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Naranja" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Naranja edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})

app.get("/edificarRosa/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Rosa" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Rosa edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})

app.get("/edificarRojo/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Rojo" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Rojo edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})

app.get("/edificarMorado/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Morado" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Morado edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})

/////////////Pruebas

app.get("/turnoPrueba/",function(req,res){
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

app.get("/lanzarPrueba/",function(req,res){
	var jsonData;
	var jugador;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			if(jugador.yaLanzo==false){
				jugador.lanzar();
				jsonData={"nombre":jugador.nombre,"posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre,"res":-1};
			}else if (jugador.yaLanzo==true)
				jsonData={"nombre":jugador.nombre,"res":"Ya lanzaste."};
			res.send(jsonData);
		
		}
	}
})

app.get("/comprarPrueba/",function(req,res){
	var jsonData;
	var jugador;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			jugador.yaLanzo=true;
			partida.tablero.mover(jugador.ficha,40-jugador.ficha.getPosicion()+1);
			jugador.asignarCompra(partida.tablero.casillas[jugador.ficha.getPosicion()].tema);
			jsonData={"nombre":jugador.nombre,"saldo":jugador.ficha.saldo,"compras":jugador.ficha.compras[0].nombre};
		}
	}
		res.send(jsonData);			
	
})

app.get("/empezarPrueba/",function(req,res){
	var jsonData;
	if(partida.fase.nombre=="Jugar"){
	partida.setTurno(partida.coleccionJugadores[0]);
		jsonData={"res":req.params.uid,"nombre":partida.coleccionJugadores[0].nombre}
	} else{ jsonData={"nombre":"Incompleta."};
	}
	res.send(jsonData);
})

app.get("/finPrueba/",function(req,res){
	var jsonData;
	var jugador;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			jugador.yaLanzo=true;
			jugador.ficha.saldo=-10;
			jugador.ficha.estado="perdedor";
			
			if(jugador.ficha.estado=="perdedor"){
							jugador.cambiarTurno();
							jsonData={"res":"Has agotado tu dinero.","nombre":jugador.nombre, "posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre};		
							if(partida.fase.nombre=="Fin")
								jsonData={"res":"El juego ha terminado.","nombre":partida.ganador.nombre,"posicion":partida.tablero.casillas[jugador.ficha.getPosicion()].tema.nombre};
							res.send(jsonData);	
			}
		}
	}
})

app.get("/edificarMarronPrueba/",function(req,res){
	var jsonData;
	var jugador;
	var contador=0;
	for(f in partida.coleccionJugadores){
		if(partida.coleccionJugadores[f].turno.nombre=="metoca"){
			jugador=partida.coleccionJugadores[f];
			jugador.asignarCompra(partida.tablero.casillas[3].tema)
			for (i in jugador.ficha.compras){
					if(jugador.ficha.compras[i].color=="Marron" && jugador.ficha.compras[i].edificable==true){
						jugador.edificar(jugador.ficha.compras[i],jugador);
						contador=contador+1;
						jsonData={"res":"Grupo Marron edificado."};
					} 
			}
		}
	}
	if (contador==0)
		jsonData={"res":"No puedes edificar ahí."};
	res.send(jsonData);
})


server.listen(port,host);
console.log("servidor iniciado en puerto "+port+" y host "+host);