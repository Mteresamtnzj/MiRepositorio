function Partida(tablero, coleccionFichas,numeroJugadores){
	this.tablero = tablero;
	this.coleccionFichas=coleccionFichas;
	this.coleccionJugadores=[];
	this.numeroJugadores=numeroJugadores;
	this.turno=undefined;
	this.dado=new Dado();
	this.fase=new FaseInicial(this);
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
			console.log("No hay m�s fichas.");
		}
		
	};
	this.cambiarTurno=function(jugador){
		var indice=this.coleccionJugadores.indexOf(jugador);
		var siguienteIndice=(indice+1)%(this.coleccionJugadores.length);
		//antes de pasar el turno al otro jugador, vamos a comprobar si est� encarcelado
		//si est� encarcelado, no cambiamos el turno pero decremento el contador de retenci�n
		if(this.coleccionJugadores[siguienteIndice].ficha.encarcelado==0){
			this.setTurno(this.coleccionJugadores[siguienteIndice]);
			jugador.turno=new NoMeToca();
		}
		else{
			this.coleccionJugadores[siguienteIndice].ficha.encarcelado--;
            this.cambiarTurno(this.coleccionJugadores[siguienteIndice])
		}
	}
	
		this.setTurno=function(jugador){
		this.turno=jugador;
		jugador.turno=new EsMiTurno(tablero);
}
}

function EsMiTurno(tablero){
		this.lanzar=function(jugador){
	    var numero=Math.round(Math.random()*5+1);
		jugador.tirada=numero;
		console.log("Dado: "+numero);
		tablero.mover(jugador.ficha,numero);
	}
}

