/*to do:
- obligar a tirar antes de nada en su turno
- condiciones para salir de la carcel
- estado de ficha bancarrota -- vender casas e hipotecar calles
- edificar en orden: en un grupo de calles cuando todas tengan una casa, se puede poner la segunda casa...
- poner tarjetas de ir a la carcel y de salir de carcel
- el jugador debe llamar al metodo empezar para comenzar el juego
- hacer que l tarjeta de suerte sea aleatoria
- comprobar fin cada vez que lanza el primer jugador, poner condicion de alcanzar maximo
*/

function Partida(tablero, coleccionFichas,numeroJugadores){
	this.tablero = tablero;
	this.coleccionFichas=coleccionFichas;
	this.coleccionJugadores=[];
	this.numeroJugadores=numeroJugadores;
	this.turno=undefined;
	this.dado=new Dado();
	this.fase=new FaseInicial(this);
	this.cont=0;
	this.asignarFicha=function(jugador){
		var enc=false;
		for(f in this.coleccionFichas){
			if (this.coleccionFichas[f].libre){
				enc=true;
				this.coleccionFichas[f].libre=false;
				this.coleccionFichas[f].casilla=this.tablero.casillas[0];
				this.coleccionFichas[f].asignarJugador(jugador);
				jugador.ficha=this.coleccionFichas[f];
				this.coleccionJugadores.push(jugador);
				console.log("El jugador "+jugador.nombre+" tiene la ficha "+coleccionFichas[f].forma);
				break;
			}	
		};
		if (!enc){
			console.log("No hay mas fichas.");
		}
		
	};
	
	
	this.cambiarTurno=function(jugador){
		var indice=this.coleccionJugadores.indexOf(jugador);
		var siguienteIndice=(indice+1)%(this.coleccionJugadores.length);
		//antes de pasar el turno al otro jugador, vamos a comprobar si esta encarcelado
		//si esta encarcelado, no cambiamos el turno pero decremento el contador de retencion
		if(this.coleccionJugadores[siguienteIndice].ficha.encarcelado==0){
			this.setTurno(this.coleccionJugadores[siguienteIndice]);
			this.coleccionJugadores[siguienteIndice].tiradas=1;
			jugador.turno=new NoMeToca();
		}
		else{
			this.coleccionJugadores[siguienteIndice].ficha.encarcelado--;
            this.cambiarTurno(this.coleccionJugadores[siguienteIndice])
		}
	}
	
	this.compruebaFin=function(){
		for(j in this.coleccionJugadores){
			if(this.coleccionJugadores[j].ficha.estado=="operativa"){
				this.ganador=this.coleccionJugadores[j];
				this.cont++;
				if(this.cont>=2){
					this.cont=0;
					this.ganador=undefined;
					return false;
				}					
		}
		}
		console.log("El juego termino. El GANADOR es "+this.ganador.nombre+"!!");
		this.fase=new FaseFin();
		return true;
	}
	
		this.setTurno=function(jugador){
		jugador.tiradas=1;
		this.turno=jugador;
		jugador.turno=new EsMiTurno(tablero);
}
}

