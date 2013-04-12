function Enemy ( respCoords ) {

    ObjectStack.push( this );

    this.x = respCoords[ 0 ];
    this.y = respCoords[ 1 ];

    var item = $( ".resources > .enemy" ).clone();
    item.appendTo( bf.dom );
    item.offset( bf.getCellOffset( this.x, this.y ) );
    this.dom = item;

    var bg_ind = Math.floor(Math.random() * 3) + 1;
    item.css('background-image', 'url(images/monster'+bg_ind+'_1.png)');
    this.initFrames(['images/monster'+bg_ind+'.png', 'images/monster'+bg_ind+'_1.png']);
    bf.addItems( this.x, this.y, item );

    this.hungry = false;
    this.speed = 800;
    this.link = 4; //could it walk only by horizontal/vertical lines?
    this.lastWalkDirection = [];

    this.walk();
}

Enemy.prototype.walk = function () {

    this.startAnimation();

    var possibleWalkDirections = this.getPossibleWalkDirections();

    possibleWalkDirections = possibleWalkDirections.getRidOf( this.lastWalkDirection.getInversed() );

    var ind = Math.floor(Math.random() * possibleWalkDirections.length);
    var newWalkDirection = possibleWalkDirections[ind];

    if ( typeof(newWalkDirection) === 'undefined' )
        newWalkDirection = this.lastWalkDirection.getInversed();

    this.lastWalkDirection = newWalkDirection;

    this.x += newWalkDirection[ 0 ];
    this.y += newWalkDirection[ 1 ];

    if ( newWalkDirection[ 0 ] < 0 )
        this.turnLeft();

    if ( newWalkDirection[ 0 ] > 0 )
        this.turnRight();

    if ( newWalkDirection[ 1 ] < 0 )
        this.turnUp();

    if ( newWalkDirection[ 1 ] > 0 )
        this.turnDown();

    this.dom.animate( {
        "left": "+=" + cell.width() * newWalkDirection[ 0 ] + "px",
        "top": "+=" + cell.height() * newWalkDirection[ 1 ] + "px"
        }, this.speed, settings.animation_type, function(){
            var enemy = ObjectStack.getObjByDom( this );
            if ( enemy != null )
                enemy.walk();
        }
    );

};

Enemy.prototype.getPossibleWalkDirections = function () {

    var ret = [];

    if ( ! bf.cellContains( this.x, this.y - 1, ".rock") ){         // top
        ret.push( [ 0 , -1 ]);
    };
    if ( ! bf.cellContains( this.x - 1, this.y, ".rock") ){         // left
        ret.push( [ - 1, 0 ]);
    };
    if ( ! bf.cellContains( this.x + 1, this.y, ".rock") ){         // right
        ret.push( [ 1, 0 ]);
    };
    if ( ! bf.cellContains( this.x, this.y + 1, ".rock") ){        // bottom
        ret.push( [ 0,  1 ]);
    };

    if( this.link == 8)
    {
        if ( ! bf.cellContains( this.x - 1, this.y - 1, ".rock") ){     // left top
            ret.push( [ - 1, - 1 ]);
        };
        if ( ! bf.cellContains( this.x + 1, this.y -1, ".rock") ){      // right top
            ret.push( [ 1, -1 ]);
        };
        if ( ! bf.cellContains( this.x - 1, this.y + 1, ".rock") ){    // left bottom
            ret.push( [ - 1, 1 ]);
        };
        if ( ! bf.cellContains( this.x + 1, this.y + 1, ".rock") ){    // right bottom
            ret.push( [ 1, 1 ]);
        };
    };

    return ret;

};


Animations.call(Enemy.prototype);