var url = "http://127.0.0.1:1337/";
var formaFicha=["Barco","Dedal"];
var posiciones=[];
var coord=[];
var fichas={lista:formaFicha}
var maxX=0;
var maxY=0;
var ctx=undefined;
var img=undefined;

socket.on("turno",function(msg){
	mirarTurno($.cookie("uid"));
})

//Funciones de comunicacion con API REST

function jugador(nombre){
	
	$.getJSON(url+'jugador/'+nombre,function(data){
		nombre=data.nombre;
		ficha=data.ficha;
		posicion=data.posicion;
		mostrarDatos(data.nombre,data.uid,data.ficha,data.posicion);
		guardarCookies(data);
	})
}
	
//Funciones de control de la iteracion
function borrarCookies(){
	$.removeCookie("nombre");
	$.removeCookie("ficha");
	$.removeCookie("uid");
	$.removeCookie("posicion");
}

function guardarCookies(jugador){
	$.cookie("nombre",jugador.nombre);
	$.cookie("ficha",jugador.ficha);
	//$.cookie("forma",jugador.ficha.forma);
	$.cookie("uid",jugador.uid);
	$.cookie("posicion",jugador.celda);	
}

function altaJugador(){
	borrarCookies();
	$("#nuevoJug").append("<p id='zonaAlta'><label>Nombre de usuario: </label><input id='input' type='text'/><button id='altaJug'><b>Aceptar</b></button></p>");
	
	$('#altaJug').on("click",function(){
		jugador($("#input").val());
		$('#nuevoJug').remove();
	})
}

function mostrarBotonEmpezar(uid){
	$('#zonaBotones').remove();
	$('#nuevoJug').remove();
	$('#datos').append("<p id='zonaBotones'><button id='empezar'><b>Empezar</b></button></p>");
	$('#empezar').on("click",function(){
		aJugar(uid);
	}	)
	
}
function aJugar(uid){
	$.getJSON(url+"empezar/"+uid,function(data){ 
	$('#zonaDatos').remove();
		if(data.nombre!="Incompleta."){
			console.log("Empieza el juego!");
			inicio();
			if(data.nombre=="No es tu turno")
				$('#datos').append("<p id='zonaDatos'>No es tu turno.</p>")
			else
				$('#datos').append("<p id='zonaDatos'>El turno es del jugador "+data.nombre+"</p>");
			$('#zonaBotones').remove();
			$('#zonaDatos').remove();
			mostrarBotones(data.res);
		} else
			$('#datos').append("<p id='zonaDatos'>Partida incompleta. Esperando jugadores...</p>");
	})
}

