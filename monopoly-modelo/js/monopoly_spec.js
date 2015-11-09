describe("El juego del Monopoly",function(){

describe("Comprobando metodo FactoryJuego...",function(){
	beforeEach(function(){
		this.juego = new FactoryJuego();
		this.partida = this.juego.crearPartida();
	
	});
	it("...se crea el juego y estamos en la fase Inicial",function(){
		
		expect(this.partida.fase.nombre).toEqual("Inicial");
	})
})



describe("Comprobando funcionalidad del tablero...",function(){
	beforeEach(function(){
		this.tablero = new Tablero(40);
		this.coleccionFichas=[new Ficha("Perro"),new Ficha("Sombrero"),new Ficha("Coche")];
		this.juego = new Partida(this.tablero, this.coleccionFichas,3);
		this.Jug1=new Jugador("Jug1",this.juego);
		this.Jug1.asignarFicha();
		this.Jug2=new Jugador("Jug2",this.juego);
		this.Jug2.asignarFicha();
		this.Jug3=new Jugador("Jug3",this.juego);
		this.Jug3.asignarFicha();
		this.juego.setTurno(this.Jug1);
	});
		
		it("...la fichas se asignan a los jugadores",function(){
		
		expect(this.Jug1.ficha.forma).toEqual("Perro");
		expect(this.Jug2.ficha.forma).toEqual("Sombrero");
		expect(this.Jug3.ficha.forma).toEqual("Coche");
		
		
		})
		it("...la ficha del jugador 1 se mueve",function(){

			this.Jug1.lanzar();
			expect(this.Jug1.ficha.getPosicion()).toBeGreaterThan(0);
		});
			
		it("...el jugador compra la calle Ronda de Valencia",function(){
			this.tablero.mover(this.Jug1.ficha,1);
			expect(this.Jug1.ficha.compras[0].nombre).toEqual("Ronda de Valencia");
		});
		
		it("...el jugador cae en un Impuesto y su saldo baja 200 pelotis",function(){
			var pelotis = this.Jug1.ficha.saldo;
			this.tablero.mover(this.Jug1.ficha,4);
			expect(this.Jug1.ficha.saldo).toEqual(pelotis-200);
		});
			
		it("...el jugador cae en la Carcel desde la casilla 30",function(){
			this.tablero.mover(this.Jug1.ficha,30);
			expect(this.Jug1.ficha.getPosicion()).toEqual(10);
			
		});


		
		it("...el saldo del jugador aumenta 200 pelotis si pasa por la Salida",function(){

			var s2=this.Jug1.ficha.saldo;
			this.tablero.mover(this.Jug1.ficha,60);
			expect(this.Jug1.ficha.saldo).toEqual(s2+200);
		});
		
		
		it("...si otro jugador cae en la calle comprada Ronda de Valencia, lo que pasa es que su saldo decrementa por pagar alquiler (es decir, no puede comprarla)",function(){
			var s=this.Jug2.ficha.saldo;
			this.tablero.mover(this.Jug1.ficha,1);
			expect(this.Jug1.ficha.compras[0].nombre).toEqual("Ronda de Valencia");
			this.tablero.mover(this.Jug2.ficha,1);
			expect(this.Jug1.ficha.saldo).toBeLessThan(s);
			
		});
		
		it("...el jugador compra la calle Ronda de Valencia y  no puede poner casas si no tiene todas las calles del grupo",function(){
			this.tablero.mover(this.Jug1.ficha,1);
			expect(this.Jug1.ficha.compras[0].nombre).toEqual("Ronda de Valencia");
			this.Jug1.edificar(this.tablero.casillas[1].tema);
			expect(this.tablero.casillas[1].tema.casas).toEqual(0);
		});
		
		it("...el jugador compra la calle Ronda de Valencia y puede poner casas porque tiene todas las calles del grupo",function(){
			this.tablero.mover(this.Jug1.ficha,6);
			this.tablero.mover(this.Jug1.ficha,2);
			this.tablero.mover(this.Jug1.ficha,1);		
			this.tablero.mover(this.Jug2.ficha,2);	
			this.juego.setTurno(this.Jug1);
			this.Jug1.yaLanzo=true;
			this.Jug1.edificar(this.tablero.casillas[6].tema);
			expect(this.tablero.casillas[6].tema.casas).toEqual(1);
		});
		
		
		
		it("...el jugador intenta edificar en una calle que no es suya y no le deja",function(){
			this.Jug1.edificar(this.tablero.casillas[1].tema);
			expect(this.tablero.casillas[1].tema.casas).toEqual(0);
		});
		
		it("...el total a pagar aumenta cuantas más estaciones se tengan en propiedad, también verificamos que se alquilan",function(){
			
			this.tablero.mover(this.Jug1.ficha,5);
			var s1=this.Jug2.ficha.saldo;
			this.tablero.mover(this.Jug2.ficha,5);
			var c1=s1-this.Jug2.ficha.saldo;
			
			this.tablero.mover(this.Jug1.ficha,10);
			var s2=this.Jug2.ficha.saldo;
			this.tablero.mover(this.Jug2.ficha,10);
			var c2=s2-this.Jug2.ficha.saldo;
			
			expect(s2).toBeGreaterThan(c1);
			
		});
		
		it("...el jugador cae en dos casillas de Suerte o Arca comunal y saca tarjetas de multa y avanzar",function(){

			var s=this.Jug1.ficha.saldo;
			this.tablero.mover(this.Jug1.ficha,2);
			expect(this.Jug1.ficha.saldo).toEqual(s-100);
			this.tablero.mover(this.Jug1.ficha,15);
			expect(this.Jug1.ficha.getPosicion()).toEqual(19);
		});
		
		it("...el juego finaliza cuando solo queda un jugador con dinero",function(){
			this.Jug1.ficha.saldo=10;
			this.Jug2.ficha.saldo=10;
			this.tablero.mover(this.Jug1.ficha,4);
			this.tablero.mover(this.Jug2.ficha,4);
			expect(this.juego.fase.nombre).toEqual("Fin");
		});
		
		it("...el jugador usa la tarjeta para salir de la carcel",function(){
			this.tablero.mover(this.Jug1.ficha,10);
			expect(this.Jug1.ficha.encarcelado).toEqual(1);
			this.Jug1.ficha.tarjetaSalirCarcel=1;
			this.Jug1.ficha.salirDeCarcel();
			expect(this.Jug1.ficha.encarcelado).toEqual(0);
			
		});
		
		it("...el jugador saca dobles para salir de la carcel",function(){
			this.tablero.mover(this.Jug1.ficha,10);
			expect(this.Jug1.ficha.encarcelado).toEqual(1);
			this.Jug1.turno.doblesPrueba=true;
			this.Jug1.lanzar2();
			expect(this.Jug1.ficha.encarcelado).toEqual(0);
			
		});
		
		
		it("...si el jugador saca dobles puede volver a lanzar",function(){
			this.Jug1.turno.doblesPrueba=true;
			this.Jug1.lanzar2();
			var pos1=this.Jug1.ficha.getPosicion();
			if(pos1==10){
				this.Jug1.ficha.encarcelado=0;
				this.tablero.mover(this.Jug1.ficha,11);
				pos1=this.Jug1.ficha.getPosicion();
			}
			this.Jug1.turno.doblesPrueba=true;
			this.Jug1.lanzar2();
			var pos2=this.Jug1.ficha.getPosicion();
			if(pos2==10){
				this.Jug1.ficha.encarcelado=0;
				this.tablero.mover(this.Jug1.ficha,11);
				pos2=this.Jug1.ficha.getPosicion();
			}
			expect(pos1).toBeLessThan(pos2);
		});
	
		it("...si el jugador saca dobles 3 veces se va a la carcel",function(){
			this.Jug1.turno.doblesPrueba=true;
			this.Jug1.lanzar2();
			if(this.Jug1.ficha.getPosicion()==10){
				this.Jug1.ficha.encarcelado=0;
				this.tablero.mover(this.Jug1.ficha,11);
			}
			this.Jug1.turno.doblesPrueba=true;
			this.Jug1.lanzar2();
			if(this.Jug1.ficha.getPosicion()==10){
				this.Jug1.ficha.encarcelado=0;
				this.tablero.mover(this.Jug1.ficha,11);
			}
			this.Jug1.turno.doblesPrueba=true;
			this.Jug1.lanzar2();
			expect(this.Jug1.ficha.getPosicion()).toEqual(10);
		});
		
});


describe("Dado",function(){
		var juego;
	var coleccionFichas;
	var tablero;
	var jugador; 
	var dado;
	beforeEach(function(){
		tablero=new Tablero(40);
		dado=new Dado();
	});

	it("Tiramos los dados y el resultado es entre 2 y 12",function(){
	dado=new Dado();
	for(i=0;i<100;i++){
		var res=dado.Tirar2dados();
		expect(res).toBeGreaterThan(1);
		expect(res).toBeLessThan(13);		
	}}
	)
	
	
})


describe("Comprobar el tablero",function(){
	
	var coleccionFichas;
	var tablero;
	var jugador; 
	var dado;
	beforeEach(function(){
		this.juego = new FactoryJuego();
		this.partida = this.juego.crearPartida();
	});

		it("...las casillas 2, 17 y 33 son Arcas Comunales",function(){
			expect(this.partida.tablero.casillas[2].tema.nombre).toEqual("Arca Comunal");
			expect(this.partida.tablero.casillas[17].tema.nombre).toEqual("Arca Comunal");
			expect(this.partida.tablero.casillas[33].tema.nombre).toEqual("Arca Comunal");
		});

		it("...las casillas 4, 12, 28 y 38 tienen Impuestos",function(){
			expect(this.partida.tablero.casillas[4].tema.titulo).toEqual("Impuesto");	
			expect(this.partida.tablero.casillas[12].tema.titulo).toEqual("Impuesto");	
			expect(this.partida.tablero.casillas[28].tema.titulo).toEqual("Impuesto");
			expect(this.partida.tablero.casillas[38].tema.titulo).toEqual("Impuesto");	
		});

		it("...las casillas 5, 15, 25 y 35 son Estaciones",function(){
			expect(this.partida.tablero.casillas[5].tema.titulo).toEqual("Estacion");
			expect(this.partida.tablero.casillas[15].tema.titulo).toEqual("Estacion");
			expect(this.partida.tablero.casillas[25].tema.titulo).toEqual("Estacion");
			expect(this.partida.tablero.casillas[35].tema.titulo).toEqual("Estacion");
		});

		it("...las casillas 7, 22 y 36 son de Suerte",function(){
			expect(this.partida.tablero.casillas[7].tema.nombre).toEqual("Suerte!");
			expect(this.partida.tablero.casillas[22].tema.nombre).toEqual("Suerte!");
			expect(this.partida.tablero.casillas[36].tema.nombre).toEqual("Suerte!");
		});

		it("...la casilla 10 tiene Cárcel",function(){
			expect(this.partida.tablero.casillas[10].tema.nombre).toEqual("Carcel");
		});

		it("...la casilla 20 es un Parking",function(){
			expect(this.partida.tablero.casillas[20].tema.nombre).toEqual("Parking gratuito");
		});
		it("...la casilla 30 te lleva a la Cárcel",function(){
			expect(this.partida.tablero.casillas[30].tema.nombre).toEqual("Ve a la carcel");
		});
			
		})


		
		
		
})   
	
