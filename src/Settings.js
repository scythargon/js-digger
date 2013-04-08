"use strict";
function Settings(){}
Settings.prototype.animation_speed = 400;
Settings.prototype.animation_type_fall = 'linear';
Settings.prototype.cells_x = 10;
Settings.prototype.cells_y = 10;
	
var DEBUG_LVL = 5;
function debug(lvl, what){
	if(lvl>=DEBUG_LVL){
		console.log('Debug['+lvl+']: '+what);
	}
};

var G = null;

function setG(arg){
    console.log('G setted');
    G = arg;
}