function mostrarBotones(uidJugador){
	$('#zonaBotones').remove();
	
	$('#datos').append("<p id='zonaBotones'><button id='lanzar'><b>Lanzar dado</b></button><p><button id='comprar'><b>Comprar propiedad</b></button></p><p><button id='edificarMarron'><b>Edificar Marron</b></button><button id='edificarAzul'><b>Edificar Azul</b></button><button id='edificarRosa'><b>Edificar Rosa</b></button><button id='edificarNaranja'><b>Edificar Naranja</b></button></p><p><button id='edificarRojo'><b>Edificar Rojo</b></button><button id='edificarAmarillo'><b>Edificar Amarillo</b></button><button id='edificarVerde'><b>Edificar Verde</b></button><button id='edificarMorado'><b>Edificar Morado</b></button></p><p><button id='turno'><b>Cambiar turno</b></button></p></p>");
	$('#zonaDatos').remove();
	
	$('#lanzar').on("click",function(){
		$.getJSON(url+'lanzar/'+uidJugador,function(data){
			if(data.res=="Ya lanzaste.")
				mostrarDialogo(data.res);
			if(data.res=="No es tu turno.")
				mostrarDialogo(data.res);
			if(data.res=="Eres el ganador!"){
				mostrarDialogo("El juego ha terminado. "+data.res+"!!");
				$('#zonaBotones').remove();
			}
			if(data.res=="El juego ha terminado."){
				mostrarDialogo("Has caido en la casilla "+data.posicion+" y debes pagar. "+data.res+" El ganador es "+data.nombre+"!!");
				$('#zonaBotones').remove();
			}
			if(data.res=="Has agotado tu dinero."){
				$('#zonaBotones').remove();
			}
			if(data.res=="carcel"){
				mostrarDialogo("El jugador "+data.nombre+" ha caido en la Carcel.");
				$('#datos').append("<p id='zonaCarcel'><button id='dobles'><b>Lanzar dobles</b></button><button id='tarjetaSalir'><b>Usar tarjeta</b></button><button id='fianza'><b>Pagr fianza</b></button></p>");
			}
				
			if(data.res==-1)
				mostrarDialogo("El jugador "+data.nombre+" esta en la casilla "+data.posicion+".");
			if(data.tarjeta==true)
				mostrarDialogo(data.texto);
			
			if(data.res==0)
				mostrarDialogo("El jugador "+data.nombre+" ha caido en "+data.posicion+" y debe pagar. Su saldo es "+data.saldo);
			$.cookie("posicion",data.celda);	
			ponerFicha();
	} )})
	
	$('dobles').on("click",function(){
		$.getJSON(url+'dobles/'+uidJugador,function(data){
			if(data.res==0)
				mostrarDialogo("Sales de la carcel!");
			$('#zonaCarcel').remove();
		})
	})
	$('tarjetaSalir').on("click",function(){
		$.getJSON(url+'tarjetaSalir/'+uidJugador,function(data){
			if(data.res==1)
				mostrarDialogo("Sales de la carcel!");
			$('#zonaCarcel').remove();
		})
	})
$('fianza').on("click",function(){
		$.getJSON(url+'fianza/'+uidJugador,function(data){
		
		})
	})
	
	
		$('#comprar').on("click",function(){
		$.getJSON(url+'comprar/'+uidJugador,function(data){
			if(data.res=="Primero debes lanzar.")
				mostrarDialogo(data.res);
			if(data.res=="No es tu turno.")
				mostrarDialogo(data.res);	
			if(data.res=="No tienes dinero suficiente.")
				mostrarDialogo(data.res);
			if(data.res=="No puedes comprar esa casilla.")
				mostrarDialogo(data.res);
			if(data.res==-1)
				mostrarDialogo("El jugadador "+data.nombre+" compra la "+data.posicion+". Su saldo es de "+data.saldo+".");
			if(data.res==0)
				mostrarDialogo("Esa propiedad ya tiene dueño.");
		} )
		})
		
	$('#turno').on("click",function(){
		$('#zonaCarcel').remove();
		$.getJSON(url+'turno/'+uidJugador,function(data){
			if (data.res=="No puedes pasar turno sin lanzar.")
				mostrarDialogo(data.res);
			 else if (data.res=="No es tu turno.")
				mostrarDialogo(data.res);
			else{
				mostrarDialogo("El jugadador "+data.nombre+" tiene el turno ahora.");
				$.cookie("turno",data.turno);
			}
		})
	})
	
	$('#edificarMarron').on("click",function(){
		$.getJSON(url+'edificarMarron/',function(data){
			$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
		})
	})
	
	$('#edificarAzul').on("click",function(){
		$.getJSON(url+'edificarAzul/',function(data){
			$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
		})
	})
	
	$('#edificarRosa').on("click",function(){
		$.getJSON(url+'edificarRosa/',function(data){
			$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
		})
	})
	
	$('#edificarNaranja').on("click",function(){
		$.getJSON(url+'edificarNaranja/',function(data){
			$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
		})
	})
	
	$('#edificarRojo').on("click",function(){
		$.getJSON(url+'edificarRojo/',function(data){
			$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
		})
	})
	
	$('#edificarAmarillo').on("click",function(){
		$.getJSON(url+'edificarAmarillo/',function(data){
			$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
		})
	})
	
	$('#edificarVerde').on("click",function(){
		$.getJSON(url+'edificarVerde/',function(data){
			$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
		})
	})
	
	$('#edificarMorado').on("click",function(){
		$.getJSON(url+'edificarMorado/',function(data){
			$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
		})
	})
	
}

function mirarTurno(uid){
		$.getJSON(url+'mirar/'+uid,function(data){
			if (data.res=="metoca")
				mostrarDialogo("Tu turno.");
		}
	)}

function mostrarDatos(jugador,uid,ficha,posicion){
	$('#zonaDatos').remove();
	if(jugador=="Lo siento")
		$('#datos').append("<p id='zonaDatos'>Lo siento, no tienes ficha para jugar.</p>");
	else{
		mostrarBotonEmpezar(uid);
		$('#datos').append("<p id='zonaDatos'>Nombre: "+jugador+" Ficha: "+ficha+" Posicion: "+posicion+"</p>");
	}
}

function mostrarDialogo(texto){
	$("#zonaDialogo").remove();
	$("#dialog").append("<p id='zonaDialogo'>"+texto+"</p>");
	$("#dialog").dialog({
		show:"blind",
		hide:{effect:"explode",duration:1000},
		dialogClass:"dialog-class"
	})
}

//Interfaz y movimiento de fichas

function inicio(){
	cargarTablero();
	cargarCoordenadas();
	posiciones["Barco"]=20;
	cargarFichas(2,ponerFicha);
}

function cargarTablero(){
	var canvas=document.getElementById("micanvas");
	ctx=canvas.getContext("2d");
	maxX=canvas.width;
	maxY=canvas.height;
	img=new Image();
	img.src="client/img/tablero.png";
	ctx.drawImage(img,0,0);
	img.onload=function(){
		ctx.drawImage(img,0,0);
	}
}