function EsMiTurno(tablero){
	this.lanzar=function(jugador){
		if(jugador.tiradas>0){
	    var numero=Math.round(Math.random()*5+1);
		console.log("Dado: "+numero);
		tablero.mover(jugador.ficha,numero);
		jugador.tiradas=0;
		} else console.log("Ya lanzaste.");
	}
	this.lanzar2=function(jugador){
		var d1=Math.round(Math.random()*5+1);
		var d2=Math.round(Math.random()*5+1);
	    var numero=d1+d2;
		if (jugador.tiradas>0){
		if(d1==d2 && jugador.tiradas<=2){
			jugador.tiradas++;
			console.log("Dados: "+numero);
			console.log("DOBLES!");
			tablero.mover(jugador.ficha,numero);
			console.log("Tira otra vez!");
		}
		if (jugador.tiradas==3){
			console.log("Te pasaste...");
			jugador.ficha.cae(casillas[10]);
			jugador.tiradas=0;
		}
		if (d1!=d2){
			if (jugador.tiradas==0)
			console.log("Ya lanzaste.");
		else{			jugador.tiradas=0;
			console.log("Dados: "+numero);
			tablero.mover(jugador.ficha,numero);
		}}
		} else console.log("Ya lanzaste.");
		
	}
	this.edificar=function(propiedad,jugador){
		
		if(propiedad.comprador==jugador.ficha && propiedad.edificable==true){
			console.log("Propiedad edificable. "+propiedad);
		if(propiedad.casas<4){
			 console.log("Estoy dentro de casas.");
					this.accion="Casa";
					this.aPagar=new CalculoPago(propiedad.precio,this.accion,propiedad.casas,propiedad.hotel, jugador.ficha.estaciones);
					if(jugador.ficha.saldo>this.aPagar.cantidad){
						propiedad.casas++;
						jugador.ficha.saldo=jugador.ficha.saldo-this.aPagar.cantidad;
						console.log("Casa edificada. Tu saldo es de "+jugador.ficha.saldo);
					} else console.log("No tienes dinero suficiente.");
				}
			if (propiedad.casas==4 && propiedad.hotel==0){
					this.accion="Hotel";
					this.aPagar=new CalculoPago(propiedad.precio,this.accion,propiedad.casas,propiedad.hotel,jugador.ficha.estaciones);
					if(jugador.ficha.saldo>this.aPagar.cantidad){
						propiedad.hotel++;
						jugador.ficha.saldo=jugador.ficha.saldo-this.aPagar.cantidad;
						console.log("Hotel edificado. Tu saldo es de "+jugador.saldo);
					} else console.log("No tienes dinero suficiente.");
		}}
			if (propiedad.comprador!=jugador.ficha){
				console.log("Esta propiedad no te pertenece.");
			} else console.log("Todavia no puedes edificar aquí.");
	}
}

function NoMeToca(){
	this.lanzar=function(jugador){
		console.log("No es tu turno.");
	}
	this.lanzar2=function(jugador){
		console.log("No es tu turno.");
	}
	this.edificar=function(propiedad){
		console.log("No es tu turno.");
	}
}

function FactoryJuego(){
	this.crearTablero=function(){
		var tablero = new Tablero(40);
		return tablero;
	}
	this.crearFichas=function(){
		var coleccionFichas=[new Ficha("Barco"),new Ficha("Dedal"),new Ficha("Perro"),new Ficha("Plancha"),new Ficha("Sombrero"),new Ficha("Coche"),new Ficha("Carretilla"),new Ficha("Zapato")];
		return coleccionFichas;
	}
	this.crearPartida=function(){
		return new Partida(this.crearTablero(),this.crearFichas(),2);
	}
	
}

function FaseInicial(juego){
	this.nombre="Inicial";
	this.juego=juego;
	this.asignarFicha=function(jugador){
		this.juego.asignarFicha(jugador);
		if (this.juego.coleccionJugadores.length==this.juego.numeroJugadores){
			this.juego.fase=new FaseJugar(this.juego);
		}
	}
}

function FaseJugar(juego){
	console.log("COMIENZA EL JUEGO! Quien empieza?");
	this.nombre="Jugar";
	this.juego=juego;
	this.lanzar=function(jugador){
		jugador.turno.lanzar(jugador);
				
	}
	this.lanzar2=function(jugador){
		jugador.turno.lanzar2(jugador);
	}
	
	this.compruebaFin=function(){
		juego.compruebaFin();

	}
}

function FaseFin(juego,jugador){
	this.juego=juego;
	this.nombre="Fin";
	this.asignarFicha=function(jugador){
		console.log("No hay sitio.");
	};
	this.lanzar=function(jugador){
		console.log("El juego ha terminado.");
	};
	}


function Jugador(nombre,juego){
	this.nombre=nombre;
	this.turno=new NoMeToca();
	this.ficha=undefined;
	this.juego=juego;
	this.tiradas=undefined;
	this.asignarFicha=function(){
		this.juego.fase.asignarFicha(this);
	}
	this.lanzar=function(){
		if(this.ficha.estado=="operativa")
			juego.fase.lanzar(this);
		else if(this.ficha.estado=="perdedor")
			console.log("No puedes seguir jugando porque ya has perdido.");
	}
	this.lanzar2=function(){
	if(this.ficha.estado=="operativa")
		juego.fase.lanzar2(this);
	else if(this.ficha.estado=="perdedor")
		console.log("No puedes seguir jugando porque ya has perdido.");
	}
	this.cambiarTurno=function(){
		this.juego.cambiarTurno(this);
	}
	this.edificar=function(propiedad){
		
		this.turno.edificar(propiedad,this);
		
	}
	
	this.compruebaFin=function(){
		juego.fase.compruebaFin();
	}
}