function NoMeToca(){
	this.lanzar=function(jugador){
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
}


function Jugador(nombre,juego){
	this.nombre=nombre;
	this.turno=new NoMeToca();
	
	this.ficha=undefined;
	this.juego=juego;
	this.asignarFicha=function(){
		this.juego.fase.asignarFicha(this);
	}
	this.lanzar=function(){
		if(this.ficha.estado=="operativa")
	juego.fase.lanzar(this);
	else if(this.ficha.estado=="perdedor")
		console.log("No puedes seguir jugando porque ya has perdido.");
	}
	this.cambiarTurno=function(){
		this.juego.cambiarTurno(this);
	}
}

function Ficha(forma){
	this.forma=forma;
	this.saldo=1500;
	this.libre=true;
	this.compras=[];
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
	this.asignarCompra=function(ficha,calle){
		ficha.compras[c]=calle;
		c++;
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
	var distanciaacarcel=19;
	this.crearCasillaNormal=function(posicion){
		return new Casilla(posicion,new Normal());
	}
	
	this.crearCasillaSalida=function(posicion){
		return new Casilla(posicion,new Salida());
	}
	this.crearCasillaArcaComunal=function(posicion){
		return new Casilla(posicion,new ArcaComunal());
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
	this.crearCasillaSuerte=function(posicion){
		return new Casilla(posicion,new Suerte());
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
		this.casillas[1] = crearCasillas.crearCasillaCalle(1,"Ronda de Valencia",60,"Marr�n");		
		this.casillas[2] = crearCasillas.crearCasillaArcaComunal(2);
		this.casillas[3] = crearCasillas.crearCasillaCalle(3,"Plaza de Lavapi�s",60,"Marr�n");
		this.casillas[4] = crearCasillas.crearCasillaImpuesto(4,"Impuesto sobre el capital",200,10);		
		this.casillas[5] = crearCasillas.crearCasillaEstacion(5,"Estaci�n del tren de media noche",200);
		this.casillas[6] = crearCasillas.crearCasillaCalle(6,"Glorieta Cuatro Caminos",100,"Azul");
		this.casillas[7] = crearCasillas.crearCasillaSuerte(7);
		this.casillas[8] = crearCasillas.crearCasillaCalle(8,"Av. Reina Victoria",100,"Azul");
		this.casillas[9] = crearCasillas.crearCasillaCalle(9,"Calle Bravo Murillo",120,"Azul");
		this.casillas[10] = crearCasillas.crearCasillaCarcel(10);				
		this.casillas[11] = crearCasillas.crearCasillaCalle(11,"Glorieta de Bilbao",140,"Rosa");		
		this.casillas[12] = crearCasillas.crearCasillaImpuesto(12,"Impuesto de electricidad",150,0);		
		this.casillas[13] = crearCasillas.crearCasillaCalle(13,"Calle Alberto Aguilera",140,"Rosa");
		this.casillas[14] = crearCasillas.crearCasillaCalle(14,"Calle Fuencarral",160,"Rosa");
		this.casillas[15] = crearCasillas.crearCasillaEstacion(15,"Estacion Anden 9 y 3/4",200);
		this.casillas[16] = crearCasillas.crearCasillaCalle(16,"Av. Felipe II",180,"Naranja");
		this.casillas[17] = crearCasillas.crearCasillaArcaComunal(17);
		this.casillas[18] = crearCasillas.crearCasillaCalle(18,"Calle Velazquez",180,"Naranja");
		this.casillas[19] = crearCasillas.crearCasillaCalle(19,"Calle Goya",200);
		this.casillas[20] = crearCasillas.crearCasillaParking(20);	
		this.casillas[21] = crearCasillas.crearCasillaCalle(21,"Av. de America",220,"Rojo");
		this.casillas[22] = crearCasillas.crearCasillaSuerte(22);		
		this.casillas[23] = crearCasillas.crearCasillaCalle(23,"Calle Maria de Molina",220,"Rojo");
		this.casillas[24] = crearCasillas.crearCasillaCalle(24,"Calle Cea Bermudez",240,"Rojo");
		this.casillas[25] = crearCasillas.crearCasillaEstacion(25,"Estacion Tren Transsiberian",200);
		this.casillas[26] = crearCasillas.crearCasillaCalle(26,"Av. de los Reyes Catolicos",260,"Amarillo");
		this.casillas[27] = crearCasillas.crearCasillaCalle(27,"Calle Bailen",260,"Amarillo");
		this.casillas[28] = crearCasillas.crearCasillaImpuesto(28,"Impuesto de aguas",150,0);				
		this.casillas[29] = crearCasillas.crearCasillaCalle(29,"Plaza de Espa�a",280,"Amarillo");		
		this.casillas[30] = crearCasillas.crearCasillaVeACarcel(30,10,tablero);		
		this.casillas[31] = crearCasillas.crearCasillaCalle(31,"Puerta del Sol",300,"Verde");
		this.casillas[32] = crearCasillas.crearCasillaCalle(32,"Calle Alcala",300,"Verde");
		this.casillas[33] = crearCasillas.crearCasillaArcaComunal(33);
		this.casillas[34] = crearCasillas.crearCasillaCalle(34,"Gran Via",320,"Verde");
		this.casillas[35] = crearCasillas.crearCasillaEstacion(35,"Estacion del Tren de los sue�os",200);
		this.casillas[36] = crearCasillas.crearCasillaSuerte(36);
		this.casillas[37] = crearCasillas.crearCasillaCalle(38,"Paseo de la Castellana",360,"Morado");	
		this.casillas[38] = crearCasillas.crearCasillaImpuesto(38,"Impuesto de lujo",100,0);
		this.casillas[39] = crearCasillas.crearCasillaCalle(39,"Paseo del Prado",400,"Morado");

	}
	

	this.desplazar=function(ficha,posicion){
		var nuevaPosicion=ficha.getPosicion()+posicion;
		if (nuevaPosicion > 39){
			nuevaPosicion = nuevaPosicion-39;
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
		ficha.cambiarTurno();
	}
}

function Salida(){
	this.nombre="Salida";
		this.cae=function(ficha){
		ficha.saldo=ficha.saldo+200;
		console.log("Casilla de Salida. +200 PELOTIS PARA TI!");
		console.log("Tu saldo ahora es de "+ficha.saldo);
		ficha.cambiarTurno();
	}
}

function ArcaComunal(){
	this.nombre="Arca Comunal";
		this.cae=function(ficha){
		console.log("Arca Comunal.");
		ficha.cambiarTurno();
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
				console.log("Has perdido. Termin� el juego para ti.");	
			}
		ficha.cambiarTurno();
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
			var respuesta=prompt("Quieres comprar esta estaci�n? [s/n]","");
				if(respuesta=="s" && ficha.saldo>precio){
						this.comprador=ficha.forma;
						ficha.asignarCompra(ficha,this.nombre);
						ficha.saldo=ficha.saldo-precio;
						console.log("La estaci�n ahora pertenece a la ficha "+ficha.forma+" y tiene un saldo de "+ficha.saldo);
				} else {
				console.log("Quiz�s a la pr�xima.");	
			}
		}
		if (this.comprador!=undefined && this.comprador!=ficha.forma){
			this.accion="AlTren";
			this.aPagar=new CalculoPago(precio,this.accion,this.casas,this.hotel);
			ficha.saldo=ficha.saldo-this.aPagar.cantidad;
			console.log("Caiste en la estaci�n de otro jugador. Tu saldo es de "+ficha.saldo);
			if(ficha.saldo<=0){
				ficha.estado="perdedor";
				console.log("Has perdido. Termin� el juego para ti.");	
			}
		}
		
		
		ficha.cambiarTurno();
	}
}

function Suerte(){
	this.nombre="Suerte!";
		this.cae=function(ficha){
		console.log("Que Suerte!");
		ficha.cambiarTurno();
	}
}

function Parking(){
	this.nombre="Parking gratuito";
		this.cae=function(ficha){
		console.log("Est�s en el Parking del Monopoly.");
		ficha.cambiarTurno();
	}
}

function Carcel(){
	this.nombre="Carcel";
		this.cae=function(ficha){
		console.log("Has ca�do en la C�rcel. Pasas un turno encarcelado...");
		ficha.encarcelado=1;
		ficha.cambiarTurno();
	}
}

function VeACarcel(distanciaacarcel,tablero){
	this.nombre="Ve a la carcel";
	this.veacarcel=distanciaacarcel;
		this.cae=function(ficha){
		console.log("Te han arrestado y te llevan a la C�rcel.");
		tablero.mover(ficha,19);
		ficha.cambiarTurno();
	}
}

function Calle(nombre,precio,color){
	this.nombre=nombre;
	this.precio=precio;
	this.color=color;
	this.casas=0;
	this.hotel=0;
	this.yaPaso=false;
	this.comprador=undefined;
		this.cae=function(ficha){
		console.log(nombre);
		if(this.comprador == undefined){
			var respuesta=prompt("Quieres comprar esta calle? [s/n]","");
				if(respuesta=="s" && ficha.saldo>precio){
						this.comprador=ficha.forma;
						ficha.asignarCompra(ficha,this.nombre);
						ficha.saldo=ficha.saldo-precio;
						console.log("La calle ahora pertenece a la ficha "+ficha.forma+" y tiene un saldo de "+ficha.saldo);
					this.yaPaso=true;
				} else {
				console.log("Quiz�s a la pr�xima.");	
			}
		}
		if(this.comprador==ficha.forma && this.casas<4 && this.yaPaso==false){
			var respuesta=prompt("Quieres poner una casa? [s/n]","");
				if(respuesta=="s"){
					this.accion="Casa";
					this.aPagar=new CalculoPago(precio,this.accion,this.casas,this.hotel);
					if(ficha.saldo>this.aPagar.cantidad){
						this.casas++;
						ficha.saldo=ficha.saldo-aPagar.cantidad;
						console.log("Tu saldo es de "+ficha.saldo);
					}
				}else {
				console.log("Quiz�s a la pr�xima.");	
			} 
		}
		
		if (this.comprador!=undefined && this.comprador!=ficha.forma){
			this.accion="Alquiler";
			this.aPagar=new CalculoPago(precio,this.accion,this.casas,this.hotel);
			ficha.saldo=ficha.saldo-this.aPagar.cantidad;
			console.log("Caiste en la calle de otro jugador. Tu saldo es de "+ficha.saldo);
			if(ficha.saldo<=0){
				ficha.estado="perdedor";
				console.log("Has perdido. Termin� el juego para ti.");	
			}
		}
		this.yaPaso=false;
		ficha.cambiarTurno();
	}
}

function CalculoPago(precio,accion,casas,hotel){

	if (accion=="Alquiler"){
		this.cantidad=precio-50;
	}
	if (accion=="AlTren"){
		this.cantidad=50;
	}

}

function Dado(){
	this.nombre = "Dado de 6 caras"
	this.Tirar=function(){
		return Math.round(Math.random()*5+1);
	}
	this.Tirar2dados=function(){
		return this.Tirar()+this.Tirar()
	}
}