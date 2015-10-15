function Partida(tablero, coleccionFichas,numeroJugadores){
	this.tablero = tablero;
	this.coleccionFichas=coleccionFichas;
	this.coleccionJugadores=[];
	this.numeroJugadores=numeroJugadores;

	this.asignarFicha=function(jugador){
		var enc=false;
		for(f in this.coleccionFichas){
			if (this.coleccionFichas[f].libre){
				enc=true;
				this.coleccionFichas[f].libre=false;
				this.coleccionFichas[f].casilla=this.tablero.casillas[1];
				this.coleccionFichas[f].asignarJugador(jugador);
				jugador.ficha=this.coleccionFichas[f];
				this.coleccionJugadores.push(jugador);
				break;
			}
		};
		if (!enc){
			console.log("Ya no quedan fichas libres");
		}
	};
}

function iniJuego(){
	this.crearTablero=function(){
		var tablero = new Tablero(40);
		return tablero;
	}
	this.crearFichas=function(){
		var coleccionFichas=[new Ficha("Carretilla"),new Ficha("Buque")];
		return coleccionFichas;
	}
	this.crearPartida=function(){
		return new Partida(this.crearTablero(),this.crearFichas(),2);
	}
}

function Jugador(nombre,juego){
	this.nombre=nombre;
	this.ficha=undefined;
	this.juego=juego;
}

function Ficha(forma){
	this.forma=forma;
	this.saldo=150000;
	this.libre=true;
	this.casilla=undefined;
	this.jugador=undefined;
	this.asignarJugador=function(jugador){
		this.jugador=jugador;
}
}

function Casilla(posicion, tema){
	this.posicion=posicion;
	this.tema=tema;
	this.tablero=undefined;

	this.asignarTablero=function(tablero){
		this.tablero=tablero;
	}
}

function CrearCasillas(){
	
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
	this.crearCasillaVeACarcel=function(posicion,casillacarcel){
		return new Casilla(posicion, new VeACarcel(casillacarcel));
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

	this.configurarTablero=function(){
		this.casillas[0] = crearCasillas.crearCasillaSalida(0);
		this.casillas[1] = crearCasillas.crearCasillaCalle(1,"Ronda de Valencia",60,"Marrón");		
		this.casillas[2] = crearCasillas.crearCasillaArcaComunal(2);
		this.casillas[3] = crearCasillas.crearCasillaCalle(3,"Plaza de Lavapiés",60,"Marrón");
		this.casillas[4] = crearCasillas.crearCasillaImpuesto(4,"Impuesto sobre el capital",200,10);		
		this.casillas[5] = crearCasillas.crearCasillaEstacion(5,"Estación del tren de media noche",200);
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
		this.casillas[29] = crearCasillas.crearCasillaCalle(29,"Plaza de España",280,"Amarillo");		
		this.casillas[30] = crearCasillas.crearCasillaVeACarcel(30,10);		
		this.casillas[31] = crearCasillas.crearCasillaCalle(31,"Puerta del Sol",300,"Verde");
		this.casillas[32] = crearCasillas.crearCasillaCalle(32,"Calle Alcala",300,"Verde");
		this.casillas[33] = crearCasillas.crearCasillaArcaComunal(33);
		this.casillas[34] = crearCasillas.crearCasillaCalle(34,"Gran Via",320,"Verde");
		this.casillas[35] = crearCasillas.crearCasillaEstacion(35,"Estacion del Tren de los sueños",200);
		this.casillas[36] = crearCasillas.crearCasillaSuerte(36);
		this.casillas[37] = crearCasillas.crearCasillaCalle(38,"Paseo de la Castellana",360,"Morado");	
		this.casillas[38] = crearCasillas.crearCasillaImpuesto(38,"Impuesto de lujo",100,0);
		this.casillas[39] = crearCasillas.crearCasillaCalle(39,"Paseo del Prado",400,"Morado");

	}
	crearCasillas = new CrearCasillas();
	this.iniciarNormal();
	this.iniciarTablero();
	this.configurarTablero();
}


function Normal(){
	this.titulo="Normal";
}

function Salida(){
	this.nombre="Salida";
}

function ArcaComunal(){
	this.nombre="Arca Comunal";
}

function Impuesto(nombre,precio,porcentaje){
	this.nombre=nombre;
	this.titulo="Impuesto";
	this.precio=precio;
	this.porcentaje=porcentaje;
}

function Estacion(nombre,precio){
	this.nombre=nombre;
	this.titulo="Estacion";
	this.precio=precio;
}

function Suerte(){
	this.nombre="Suerte!";
}

function Parking(){
	this.nombre="Parking gratuito";
}

function Carcel(){
	this.nombre="Carcel";
}

function VeACarcel(){
	this.nombre="Ve a la carcel";
}

function Calle(nombre,precio,color){
	this.nombre=nombre;
	this.precio=precio;
	this.color=color;
}

function Dado(){
	this.nombre = "Dado de 6 caras"
	this.tirar=function(){
		return Math.round(Math.random()*5+1);
	}
	this.tirar2dados=function(){
		return this.tirar()+this.tirar()
	}
}