function cargarCoordenadas(){
	for(i=0;i<40;i++) coord[i]=[];
	inc1=70;
	inc=40;
	coord[0].push(maxX-inc1)
	coord[0].push(maxY-inc1);
	coord[1].push(coord[0][0]-55)
	coord[1].push(coord[0][1]);
	coord[2].push(coord[1][0]-inc)
	coord[2].push(coord[1][1]);
	coord[3].push(coord[2][0]-inc-5)
	coord[3].push(coord[2][1]);
	coord[4].push(coord[3][0]-inc)
	coord[4].push(coord[3][1]);
	coord[5].push(coord[4][0]-inc)
	coord[5].push(coord[4][1]);
	coord[6].push(coord[5][0]-inc-15)
	coord[6].push(coord[5][1]);
	coord[7].push(coord[6][0]-inc)
	coord[7].push(coord[6][1]);
	coord[8].push(coord[7][0]-inc)
	coord[8].push(coord[7][1]);
	coord[9].push(coord[8][0]-inc)
	coord[9].push(coord[8][1]);
	coord[10].push(coord[9][0]-inc-25)
	coord[10].push(coord[9][1]);
	
	coord[11].push(coord[10][0])
	coord[11].push(coord[10][1]-inc-10);
	coord[12].push(coord[11][0])
	coord[12].push(coord[11][1]-inc);
	coord[13].push(coord[12][0])
	coord[13].push(coord[12][1]-inc-5);
	coord[14].push(coord[13][0])
	coord[14].push(coord[13][1]-inc-15);
	coord[15].push(coord[14][0])
	coord[15].push(coord[14][1]-inc);
	coord[16].push(coord[15][0])
	coord[16].push(coord[15][1]-inc);
	coord[17].push(coord[16][0])
	coord[17].push(coord[16][1]-inc);
	coord[18].push(coord[17][0])
	coord[18].push(coord[17][1]-inc-5);
	coord[19].push(coord[18][0])
	coord[19].push(coord[18][1]-inc-5);
	coord[20].push(coord[19][0])
	coord[20].push(coord[19][1]-inc-25);
	
	coord[21].push(coord[20][0]+inc+25)
	coord[21].push(coord[20][1]);
	coord[22].push(coord[21][0]+inc+5)
	coord[22].push(coord[21][1]);
	coord[23].push(coord[22][0]+inc)
	coord[23].push(coord[22][1]);
	coord[24].push(coord[23][0]+inc)
	coord[24].push(coord[23][1]);
	coord[25].push(coord[24][0]+inc)
	coord[25].push(coord[24][1]);
	coord[26].push(coord[25][0]+inc+10)
	coord[26].push(coord[25][1]);
	coord[27].push(coord[26][0]+inc)
	coord[27].push(coord[26][1]);
	coord[28].push(coord[27][0]+inc)
	coord[28].push(coord[27][1]);
	coord[29].push(coord[28][0]+inc)
	coord[29].push(coord[28][1]);
	coord[30].push(coord[29][0]+inc+15)
	coord[30].push(coord[29][1]);

	coord[31].push(coord[30][0])
	coord[31].push(coord[30][1]+inc+25);
	coord[32].push(coord[31][0])
	coord[32].push(coord[31][1]+inc+5);
	coord[33].push(coord[32][0])
	coord[33].push(coord[32][1]+inc+15);
	coord[34].push(coord[33][0])
	coord[34].push(coord[33][1]+inc);
	coord[35].push(coord[34][0])
	coord[35].push(coord[34][1]+inc);
	coord[36].push(coord[35][0])
	coord[36].push(coord[35][1]+inc);
	coord[37].push(coord[36][0])
	coord[37].push(coord[36][1]+inc);
	coord[38].push(coord[37][0])
	coord[38].push(coord[37][1]+inc);
	coord[39].push(coord[38][0])
	coord[39].push(coord[38][1]+inc);
}

function cargarFichas(numJug,callback){
	var cont=0;
	for(var i=0;i<numJug;i++){
		var forma=formaFicha[i];
		var imag=new Image();
		imag.src="client/img/"+forma+".png";
		fichas.lista[forma]=imag;
		ctx.drawImage(fichas.lista[forma],maxX,maxY,50,50);
		fichas.lista[forma].onload=function(){
			if (++cont>=numJug){
				callback();
			}
		}
	}	
}

function ponerFicha(){
	var x,y;
	var forma=$.cookie("ficha");
	var posicion=parseInt($.cookie("posicion"));
	console.log(forma+" "+posicion);
	ctx.drawImage(img,0,0)
	if (posicion>=0 && posicion<40){
		x=coord[posicion][0];
		y=coord[posicion][1];
		ctx.drawImage(fichas.lista[forma],x,y,40,40);
	}
}