function Ficha(forma){
	this.forma=forma;
	this.saldo=15000;
	this.libre=true;
	this.compras=[];
	this.estaciones=0;
	this.encarcelado=0;
	this.casilla=undefined;
	this.jugador=undefined;
	this.estado="operativa";
	var c=0;
	this.asignarJugador=function(jugador){
		this.jugador=jugador;
	}
	this.nuevaCasilla=function(casilla){
		this.casilla=casilla;
	}
	this.mover=function(posicion){
		this.tablero.mover(this.jugador.ficha,posicion);
	}
	this.getPosicion=function(){
		return this.casilla.posicion;
	}
	this.cae=function(casilla){
		this.casilla=casilla;
		this.casilla.cae(this);
	}
	this.cambiarTurno=function(){
		this.jugador.cambiarTurno();
	}
	this.asignarCompra=function(ficha,propiedad){
		ficha.compras[c]=propiedad;
		c++;
	}
	this.compruebaFin=function(){
		this.jugador.compruebaFin();
	}
}

function Casilla(posicion, tema){
	this.posicion=posicion;
	this.tema=tema;
	this.tablero=undefined;
	this.cae=function(ficha){
		this.tema.cae(ficha);
	}
	this.asignarTablero=function(tablero){
		this.tablero=tablero;
	}
}

function CrearCasillas(){
	var distanciaacarcel=20;
	this.crearCasillaNormal=function(posicion){
		return new Casilla(posicion,new Normal());
	}
	
	this.crearCasillaSalida=function(posicion){
		return new Casilla(posicion,new Salida());
	}
	this.crearCasillaArcaComunal=function(posicion,tablero){
		return new Casilla(posicion,new ArcaComunal(tablero));
	}
	this.crearCasillaCarcel=function(posicion){
		return new Casilla(posicion,new Carcel());
	}
	this.crearCasillaParking=function(posicion){
		return new Casilla(posicion, new Parking());
	}
	this.crearCasillaVeACarcel=function(posicion,distanciaacarcel,tablero){
		return new Casilla(posicion, new VeACarcel(distanciaacarcel,tablero));
	}
	this.crearCasillaEstacion=function(posicion,nombre,precio){
		return new Casilla(posicion,new Estacion(nombre,precio));
	}	
	this.crearCasillaSuerte=function(posicion,tablero){
		return new Casilla(posicion,new Suerte(tablero));
	}
	this.crearCasillaImpuesto=function(posicion,nombre,precio,porcentaje){
		return new Casilla(posicion,new Impuesto(nombre,precio,porcentaje));
	}
	this.crearCasillaCalle=function(posicion,nombre,precio,color){
		return new Casilla(posicion,new Calle(nombre,precio,color));
	}
}


