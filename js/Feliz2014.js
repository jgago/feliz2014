'use strict';

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
        		return decodeURI( vrs[x].split('=')[1] ).toUpperCase();
        		break;
        	}
        }
	}
	catch(err){
		return "A TODOS";
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
	
	regalo=new ElementoEscenario(canvas.width/2-128,canvas.height/2-128,256,256,"imagenes/gift.png");
	polaroid=new ElementoEscenario(canvas.width/2-128,canvas.height/2-200,256,256,"imagenes/polaroid.png");
		
	foto=new ElementoEscenario(canvas.width/2-177,canvas.height/2+20,160,160,"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/s160x160/313154_452229201483704_149734729_a.jpg");
	
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
		ctx.clearRect(0,0,canvas.width, canvas.height);
		if(estado<13){
			regalo.render();
		}
		
		if(estado==0){
			ctx.font="Italic 20px Comic Sans MS";
			ctx.fillStyle="yellow";

			if(canvas.className==="a todos"){
				ctx.fillText("¡¡Ohhhhh!! ¡Un regalito! ¿Qué será?",canvas.width/2,regalo.y+regalo.height+50,canvas.width-40);
			}else{
				ctx.fillText("¡¡Ohhhhh!! ¡Un regalito para "+canvas.className+"! ¿Qué será?",canvas.width/2,regalo.y+regalo.height+50,canvas.width-40);
			}
		}else if (estado<13){
			polaroid.render();
			if(estado===1){
				ctx.font="Italic 20px Comic Sans MS";
				ctx.fillStyle="yellow";
				ctx.fillText("¡Pero si es una Cámara! ¿Qué tal unas fotitos?",canvas.width/2,regalo.y+regalo.height+50,canvas.width-40);
			}
		}else{
			ctx.font="Bold 60px Lucida Handwriting";
			
			if(parpadeo===0){
				colorMensaje="#"+Math.floor(Math.random()*16777215).toString(16);
			}
			
			parpadeo++;
			parpadeo=parpadeo%10;

			ctx.fillStyle=colorMensaje;
			ctx.fillText("¡Feliz Navidad "+canvas.className+"!",canvas.width/2,canvas.height/2,canvas.width-40);
			
			ctx.font="Bold Italic 15px Comic Sans MS";
			ctx.fillStyle="yellow";
			ctx.fillText("Pulsa en la foto para ampliar",canvas.width/2,canvas.height-20,canvas.width/2);
		}
		
		ctx.font="Bold Italic 5px Lucida Handwriting";
		
		if(estado>=4){
			ctx.fillStyle="white";
			ctx.fillRect(foto.x-2,foto.y-2,140,100);
			ctx.fillStyle="black";
			ctx.fillText("¡Feliz 2014!",foto.x+68,foto.y+foto.height+10,130);
			foto.render();
		}
		
		if(estado>=7){
			ctx.fillStyle="white";
			ctx.fillRect(fotos[1].x-2,fotos[1].y-2,140,100);
			ctx.fillStyle="black";
			ctx.fillText(fotos[1].mensaje,fotos[1].x+68,fotos[1].y+fotos[1].height+10,130);
			fotos[1].render();
		}
		
		if(estado>=10){
			ctx.fillStyle="white";
			ctx.fillRect(fotos[2].x-2,fotos[2].y-2,140,100);
			ctx.fillStyle="black";
			ctx.fillText(fotos[2].mensaje,fotos[2].x+68,fotos[2].y+fotos[2].height+10,130);
			fotos[2].render();
		}
		
		if(estado>=13){
			ctx.fillStyle="white";
			ctx.fillRect(fotos[3].x-2,fotos[3].y-2,140,100);
			ctx.fillStyle="black";
			ctx.fillText(fotos[3].mensaje,fotos[3].x+68,fotos[3].y+fotos[3].height+10,130);
			fotos[3].render();
		}
		
		ctx.font="Bold Italic 20px Lucida Handwriting";
		
		if(estado===3){
			ctx.fillStyle="white";
			ctx.fillRect(foto.x-10,foto.y-10,374,280);
			ctx.fillStyle="black";
			ctx.fillText("¡Feliz 2014!",foto.x+177,foto.y+foto.height+40,270);
			foto.render();
		}else if(estado===6){
			ctx.fillStyle="white";
			ctx.fillRect(fotos[1].x-10,fotos[1].y-10,374,280);
			ctx.fillStyle="black";
			ctx.fillText(fotos[1].mensaje,fotos[1].x+177,fotos[1].y+fotos[1].height+40,270);
			fotos[1].render();
		} else if(estado===9){
			ctx.fillStyle="white";
			ctx.fillRect(fotos[2].x-10,fotos[2].y-10,374,280);
			ctx.fillStyle="black";
			ctx.fillText(fotos[2].mensaje,fotos[2].x+177,fotos[2].y+fotos[2].height+40,270);
			fotos[2].render();
		} else if(estado===12){
			ctx.fillStyle="white";
			ctx.fillRect(fotos[3].x-10,fotos[3].y-10,374,280);
			ctx.fillStyle="black";
			ctx.fillText(fotos[3].mensaje,fotos[3].x+177,fotos[3].y+fotos[3].height+40,270);
			fotos[3].render();
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
		}else if ((estado===1)&&(EM.canX>=polaroid.x+45)&&(EM.canX<=polaroid.x+80)&&(EM.canY>=polaroid.y+140)&&(EM.canY<=polaroid.y+170)){
			flash=1;
			estado=2;
			soundCameraClick.play();
		}else if ((estado===3)&&(fotos[0].tocado(EM.canX,EM.canY))){
			fotos[0].x=2;
			fotos[0].y=2;
			fotos[0].width=136;
			fotos[0].height=80;
			estado=4;
		} else if ((estado===4)&&(EM.canX>=polaroid.x+45)&&(EM.canX<=polaroid.x+80)&&(EM.canY>=polaroid.y+140)&&(EM.canY<=polaroid.y+170)){
			flash=1;
			estado=5;
			soundCameraClick.play();
		} else if ((estado===6)&&(fotos[1].tocado(EM.canX,EM.canY))){
			fotos[1].x=2;
			fotos[1].y=canvas.height-110;
			fotos[1].width=136;
			fotos[1].height=80;
			estado=7;
		} else if ((estado===7)&&(EM.canX>=polaroid.x+45)&&(EM.canX<=polaroid.x+80)&&(EM.canY>=polaroid.y+140)&&(EM.canY<=polaroid.y+170)){
			flash=1;
			estado=8;
			soundCameraClick.play();
		} else if ((estado===9)&&(fotos[2].tocado(EM.canX,EM.canY))){
			fotos[2].x=canvas.width-138;
			fotos[2].y=2;
			fotos[2].width=136;
			fotos[2].height=80;
			estado=10;
		} else if ((estado===10)&&(EM.canX>=polaroid.x+45)&&(EM.canX<=polaroid.x+80)&&(EM.canY>=polaroid.y+140)&&(EM.canY<=polaroid.y+170)){
			flash=1;
			estado=11;
			soundCameraClick.play();
		} else if ((estado===12)&&(fotos[3].tocado(EM.canX,EM.canY))){
			fotos[3].x=canvas.width-138;
			fotos[3].y=canvas.height-110;
			fotos[3].width=136;
			fotos[3].height=80;
			estado=13;
		} else if(estado>=13){
			for(var i=0;i<4;i++){
				if(fotos[i].tocado(EM.canX,EM.canY)){
					open(fotos[i].sprite.src);
				}
			}
		}
	}
	
	if(flash>0){
		flash++;
	}
	
	if(flash>4){
		flash=0;
		estado++;
	}
}

window.onload = main;