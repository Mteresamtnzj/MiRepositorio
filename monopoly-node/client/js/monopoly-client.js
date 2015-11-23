var url = "http://127.0.0.1:1337/";


//Funciones de comunicacion con API REST

function jugador(nombre){
	$.getJSON(url+'jugador/'+nombre,function(data){
		nombre=data.nombre;
		ficha=data.ficha;
		posicion=data.posicion;
		mostrarDatos(data.nombre,data.uid,data.ficha,data.posicion);
		//guardarCookies(data);
	})
}
	
//Funciones de control de la iteracion
/*
function guardarCookies(jugador){
	$.cookie("nombre":jugador.nombre);
	$.cookie("ficha":jugador.ficha);
	$.cookie("turno":jugador.turno);
	$.cookie("yaLanzo":jugador.yaLanzo);
	$.cookie("juego":jugador.juego);
	$.cookie("uid":jugador.uid);
	$.cookie("tiradas":jugador.tiradas);	
}*/

function altaJugador(){
	$("#nuevoJug").append("<p id='zonaAlta'><label>Nombre de usuario: </label><input id='input' type='text'/><button id='altaJug'><b>Aceptar</b></button></p>");
	$('#altaJug').on("click",function(){
		jugador($("#input").val());
		$('#nuevoJug').remove();
		mostrarBotonEmpezar();
	})
}

function mostrarBotonEmpezar(){
	$('#zonaBotones').remove();
	$('#nuevoJug').remove();
	$('#datos').append("<p id='zonaBotones'><button id='empezar'><b>Empezar</b></button></p>");
	$('#empezar').on("click",function(){
		aJugar();
	}	)
	
}
function aJugar(){
	$.getJSON(url+"empezar/",function(data){ 
	$('#zonaDatos').remove();
		if(data.res!="Incompleta."){
			console.log("Empieza el juego!");
			if(data.nombre=="No es tu turno")
				$('#datos').append("<p id='zonaDatos'>No es tu turno.</p>")
			else
				$('#datos').append("<p id='zonaDatos'>El turno es del jugador "+data.nombre+"</p>");
			$('#zonaBotones').remove();
			$('#zonaDatos').remove();
			mostrarBotones(/*data.res*/);
		} else
			$('#datos').append("<p id='zonaDatos'>Partida incompleta. Esperando jugadores...</p>");
	})
}


function mostrarBotones(/*uidJugador*/){
	$('#zonaBotones').remove();
	$('#datos').append("<p id='zonaBotones'><button id='lanzar'><b>Lanzar dado</b></button><button id='edificar'><b>Edificar</b></button><button id='turno'><b>Cambiar turno</b></button></p>");
	//$('#lanzar').on("click",function(){
	/*	$.getJSON(url+'lanzar/'+uidJugador,function(data){
			$('#zonaDatos').remove();
			if(data.res=="No es tu turno."){
				$('#datos').append("<p id='zonaDatos'>No es tu turno.</p>");
			}
			else if (data.res=="Ya lanzaste."){
				$('#datos').append("<p id='zonaDatos'>Ya lanzaste.</p>");
			}else
				$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" esta en la posicion "+data.res+"</p>");
		})
	})*/
	$('#lanzar').on("click",function(){
		$.getJSON(url+'lanzar/',function(data){
			if(data.res=="Ya lanzaste.")
				$('#datos').append("<p id='zonaDatos'>Ya lanzaste.</p>");
			else
				$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" esta en la casilla "+data.posicion+".</p>");
	} )})
		
		/*$('#turno').on("click",function(){
		$.getJSON(url+'turno/'+uidJugador,function(data){
			$('#zonaDatos').remove();
			if (data.nombre=="No puedes pasar turno sin lanzar.")
				$('#datos').append("<p id='zonaDatos'>No puedes pasar turno sin lanzar.</p>");
			 else if (data.nombre=="No es tu turno.")
				$('#datos').append("<p id='zonaDatos'>No es tu turno.</p>");
			else
			$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" tiene el turno ahora.</p>");
		})
	})*/
	$('#turno').on("click",function(){
	$.getJSON(url+'turno/',function(data){
			$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" tiene el turno ahora.</p>");
	})})
	
	$('#edificar').on("click",function(){
	console.log("Edificando...");})
}

function mostrarDatos(jugador,uid,ficha,posicion){
	$('#zonaDatos').remove();
	if(jugador=="Lo siento")
		$('#datos').append("<p id='zonaDatos'>Lo siento, no tienes ficha para jugar.</p>");
	else
		$('#datos').append("<p id='zonaDatos'>Nombre: "+jugador+" Ficha: "+ficha+" Posicion: "+posicion+"</p>");
}

