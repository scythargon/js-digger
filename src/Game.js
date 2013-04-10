    var settings = new Settings();

    var bf = new Battlefield(settings.cells_x, settings.cells_y);

    var hero = new Hero(1,1);
    hero.$dom.appendTo(bf.dom);

    var cell = $('#battlefield > table > tr:first > td:first');
    $('.unit').width(cell.width());
    $('.unit').height(cell.height());

    $('.gold, .gold-fallen').width(cell.width() / 2);
    $('.gold, .gold-fallen').height(cell.height() / 2);




    setInterval(gameLoop, 100);


    function gameLoop () {
        checkCollisionWithGold();
        checkGoldVsEnemy();
        checkHeroVsEnemy();
        getPressedKeys();
    }

    function checkGoldVsEnemy() {
        var collisions = $(".gold-falling").collision( ".enemy", { relative: "collider", obstacleData: "odata", colliderData: "cdata", directionData: "ddata", as: "<div/>" } )
        var hit_area = 0;
        try{
            for( var i=0; i<collisions.length; i++ )
            {
                var o = $(collisions[i]).data("odata");
                var c = $(collisions[i]).data("cdata");
                var d = $(collisions[i]).data("ddata");
                var cwith = $(o).get(0);
                var enemy = ObjectStack.getObjByDom(cwith);
                enemy.dom.remove();
                enemy.remove();
                ObjectStack.deleteObject( enemy );
            }
        } catch ( e ) {
            debug( 5, "already deleted" );
        }
    }

    function checkHeroVsEnemy() {
        var collisions = $( "#hero" ).collision( ".enemy", { relative: "collider", obstacleData: "odata", colliderData: "cdata", directionData: "ddata", as: "<div/>" } )
        var hit_area = 0;
        try{
            for( var i=0; i < collisions.length; i++ )
            {
                var o = $(collisions[i]).data( "odata" );
                var c = $(collisions[i]).data( "cdata" );
                var d = $(collisions[i]).data( "ddata" );
                var cwith = $(o).get(0);

                $( '#battlefield > .enemy' ).each( function() {
                    var enemy = ObjectStack.getObjByDom( this );
                    enemy.dom.remove();
                    enemy.remove();
                    ObjectStack.deleteObject( enemy );
                });

                hitHero();
            }
        } catch ( e ) {
            debug( 5, "already deleted" );
        }
    }

    function checkCollisionWithGold(){
        var collisions = $("#hero").collision( ".gold-falling", { relative: "collider", obstacleData: "odata", colliderData: "cdata", directionData: "ddata", as: "<div/>" } )
        var hit_area = 0;
        for( var i=0; i<collisions.length; i++ )
        {
            var o = $(collisions[i]).data("odata");
            var c = $(collisions[i]).data("cdata");
            var d = $(collisions[i]).data("ddata");
            var cwith = $(o).get(0).id;
            var cside = d;
            var snap  = $(c);
            var collided = $( collisions[ i ] );
            hit_area += collided.width() * collided.height();
        }


        if ( hit_area > ( cell.width() * cell.height() / 10 ) ) {
            debug( 5, hit_area );
            hitHero();
        }
    }
    function hitHero(){
        debug( 2, "hit hero" );
        var lives = parseInt($('#lives').html());
        lives--;
        $('#lives').html(lives);
        hero.reset();
    }

    function getPressedKeys() {
        var activeKeys = KeyboardJS.activeKeys();
        if ($.inArray("right", activeKeys) >= 0) {
            hero.move("right");
        }
        else if ($.inArray("left", activeKeys) >= 0) {
            hero.move("left");
        }
        else if ($.inArray("up", activeKeys) >= 0) {
            hero.move("up");
        }
        else if ($.inArray("down", activeKeys) >= 0) {
            hero.move("down");
        }
    }


    function tryPush(x, y, item) {
        if (item[0].x + x < 0 || item[0].x + x == settings.cells_x || item[0].y + y < 0 || item[0].y + y == settings.cells_y) {

            //return true;
        }
        var animation_speed = settings.animation_speed;
        var animation_type = settings.animation_type_fall;
        if (!(item[0].x + x < 0 || item[0].x + x == settings.cells_x || item[0].y + y < 0 || item[0].y + y == settings.cells_y))//если не граница
        {
            item.animate({"top": "+=" + cell.height() * y + "px", "left": "+=" + cell.width() * x + "px"}, {duration: animation_speed, easing: animation_type, complete: function () {
                bf.removeItems(item[0].x, item[0].y, item); //TODO OMG
                item.changeY(y);
                item.changeX(x);
                bf.addItems(item[0].x, item[0].y, item);
                if (bf.cellContains(item[0].x, item[0].y + 1, ".rock") == 0) {
                    debug(4,'tryPush');
                    item.fall();
                }
            }});
        }
        return true;
    }
    var Replace = null;
    var Fallen = null;
    //bf.generateRandomItems(0.2, 'rock');
    //bf.generateRandomItems(0.5, 'gem');
    //bf.generateRandomItems(0.8, 'gold');
    bf.loadLevel( level1 );
    //setInterval( createNewEnemy, level1.enemyRespTime * 1000);

    createNewEnemy();

    function createNewEnemy() {
        var E = new $().Enemy( bf.getRandomEnemyResp() );
    }

    function rand(arg) {
        return Math.random() > arg;
    }

    (function ($) {

        $.fn.changeX = function (x) {
            return this.each(function () {
                this.x += x;
            });
        };

        $.fn.changeY = function (y) {
            return this.each(function () {
                this.y += y;
            });
        };
        $.fn.fall = function () {
            debug(4,'FAAALLLL');
            var animation_speed = settings.animation_speed;
            var animation_type = settings.animation_type_fall;
            if (this.size() == 0) {
                debug(1, 'empty collection');
                return this;
            }
            var item = this;

            if ( bf.cellContains( item[0].x, item[0].y + 1, ".rock" ) == 0 ) {
                debug( 2, 'lets fall' );
                //item.effect("highlight", {color: 'red'}, 3000);

                item.addClass( 'gold-falling' );
                item.animate( { "top": "+=" + cell.height() + "px" }, { 
                    duration: animation_speed, 
                    easing: animation_type, 
                    queue: false, 

                    complete: function () {
                        var item = $(this);
                        bf.removeItems( item[0].x, item[0].y, item );
                        item.changeY( 1 );
                        debug( 3, 'OMFG ONE MORE TIME?!' );
                        bf.addItems( item[0].x, item[0].y, item );
                        debug( 0, 'add fallen' );
                        debug(4, 'from fall itself');//ЕБАНУТЬСЯ! потому что complete вызывается по количеству копий! 
                        item.fall();                //посмотреть в нем что является this
                    }
                }).effect( "pulsate", { times:3 }, animation_speed );//вот сюда запихать в очередь ченить
            } else {
                debug(2, 'there are rock under gold, do not fall');
                item.removeClass( 'gold-falling' );
                item.each(function () {
                    $item = $(this);
                    var fallen = $('.resources > .gold-fallen').clone();
                    fallen.offset($item.offset());
                    $item.replaceWith(fallen);
                    bf.addItems(item[0].x, item[0].y, fallen);
                });

                bf.removeItems(item[0].x, item[0].y, item);

            }
        };

    })(jQuery);
