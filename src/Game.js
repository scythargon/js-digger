    var settings = new Settings();

    var bf = new Battlefield(settings.cells_x, settings.cells_y);



    var cell = $('#battlefield > table > tr:first > td:first');
    var w = cell.width();
    var h = cell.height();
    var cell_size = Math.min(w,h);

    $('.unit').width(cell_size).height(cell_size);


    $('.gold > div').width(cell_size).height(cell_size);

    $('#battlefield').css('width', settings.cells_x*cell_size+'px').css('left', document.documentElement.clientWidth/2-settings.cells_x*cell_size/2+'px');
    //$('.gold, .gold-fallen').height(cell.height() / 2);

    //var hero = new Hero(1,1);
    //hero.initFrames(['images/digger1.png', 'images/digger1_1.png']);
    //hero.startAnimation();


    var bg_ind = Math.floor(Math.random() * 2) + 1;

    $('td').css('background-image', 'url(images/back_tile'+bg_ind+'_1.png)');
    $('.rock').css('background-image', 'url(images/back_tile'+bg_ind+'.png)');



    setInterval(gameLoop, 100);


    function gameLoop () {
        checkGoldVsHero();
        checkGoldVsEnemy();
        checkEnemyVsHero();
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

                var collided = $( collisions[ i ] );
                var hit_area = collided.width() * collided.height();

                if ( hit_area > (cell.width() * cell.height() / 10) )
                {
                    var enemy = ObjectStack.getObjByDom( cwith );
                    enemy.dom.remove();
                    //enemy.remove();
                    ObjectStack.deleteObject( enemy );
                    enemy = null;
                }
            }
        } catch ( e ) {
            debug( 5, "already deleted" );
        }
    }

    function checkEnemyVsHero() {
        var collisions = $( "#battlefield > .hero" ).collision( ".enemy", { relative: "collider", obstacleData: "odata", colliderData: "cdata", directionData: "ddata", as: "<div/>" } )
        var hit_area = 0;
        try {
            for( var i=0; i < collisions.length; i++ )
            {
                var o = $(collisions[i]).data( "odata" );
                var c = $(collisions[i]).data( "cdata" );
                var d = $(collisions[i]).data( "ddata" );
                var cwith = $(o).get(0);

                var collided = $( collisions[ i ] );
                var hit_area = collided.width() * collided.height();
                debug( 5, "checkEnemyVsHero" );

                if ( hit_area > (cell.width() * cell.height() / 10) )
                {
                    hitHero();
                }
            }
        } catch ( e ) {
            debug( 5, "already deleted" );
        }
    }

    function checkGoldVsHero(){
        var collisions = $(".hero").collision( ".gold-falling", { relative: "collider", obstacleData: "odata", colliderData: "cdata", directionData: "ddata", as: "<div/>" } )
        var hit_area = 0;
        for( var i=0; i<collisions.length; i++ )
        {
            var o = $(collisions[i]).data("odata");
            var c = $(collisions[i]).data("cdata");
            var d = $(collisions[i]).data("ddata");
            var cwith = $(o).get(0).id;
            var cside = d;
            if ( cside.indexOf('N') == -1 )
                continue;
            var snap  = $(c);
            var collided = $( collisions[ i ] );
            hit_area += collided.width() * collided.height();
        }


        if ( hit_area > ( cell.width() * cell.height() / 10 ) ) {
            debug( 4, hit_area );
            hitHero();
        }
    }
    function hitHero(){
        debug( 6, "hit hero" );

        $( "#battlefield > .enemy").each(function(){
            setG(this);
            var enemy = ObjectStack.getObjByDom( this );
            $(enemy.dom).remove();
            ObjectStack.deleteObject( enemy );
            enemy = null;
        });

        var lives = parseInt($('#lives').html());
        lives--;
        $('#lives').html(lives);
        hero.dom.remove();
        //hero.remove();
        ObjectStack.deleteObject(hero);
        hero = null;
        createNewHero();
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

    var hero;
    createNewHero();


    function createNewHero(){
        hero = new Hero( bf.getRandomHeroResp() );
    }

    function createNewEnemy() {
        return new Enemy( bf.getRandomEnemyResp() );
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
            item.removeClass('push');

            if ( bf.cellContains( item[0].x, item[0].y + 1, ".rock" ) == 0 ) {
                debug( 2, 'lets fall' );
                //item.effect("highlight", {color: 'red'}, 3000);

                item.addClass( 'gold-falling' );
                item.css('transform', 'rotate(90deg)');
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
                    fallen.appendTo(bf.dom);
                    //$item.replaceWith(fallen);
                    fallen.offset($item.offset());
                    $item.remove();
                    bf.addItems(item[0].x, item[0].y, fallen);
                });

                bf.removeItems(item[0].x, item[0].y, item);

            }
        };

    })(jQuery);
