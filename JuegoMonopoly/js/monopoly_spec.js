describe("El juego del Monopoly...",function(){


describe("Dado",function(){
	beforeEach(function(){
		tablero=new Tablero(40);
		dado=new Dado();
	});


describe("Las casillas del tablero...", function(){
	it("Tiramos los dados y el resultado es entre 2 y 12",function(){
	dado=new Dado();
	for(i=0;i<100;i++){
		var res=dado.tirar2dados();
		expect(res).toBeGreaterThan(1);
		expect(res).toBeLessThan(13);
		
	}}
	)
	
})
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
	
