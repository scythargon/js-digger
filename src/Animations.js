/**
 * Created with JetBrains WebStorm.
 * User: argon
 * Date: 4/11/13
 * Time: 4:40 PM
 * To change this template use File | Settings | File Templates.
 */



var Animations = function() {

    this.turnRight = function() {
        $(this.dom).css('transform', '');
    };

    this.reset = this.turnRight;

    this.turnLeft = function() {
        $(this.dom).css('transform', 'scale(-1,1)');
    };

    this.turnUp = function() {
        $(this.dom).css('transform', 'rotate(-90deg)');
    };

    this.turnDown = function() {
        $(this.dom).css('transform', 'rotate(90deg)');
    };

    this.initFrames = function( frames ) {
        this.frames = frames;
    };

    this.interval = null;
    this.frameSpeed = 100;
    this.frameNum = 0;

    this.startAnimation = function(){
        clearInterval( this.interval );
        this.interval = setInterval( this.nextFrame, this.frameSpeed, this);
    };

    this.stopAnimation = function(){
        clearInterval( this.interval );
    };

    this.nextFrame = function( animated ){
        animated.frameNum++;
        if ( animated.frameNum >= animated.frames.length )
            animated.frameNum = 0;

        $(animated.dom).css('background-image', 'url(' + animated.frames[ animated.frameNum] + ')');

    };

    return this;
};