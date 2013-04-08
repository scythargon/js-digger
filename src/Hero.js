function Hero(x, y) {
    this.setDom($('#hero'));
    this.initx = x;
    this.inity = y;
    this.setXY(x, y);
    this.dom.isMoving = false;
    this.hungry = true;

    this.reset = function () {
        this.$dom.offset(bf.getCellOffset(this.initx, this.inity));
        this.setXY(this.initx, this.inity);
    }
    this.reset();
}

Hero.prototype = Unit.prototype;
