/**
 * Created with JetBrains WebStorm.
 * User: argon
 * Date: 4/9/13
 * Time: 6:24 PM
 * To change this template use File | Settings | File Templates.
 */

function Level(){}

Level.prototype.g = 1 << 0; // gold
Level.prototype.d = 1 << 1; // diamond
Level.prototype.r = 1 << 2; // rock
Level.prototype.h = 1 << 3; // hero-spawn
Level.prototype.e = 1 << 4; // enemy-spawn

Level.prototype.D = Level.prototype.r | Level.prototype.d; // rock + diamond
Level.prototype.G = Level.prototype.r | Level.prototype.g; // rock + gold


function Level1(){

    this.map = [
        [ this.r,    	, this.r, this.r, this.G, this.r, this.r, this.r,       , this.e ], // 0
        [ this.D,   	, this.G, this.D, this.D, this.r, this.D, this.r, 	    , this.r ], // 1
        [ this.D,   	, this.r, this.D, this.D, this.r, this.D, this.r, 	    , this.G ], // 2
        [ this.D,   	, this.r, this.D, this.D, this.G, this.D, this.r, 	    , this.r ], // 3
        [ this.D,   	,       , this.r, this.r, this.r, this.D, this.G, 	    , this.r ], // 4
        [ this.D, this.r,       ,       , this.r, this.r, this.r, this.r, 	    , this.D ], // 5
        [ this.r, this.r, this.r,       , this.r, this.G, this.r, this.r, 	    , this.D ], // 6
        [ this.r, this.r, this.r,       , 	    , this.r, this.r, this.r,     	, this.r ], // 7
        [ this.r, this.r, this.D, this.r, 	    ,       , this.h,   	, 	    , this.r ], // 8
        [ this.r, this.r, this.D, this.D, this.r, this.r, this.r, this.r, this.r, this.r ], // 9
    ]
};

Level1.prototype = Level.prototype;

var level1 = new Level1();