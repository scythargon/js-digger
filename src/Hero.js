function Hero( respCoords ) {

    this.initx = respCoords[ 0 ];
    this.inity = respCoords[ 1 ];

    var item = $( ".resources > .hero" ).clone();
    item.appendTo( bf.dom );
    this.dom = item[0];
    this.$dom = item;
    this.dom.isMoving = false;
    this.hungry = true;
    ObjectStack.push( this );
    this.reset = function () {
        this.$dom.offset(bf.getCellOffset(this.initx, this.inity));
        this.setXY(this.initx, this.inity);
    }
    this.reset();
    this.initFrames(['images/digger1.png', 'images/digger1_1.png']);
}

Hero.prototype = Unit.prototype;

Animations.call(Hero.prototype);