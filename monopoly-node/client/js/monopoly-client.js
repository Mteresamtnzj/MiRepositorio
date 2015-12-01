var url = "http://127.0.0.1:1337/";


//Funciones de comunicacion con API REST

function jugador(nombre){
	$.getJSON(url+'jugador/'+nombre,function(data){
		nombre=data.nombre;
		ficha=data.ficha;
		posicion=data.posicion;
		mostrarDatos(data.nombre,data.uid,data.ficha,data.posicion);
		guardarCookies(data);
		//mostrarBotonEmpezar(data.uid);
	})
}
	
//Funciones de control de la iteracion

function guardarCookies(jugador){
	$.cookie("nombre",jugador.nombre);
	$.cookie("ficha",jugador.ficha);
	//$.cookie("turno":jugador.turno);
	//$.cookie("yaLanzo":jugador.yaLanzo);
	//$.cookie("juego":jugador.juego);
	$.cookie("uid",jugador.uid);
	$.cookie("posicion",jugador.posicion);	
}

function altaJugador(){
	$("#nuevoJug").append("<p id='zonaAlta'><label>Nombre de usuario: </label><input id='input' type='text'/><button id='altaJug'><b>Aceptar</b></button></p>");
	$('#altaJug').on("click",function(){
		jugador($("#input").val());
		$('#nuevoJug').remove();
		//mostrarBotonEmpezar();
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
	$('#datos').append("<p id='zonaBotones'><button id='lanzar'><b>Lanzar dado</b></button></p><button id='comprar'><b>Comprar propiedad</b></button></p><p><button id='edificarMarron'><b>Edificar Marron</b></button><button id='edificarAzul'><b>Edificar Azul</b></button><button id='edificarRosa'><b>Edificar Rosa</b></button><button id='edificarNaranja'><b>Edificar Naranja</b></button><button id='edificarRojo'><b>Edificar Rojo</b></button><button id='edificarAmarillo'><b>Edificar Amarillo</b></button><button id='edificarVerde'><b>Edificar Verde</b></button><button id='edificarMorado'><b>Edificar Morado</b></button></p><p><button id='turno'><b>Cambiar turno</b></button></p><p><button id='limpiar'><b>Limpiar mensajes</b></button></p>");
	$('#zonaDatos').remove();
	
	$('#lanzar').on("click",function(){
		$.getJSON(url+'lanzar/'+uidJugador,function(data){
			if(data.res=="Ya lanzaste.")
				$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
			if(data.res=="No es tu turno.")
				$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
			if(data.res=="Eres el ganador!"){
				$('#datos').append("<p id='zonaDatos'>El juego ha terminado. "+data.res+"</p>");
				$('#zonaBotones').remove();
			}
			if(data.res=="El juego ha terminado."){
				$('#datos').append("<p id='zonaDatos'>Has caido en la casilla "+data.posicion+" y debes pagar. "+data.res+" El ganador es "+data.nombre+"!!</p>");
				$('#zonaBotones').remove();
			}
			if(data.res=="Has agotado tu dinero."){
				$('#datos').append("<p id='zonaDatos'>Has caido en la casilla "+data.posicion+" y debes pagar. "+data.res+" El juego ha acabado para ti.</p>");
				$('#zonaBotones').remove();
			}
			if(data.res==-1)
				$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" esta en la casilla "+data.posicion+".</p>");
			if(data.res==0)
				$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" ha caido en "+data.posicion+" y debe pagar. Su saldo es "+data.saldo+"</p>");
	} )})
	
	
		$('#comprar').on("click",function(){
		$.getJSON(url+'comprar/'+uidJugador,function(data){
			if(data.res=="Primero debes lanzar.")
				$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
			if(data.res=="No es tu turno.")
				$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
			if(data.res=="No tienes dinero suficiente.")
				$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
			if(data.res=="No puedes comprar esa casilla.")
				$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
			if(data.res==-1)
				$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" compra la "+data.posicion+". Su saldo es de "+data.saldo+"</p>");
			if(data.res==0)
				$('#datos').append("<p id='zonaDatos'>Esa propiedad ya tiene dueño.</p>");
		} )
		})
		
	$('#turno').on("click",function(){
		$.getJSON(url+'turno/'+uidJugador,function(data){
			//$('#zonaDatos').remove();
			if (data.res=="No puedes pasar turno sin lanzar.")
				$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
			 else if (data.res=="No es tu turno.")
				$('#datos').append("<p id='zonaDatos'>"+data.res+"</p>");
			else
			$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" tiene el turno ahora.</p>");
		})
	})
	/*$('#turno').on("click",function(){
	$.getJSON(url+'turno/',function(data){
			$('#datos').append("<p id='zonaDatos'>El jugadador "+data.nombre+" tiene el turno ahora.</p>");
	})})*/
	
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
	
	$('#limpiar').on("click",function(){
		$('#zonaDatos').remove();
	})
	
	
}

function mostrarDatos(jugador,uid,ficha,posicion){
	$('#zonaDatos').remove();
	mostrarBotonEmpezar(uid);
	if(jugador=="Lo siento")
		$('#datos').append("<p id='zonaDatos'>Lo siento, no tienes ficha para jugar.</p>");
	else
		$('#datos').append("<p id='zonaDatos'>Nombre: "+jugador+" Ficha: "+ficha+" Posicion: "+posicion+"</p>");
}