function Tablero(nCasillas){
	this.casillas=[];
	this.nTarjeta=0;
	this.iniciarNormal=function(){
		for(i=0;i<nCasillas;i++){
			this.casillas[i]=crearCasillas.crearCasillaNormal(i);			
		}
	};

	this.iniciarTablero=function(){		
		for(i=0;i<nCasillas;i++){			
			this.casillas[i].asignarTablero(this);
		}
	};

	this.configurarTablero=function(tablero){
		this.casillas[0] = crearCasillas.crearCasillaSalida(0);
		this.casillas[1] = crearCasillas.crearCasillaCalle(1,"Ronda de Valencia",60,"Marron");		
		this.casillas[2] = crearCasillas.crearCasillaArcaComunal(2,this);
		this.casillas[3] = crearCasillas.crearCasillaCalle(3,"Plaza de Lavapies",60,"Marron");
		this.casillas[4] = crearCasillas.crearCasillaImpuesto(4,"Impuesto sobre el capital",200,10);		
		this.casillas[5] = crearCasillas.crearCasillaEstacion(5,"Estacion del tren de media noche",200);
		this.casillas[6] = crearCasillas.crearCasillaCalle(6,"Glorieta Cuatro Caminos",100,"Azul");
		this.casillas[7] = crearCasillas.crearCasillaSuerte(7,this);
		this.casillas[8] = crearCasillas.crearCasillaCalle(8,"Av. Reina Victoria",100,"Azul");
		this.casillas[9] = crearCasillas.crearCasillaCalle(9,"Calle Bravo Murillo",120,"Azul");
		this.casillas[10] = crearCasillas.crearCasillaCarcel(10);				
		this.casillas[11] = crearCasillas.crearCasillaCalle(11,"Glorieta de Bilbao",140,"Rosa");		
		this.casillas[12] = crearCasillas.crearCasillaImpuesto(12,"Impuesto de electricidad",150,0);		
		this.casillas[13] = crearCasillas.crearCasillaCalle(13,"Calle Alberto Aguilera",140,"Rosa");
		this.casillas[14] = crearCasillas.crearCasillaCalle(14,"Calle Fuencarral",160,"Rosa");
		this.casillas[15] = crearCasillas.crearCasillaEstacion(15,"Estacion Anden 9 y 3/4",200);
		this.casillas[16] = crearCasillas.crearCasillaCalle(16,"Av. Felipe II",180,"Naranja");
		this.casillas[17] = crearCasillas.crearCasillaArcaComunal(17,this);
		this.casillas[18] = crearCasillas.crearCasillaCalle(18,"Calle Velazquez",180,"Naranja");
		this.casillas[19] = crearCasillas.crearCasillaCalle(19,"Calle Goya",200);
		this.casillas[20] = crearCasillas.crearCasillaParking(20);	
		this.casillas[21] = crearCasillas.crearCasillaCalle(21,"Av. de America",220,"Rojo");
		this.casillas[22] = crearCasillas.crearCasillaSuerte(22,this);		
		this.casillas[23] = crearCasillas.crearCasillaCalle(23,"Calle Maria de Molina",220,"Rojo");
		this.casillas[24] = crearCasillas.crearCasillaCalle(24,"Calle Cea Bermudez",240,"Rojo");
		this.casillas[25] = crearCasillas.crearCasillaEstacion(25,"Estacion Tren Transsiberian",200);
		this.casillas[26] = crearCasillas.crearCasillaCalle(26,"Av. de los Reyes Catolicos",260,"Amarillo");
		this.casillas[27] = crearCasillas.crearCasillaCalle(27,"Calle Bailen",260,"Amarillo");
		this.casillas[28] = crearCasillas.crearCasillaImpuesto(28,"Impuesto de aguas",150,0);				
		this.casillas[29] = crearCasillas.crearCasillaCalle(29,"Plaza de España",280,"Amarillo");		
		this.casillas[30] = crearCasillas.crearCasillaVeACarcel(30,10,this);		
		this.casillas[31] = crearCasillas.crearCasillaCalle(31,"Puerta del Sol",300,"Verde");
		this.casillas[32] = crearCasillas.crearCasillaCalle(32,"Calle Alcala",300,"Verde");
		this.casillas[33] = crearCasillas.crearCasillaArcaComunal(33,this);
		this.casillas[34] = crearCasillas.crearCasillaCalle(34,"Gran Via",320,"Verde");
		this.casillas[35] = crearCasillas.crearCasillaEstacion(35,"Estacion del Tren de los sueños",200);
		this.casillas[36] = crearCasillas.crearCasillaSuerte(36,this);
		this.casillas[37] = crearCasillas.crearCasillaCalle(38,"Paseo de la Castellana",360,"Morado");	
		this.casillas[38] = crearCasillas.crearCasillaImpuesto(38,"Impuesto de lujo",100,0);
		this.casillas[39] = crearCasillas.crearCasillaCalle(39,"Paseo del Prado",400,"Morado");

	}
	

	this.desplazar=function(ficha,posicion){
		var nuevaPosicion=ficha.getPosicion()+posicion;
		if (nuevaPosicion >=40){
			ficha.saldo=ficha.saldo+200;
			console.log("Pasas por la Salida. +200 PELOTIS PARA TI!");
			console.log("Tu saldo ahora es de "+ficha.saldo);
			nuevaPosicion = nuevaPosicion-40;
		};
	return nuevaPosicion;
	}

	this.mover=function(ficha,posicion){
		var nuevaPosicion = this.desplazar(ficha,posicion);
		ficha.cae(this.casillas[nuevaPosicion]);
	}
	crearCasillas = new CrearCasillas();
	this.iniciarNormal();
	this.iniciarTablero();
	this.configurarTablero(this);
}


