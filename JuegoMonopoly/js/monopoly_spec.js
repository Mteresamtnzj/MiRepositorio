describe("El juego del Monopoly",function(){


describe("Comprobar que las fichas se mueven por el tablero...",function(){
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
			expect(this.Jug1.ficha.compras[0]).toEqual("Ronda de Valencia");
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
	
		var juego;
	var coleccionFichas;
	var tablero;
	var jugador; 
	var dado;
	beforeEach(function(){
		this.tablero = new Tablero(40);
		this.coleccionFichas=[new Ficha("Carretilla"),new Ficha("Buque"),new Ficha("Saco"),new Ficha("Saco")];
		this.juego = new Partida(this.tablero, this.coleccionFichas);
	});

		it("...las casillas 2, 17 y 33 son Arcas Comunales",function(){
			expect(this.tablero.casillas[2].tema.nombre).toEqual("Arca Comunal");
			expect(this.tablero.casillas[17].tema.nombre).toEqual("Arca Comunal");
			expect(this.tablero.casillas[33].tema.nombre).toEqual("Arca Comunal");
		});

		it("...las casillas 4, 12, 28 y 38 tienen Impuestos",function(){
			expect(this.tablero.casillas[4].tema.titulo).toEqual("Impuesto");	
			expect(this.tablero.casillas[12].tema.titulo).toEqual("Impuesto");	
			expect(this.tablero.casillas[28].tema.titulo).toEqual("Impuesto");
			expect(this.tablero.casillas[38].tema.titulo).toEqual("Impuesto");	
		});

		it("...las casillas 5, 15, 25 y 35 son Estaciones",function(){
			expect(this.tablero.casillas[5].tema.titulo).toEqual("Estacion");
			expect(this.tablero.casillas[15].tema.titulo).toEqual("Estacion");
			expect(this.tablero.casillas[25].tema.titulo).toEqual("Estacion");
			expect(this.tablero.casillas[35].tema.titulo).toEqual("Estacion");
		});

		it("...las casillas 7, 22 y 36 son de Suerte",function(){
			expect(this.tablero.casillas[7].tema.nombre).toEqual("Suerte!");
			expect(this.tablero.casillas[22].tema.nombre).toEqual("Suerte!");
			expect(this.tablero.casillas[36].tema.nombre).toEqual("Suerte!");
		});

		it("...la casilla 10 tiene Cárcel",function(){
			expect(this.tablero.casillas[10].tema.nombre).toEqual("Carcel");
		});

		it("...la casilla 20 es un Parking",function(){
			expect(this.tablero.casillas[20].tema.nombre).toEqual("Parking gratuito");
		});
		it("...la casilla 30 te lleva a la Cárcel",function(){
			expect(this.tablero.casillas[30].tema.nombre).toEqual("Ve a la carcel");
		});
			
		})


		
		
		
})   
	
