"use strict";
function Settings(){}
Settings.prototype.animation_speed = 400;
Settings.prototype.animation_type_fall = 'linear';
Settings.prototype.animation_type = 'linear';
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


Array.prototype.isInversed = function ( arr )
{

    if ( this.length != arr.length )
        throw new Error( "Arrays' lengths are not equal!" );

    var i = 0;

    for ( i = 0; i < arr.length; i++ )
    {
        if ( this[ i ] != -arr[ i ] )
            return false;
    };

    return true;

};


Array.prototype.getInversed = function ( )
{

    var ret = [];
    var i = 0;

    for ( i = 0; i < this.length; i++ )
    {
        ret.push( -this[i]);
    };

    return ret;

};


Array.prototype.getRidOf = function ( obj )
{

    var ret = [];
    var i = 0;

    for ( i = 0; i < this.length; i++ )
    {
        if ( this[i].toString() != obj.toString() )
            ret.push( this[i] );
    };

    return ret;

}
