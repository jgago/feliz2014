﻿'use strict';

var canvas = null;
var ctx = null;

var regalo=null;
var polaroid=null;
var foto=null;
var estado;
var interval;
var flash;
var soundCameraClick;
var soundOpenGift;
var parpadeo;
var colorMensaje;
var recargado;

function setFullScreen(){
	var w=window.innerWidth/canvas.width;
	var h=window.innerHeight/canvas.height;
	var scale=Math.min(h,w);

	canvas.style.width=(canvas.width*scale)+'px';
	canvas.style.height=(canvas.height*scale)+'px';
	canvas.style.position='fixed';
	canvas.style.left='50%';
	canvas.style.top='50%';
	canvas.style.marginLeft=-(canvas.width*scale)/2+'px';
	canvas.style.marginTop=-(canvas.height*scale)/2+'px';
}

function locationVars (vr){		
	try{
        var src = String( window.location.href ).split('?')[1];
        var vrs = src.split('&');
 
        for (var x = 0, c = vrs.length; x < c; x++) {
        	if (vrs[x].indexOf(vr) != -1){
        		return decodeURI( vrs[x].split('=')[1] );
        		break;
        	}
        }
	}
	catch(err){
		if(vr==='nombre'){
			return "a todos";
		}
		else{
			return "imagenes/polaroid.png";
		}
	}
}

function star(ctx, x, y, r, p, m){
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0,0-r);
    for (var i = 0; i < p; i++){
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - (r*m));
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - r);
    }
    ctx.fill();
    ctx.restore();
}

var main = function() {
	recargado=false;
	estado=0;
	flash=0;
	parpadeo=0;
	
	canvas = document.getElementById('canvas');

	// obtiene el contexto
	ctx = canvas.getContext('2d');
	
	// definimos la dimension del canvas. 
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	setFullScreen();
	
	regalo=new ElementoEscenario(canvas.width/2-100,canvas.height/2-100,200,200,"imagenes/gift.png");
	polaroid=new ElementoEscenario(canvas.width/2-100,canvas.height/2-150,200,200,"imagenes/polaroid.png");
	

	if(locationVars('img')===undefined){
		foto=new ElementoEscenario(canvas.width/2-80,canvas.height/2+20,160,160,"imagenes/polaroid.png");
	}else{
		foto=new ElementoEscenario(canvas.width/2-80,canvas.height/2+20,160,160,locationVars('img'));
	}
	
	ctx.textAlign="center";
	ctx.textBaseline="bottom";
	
	try{
		soundCameraClick=new Audio();
		soundCameraClick.src="sonidos/camera.mp3";
		
		soundOpenGift=new Audio();
		soundOpenGift.src="sonidos/abrirRegalo.mp3";
	}catch(err){
	}
	
	EM.canvas = canvas;
	EM.addEventsListeners();

	interval=setInterval(hilo_juego,100);
}

var hilo_juego=function(){
	render_juego();
	logica_juego();
}

var render_juego=function(){
	if(flash===0){
		ctx.fillStyle="red";
		ctx.fillRect(0,0,canvas.width, canvas.height);
		if(estado<13){
			regalo.render();
		}
		
		if(estado==0){
			ctx.font="Italic 15px Comic Sans MS";
			ctx.fillStyle="white";

			if(locationVars('nombre')==="a todos"){
				ctx.fillText("¡Tocame para abrirme!",canvas.width/2,regalo.y+regalo.height,canvas.width-40);
			}else{
				ctx.fillText("¡"+ locationVars('nombre') +", tocame para abrirme!",canvas.width/2,regalo.y+regalo.height,canvas.width-40);
			}
		}else if (estado<13){
			polaroid.render();
			if(estado===1){
				ctx.font="Italic 15px Comic Sans MS";
				ctx.fillStyle="white";
				ctx.fillText("¡Pero si es una Cámara! ¡Lanza una fotito!",canvas.width/2,regalo.y+regalo.height,canvas.width-40);
			}
		}else{
			ctx.font="Bold 30px Lucida Handwriting";
			
			if(parpadeo===0){
				colorMensaje="#"+Math.floor(Math.random()*16777215).toString(16);
			}
			
			parpadeo++;
			parpadeo=parpadeo%10;

			ctx.fillStyle=colorMensaje;
			ctx.fillText("¡Feliz año nuevo "+locationVars('nombre')+"!",canvas.width/2,canvas.height/2,canvas.width-40);
		}
		
		ctx.font="Bold Italic 15px Lucida Handwriting";
		
		if(estado===3){
			ctx.fillStyle="white";
			ctx.fillRect(foto.x-10,foto.y-10,180,200);
			ctx.fillStyle="black";
			ctx.fillText("¡Feliz 2014!",foto.x+80,foto.y+foto.height+20,180);
			foto.render();
		}
	}else{
		ctx.fillStyle="white";
		star(ctx, canvas.width/2, canvas.height/2-100, 200, 7, 0.5)
	}
}

var logica_juego=function(){
	
	if(EM.isTouchUp()) {
		if((estado===0)&&(regalo.tocado(EM.canX,EM.canY))){
			estado=1;
			soundOpenGift.play();
		}else if ((estado===1)&&(polaroid.tocado(EM.canX,EM.canY))){
			flash=1;
			estado=2;
			soundCameraClick.play();
		}
	}
	
	if(flash>0){
		flash++;
	}
	
	if(flash>4){
		flash=0;
		estado++;
	}
	
	if(((canvas.width!=window.innerWidth)||(canvas.height!=window.innerHeight))&&(!recargado)){
		recargado=true;
		clearInterval(interval);
		main();
	}
}

window.onload = main;