function Normal(){
	this.titulo="Normal";
		this.cae=function(ficha){
		console.log("Casilla normal");
	}
}

function Salida(){
	this.nombre="Salida";
		this.cae=function(ficha){
	}
}

function Suerte(tablero){
	this.nombre="Suerte!";
		this.cae=function(ficha){
		console.log("Que Suerte!");
		this.tarjeta=new tarjetas(ficha,tablero);
	}
}

function ArcaComunal(tablero){
	this.nombre="Arca Comunal";
		this.cae=function(ficha){
			console.log("Arca Comunal.");
			this.tarjeta=new tarjetas(ficha,tablero);
	}
}

function Impuesto(nombre,precio,porcentaje){
	this.nombre=nombre;
	this.titulo="Impuesto";
	this.precio=precio;
	this.porcentaje=porcentaje;
		this.cae=function(ficha){
		console.log("Casilla de "+nombre);
		ficha.saldo = ficha.saldo-precio;
		console.log("Has pagado "+precio+" pelotis de impuesto. Tu saldo es "+ficha.saldo);
		if(ficha.saldo<=0){
				ficha.estado="perdedor";
				console.log("Has perdido. Termino el juego para ti.");
				ficha.compruebaFin();
			}
	}
}

function Estacion(nombre,precio){
	this.nombre=nombre;
	this.accion=undefined;
	this.titulo="Estacion";
	this.comprador=undefined;
	this.precio=precio;
		this.cae=function(ficha){
		console.log(nombre);
		if(this.comprador == undefined){
			//var respuesta=prompt("Quieres comprar esta estacion? [s/n]","");
				if(/*respuesta=="s" && */ficha.saldo>this.precio){
						this.comprador=ficha;
						ficha.asignarCompra(ficha,this);
						ficha.saldo=ficha.saldo-this.precio;
						ficha.estaciones=ficha.estaciones+1;
						console.log("La estacion ahora pertenece a la ficha "+ficha.forma+" y tiene un saldo de "+ficha.saldo);
				} else {
				console.log("Quizas a la proxima.");	
			}
		}
		if (this.comprador!=undefined && this.comprador!=ficha){
			this.accion="AlTren";
			this.aPagar=new CalculoPago(this.precio,this.accion,this.casas,this.hotel,this.comprador.estaciones);
			ficha.saldo=ficha.saldo-this.aPagar.cantidad;
			this.comprador.saldo=this.comprador.saldo+this.aPagar.cantidad;
			console.log("Caiste en la estacion de otro jugador. Tu saldo es de "+ficha.saldo);
			if(ficha.saldo<=0){
				ficha.estado="perdedor";
				console.log("Has perdido. Termino el juego para ti.");	
				ficha.compruebaFin();
			}
		}
	}
}
//////utilizar comand para implementr las tarjetas de suerte y arca comunal
////implementar una "caja" que tiene tarjetas con acciones:  avanzar, retroceder, multa, premio...

function Parking(){
	this.nombre="Parking gratuito";
		this.cae=function(ficha){
		console.log("Estas en el Parking del Monopoly.");
	}
}

function Carcel(){
	this.nombre="Carcel";
		this.cae=function(ficha){
		console.log("Has caido en la Carcel. Pasas un turno encarcelado...");
		ficha.encarcelado=1;
	}
}

function VeACarcel(distanciaacarcel,tablero){
	this.nombre="Ve a la carcel";
	this.veacarcel=distanciaacarcel;
		this.cae=function(ficha){
		console.log("Te han arrestado y te llevan a la Carcel.");
		tablero.mover(ficha,-20);
	}
}

