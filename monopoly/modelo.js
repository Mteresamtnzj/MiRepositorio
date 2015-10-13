function Tablero(numeroCasillas){
	this.casillas=[]
	this.numeroCasillas=numeroCasillas
	this.agregarCasilla=function(posicion,casilla){
			this.casillas[posicion]=casilla
	}
	this.iniciarTablero=function(){
		for(i=0;i<numeroCasillas;i++){
			this.casillas[i]= new Casilla(new Normal())
		}
	}
	this.configurarTablero=function(){
		this.agregarCasilla(0,new Casilla(new Salida))
		this.agregarCasilla(1,new Casilla(new Calle("marron","Ronda de Valencia",60)))
		this.agregarCasilla(2,new Casilla(new ArcaComunal))
		this.agregarCasilla(3,new Casilla(new Calle("marron","Plaza de Lavapies",60)))
		this.agregarCasilla(4,new Casilla(new Impuesto("Impuesto sobre el capital",200,10)))
		this.agregarCasilla(5,new Casilla(new Estacion("Estacion del Tren de Media Noche",200)))
		this.agregarCasilla(6,new Casilla(new Calle("azul","Glorieta Cuatro Caminos",100)))
		this.agregarCasilla(7,new Casilla(new Suerte))
		this.agregarCasilla(8,new Casilla(new Calle("azul","Av. Reina Victoria",100)))
		this.agregarCasilla(9,new Casilla(new Calle("azul","Calle Bravo Murillo",120)))
		this.agregarCasilla(10,new Casilla(new Carcel))
		this.agregarCasilla(11,new Casilla(new Calle("rosa","Glorieta de Bilbao",140)))
		this.agregarCasilla(12,new Casilla(new Impuesto("Impuesto de electricidad",150,0)))
		this.agregarCasilla(13,new Casilla(new Calle("rosa","Calle Alberto Aguilera",140)))
		this.agregarCasilla(14,new Casilla(new Calle("rosa","Calle Fuencarral",160)))
		this.agregarCasilla(15,new Casilla(new Estacion("Estacion Anden 9 y 3/4",200)))
		this.agregarCasilla(16,new Casilla(new Calle("naranja","Av. Felipe II",180)))
		this.agregarCasilla(17,new Casilla(new ArcaComunal))
		this.agregarCasilla(18,new Casilla(new Calle("naranja","Calle Velazquez",180)))
		this.agregarCasilla(19,new Casilla(new Calle("naranja","Calle Goya",200)))
		this.agregarCasilla(20,new Casilla(new Parking))
		this.agregarCasilla(21,new Casilla(new Calle("rojo","Av. de America",220)))
		this.agregarCasilla(22,new Casilla(new Suerte))
		this.agregarCasilla(23,new Casilla(new Calle("rojo","Calle Maria de Molina",220)))
		this.agregarCasilla(24,new Casilla(new Calle("rojo","Calle Cea Bermudez",240)))
		this.agregarCasilla(25,new Casilla(new Estacion("Estacion Tren Transsiberian",200)))
		this.agregarCasilla(26,new Casilla(new Calle("amarillo","Av. de los Reyes Catolicos",260)))
		this.agregarCasilla(27,new Casilla(new Calle("amarillo","Calle Bailen",260)))
		this.agregarCasilla(28,new Casilla(new Impuesto("Impuesto de aguas",150,0)))
		this.agregarCasilla(29,new Casilla(new Calle("amarillo","Plaza de España",280)))
		this.agregarCasilla(30,new Casilla(new veACarcel))
		this.agregarCasilla(31,new Casilla(new Calle("verde","Puerta del Sol",300)))
		this.agregarCasilla(32,new Casilla(new Calle("verde","Calle Alcala",300)))
		this.agregarCasilla(33,new Casilla(new ArcaComunal))
		this.agregarCasilla(34,new Casilla(new Calle("verde","Gran Via",320)))
		this.agregarCasilla(35,new Casilla(new Estacion("Estacion del Tren de los sueños",200)))
		this.agregarCasilla(36,new Casilla(new Suerte))
		this.agregarCasilla(37,new Casilla(new Calle("morado","Paseo de la Castellana",360)))
		this.agregarCasilla(38,new Casilla(new Impues("Impuesto de lujo",100,0)))
		this.agregarCasilla(39,new Casilla(new Calle("morado","Paseo del Prado",400)))
	}
	this.iniciarTablero()
}

function Casilla(tema){
	this.tema=tema
	this.obtenerTema=function(){
		
	}
}

function Normal(){
	this.nombre="Normal"
}

function Salida(){
	this.nombre="Salida"
}

function Carcel(){
	this.nombre="Carcel"
}

function Parking(){
	this.nombre="Parking Gratuito"
}

function veACarcel(){
	this.nombre="Ve a la carcel"
}

function Estacion(nombre, precio){
	this.nombre=nombre
	this.precio=precio
}

function ArcaComunal(){
	this.nombre="Arca comunal"
}

function Suerte(){
	this.nombre="Suerte"
}

function Impuesto(nombre,precio,porcentaje){
	this.nombre=nombre
	this.precio=precio
	this.porcentaje=porcentaje
}

function Calle(color,nombre,precio){
	this.nombre=nombre
	this.color=color
	this.precio=precio
}

function iniJuego(){
	tablero = new Tablero(40)
	tablero.configurarTablero()
}