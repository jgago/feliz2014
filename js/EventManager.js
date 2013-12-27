'use strict';

function EventManager(){
  this.touchdown = 0;
  this.touchup = 0;
  this.currentEvents =  
                [mouseDown,mouseXY,touchDown,touchXY,touchUp,mouseUp,touchUp];
  this.canX;
  this.canY;
  this.canvas;
}

EventManager.prototype.addEventsListeners = function(){
  this.canvas.addEventListener("mousedown", this.currentEvents[0], true);
  this.canvas.addEventListener("mousemove", this.currentEvents[1], false);
  this.canvas.addEventListener("touchstart", this.currentEvents[2], false);
  this.canvas.addEventListener("touchmove", this.currentEvents[3], true);
  this.canvas.addEventListener("touchend", this.currentEvents[4], false);
  document.body.addEventListener("mouseup", this.currentEvents[5], false);
}

EventManager.prototype.removeEventsListeners = function(){
  this.canvas.removeEventListener("mousedown", this.currentEvents[0], false);
  this.canvas.removeEventListener("mousemove", this.currentEvents[1], false);
  this.canvas.removeEventListener("touchstart", this.currentEvents[2], false);
  this.canvas.removeEventListener("touchmove", this.currentEvents[3], true);
  this.canvas.removeEventListener("touchend", this.currentEvents[4], false);
  document.body.removeEventListener("mouseup", this.currentEvents[5], false);
}

EventManager.prototype.isTouchDown = function(){
  return (this.touchdown == 1);
}

EventManager.prototype.isTouchUp = function(){
  if(this.touchup == 0) return false;
  else{ this.touchup = 0; return true; }
}

/*************EVENT LISTENERS***************/
function mouseUp() {
  EM.touchup = 1;
  EM.touchdown = 0;
  mouseXY();
}

function touchUp() {
  EM.touchup = 1;
  EM.touchdown = 0;
  touchXY();
}

function mouseDown() {
  EM.touchup = 0;
  EM.touchdown = 1;
  mouseXY();
}

function touchDown() {
  EM.touchup = 0;
  EM.touchdown = 1;
  touchXY();
}

function mouseXY(e) {
  EM.canX = e.pageX - EM.canvas.offsetLeft;
  EM.canY = e.pageY - EM.canvas.offsetTop;
}

function touchXY(e) {
  e.preventDefault();
  EM.canX = e.targetTouches[0].pageX - EM.canvas.offsetLeft;
  EM.canY = e.targetTouches[0].pageY - EM.canvas.offsetTop;
}

var EM=new EventManager();