function Calle(nombre,precio,color){
	this.nombre=nombre;
	this.precio=precio;
	this.color=color;
	this.edificable=false;
	this.casas=0;
	this.hotel=0;
	this.comprador=undefined;
		this.cae=function(ficha){
		console.log(nombre);
		if(this.comprador == undefined){
			/*var respuesta=prompt("Quieres comprar esta calle por "+precio+" pelotis? [s/n]","");*/
				if(/*respuesta=="s" && */ficha.saldo>precio){
						this.comprador=ficha;
						ficha.asignarCompra(ficha,this);
						ficha.saldo=ficha.saldo-precio;
						console.log("La calle ahora pertenece a la ficha "+ficha.forma+" y tiene un saldo de "+ficha.saldo);
						var contador=0;
						for(i in ficha.compras){
							if(ficha.compras[i].color==this.color)
								contador++;
						}
						if(contador==3){
							console.log("Has completado el grupo "+this.color);
							for(i in ficha.compras)
							if(ficha.compras[i].color==this.color){
								ficha.compras[i].edificable=true;
							}
						}
				} else {
				console.log("Quizas a la proxima.");	
			}
		}

		if (this.comprador!=undefined && this.comprador!=ficha){
			this.accion="Alquiler";	
			this.aPagar=new CalculoPago(precio,this.accion,this.casas,this.hotel,this.comprador.estaciones);
			ficha.saldo=ficha.saldo-this.aPagar.cantidad;
			this.comprador.saldo=this.comprador.saldo+this.aPagar.cantidad;
			console.log("Caiste en la calle de otro jugador. Tu saldo es de "+ficha.saldo);
			if(ficha.saldo<=0){
				ficha.estado="perdedor";
				console.log("Has perdido. Termino el juego para ti.");	
				ficha.compruebaFin();
			}
		}
	}
}

function CalculoPago(precio,accion,casas,hotel,estaciones){
	if(accion=="Casa"){
		casas++;
		this.cantidad=30*casas;
	}
	if(accion=="Hotel"){
		hotel++;
		this.cantidad=150;
	}
	if (accion=="Alquiler"){
		this.cantidad=precio-50;
	}
	if (accion=="AlTren"){
		this.cantidad=(25*estaciones)+25;
	}

}

function Dado(){
	this.nombre = "Dado de 6 caras";
	this.Tirar=function(){
		return Math.round(Math.random()*5+1);
	}
	this.Tirar2dados=function(){
		return this.Tirar()+this.Tirar();
	}
};

function tarjetas(ficha,tablero){
	this.multa=function(){
		console.log("La tarjeta dice: Debes pagar una multa de 100 pelotis.");
		ficha.saldo=ficha.saldo-100;
		console.log("Tu saldo ahora es de "+ficha.saldo);
		if(ficha.saldo<=0){
				ficha.estado="perdedor";
				console.log("Has perdido. Termino el juego para ti.");	
				ficha.compruebaFin();
			}
	}
	this.premio=function(){
		console.log("La tarjeta dice: Te ha tocado un premio de 100 pelotis.");
		ficha.saldo=ficha.saldo+100;
		console.log("Tu saldo ahora es de "+ficha.saldo);
		
	}
	this.avanzar=function(){
		console.log("La tarjeta dice: Avanzas 2 posiciones.");
		tablero.mover(ficha,2);
		
	}
	this.retroceder=function(){
		console.log("La tarjeta dice: Retrocedes 2 posiciones.");
		tablero.mover(ficha,-2);
	}
	this.detenido=function(){
		console.log("La tarjeta dice: Te han detenido.");
		var hastacarcel=39-ficha.getPosicion()+10;
		tablero.mover(ficha,hastacarcel);
	}

	if(tablero.nTarjeta>4)
		tablero.nTarjeta=0;
		switch(tablero.nTarjeta){
		case 0: 
			tablero.nTarjeta++;
			this.multa();
			break;
		case 1:
			tablero.nTarjeta++;
			this.avanzar(); 
			break;
		case 2: 
			tablero.nTarjeta++;
			this.premio();
			break;
		case 3:
			tablero.nTarjeta++;
			this.detenido();
			break; 
		case 4:
			tablero.nTarjeta++;
			this.retroceder();
			break;
	}
	
}


module.exports.FactoryJuego = FactoryJuego;
module.exports.Partida = Partida;
module.exports.Jugador = Jugador;
module.exports.Ficha = Ficha;
module.exports.Dado = Dado;
module.exports.Tablero = Tablero;
 
