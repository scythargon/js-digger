	function Unit(){}
	Unit.prototype = Entity.prototype;
	Unit.prototype.x = 0;
	Unit.prototype.y = 0;
	Unit.prototype.setXY = function(x,y){
		this.x=x;
		this.y=y;
	}
	Unit.prototype.move = 	function (direction){
		if (this.dom.isMoving == true)
			return;
		animation_speed = settings.animation_speed;
		animation_type = "linear";
		if("right"==direction && this.tryWalk(1,0,this.hungry))
		{
			this.dom.isMoving = true;
			this.x++;
			this.$dom.animate({"left": "+="+cell.width()+"px"}, animation_speed, animation_type, function(){
				this.isMoving = false;
				getPressedKeys();
			});
		}
		else if("left"==direction && this.tryWalk(-1,0,this.hungry))
		{
			this.x--;
			this.dom.isMoving = true;
			this.$dom.animate({"left": "-="+cell.width()+"px"}, animation_speed, animation_type, function(){
				this.isMoving = false;
				getPressedKeys();
			});
		}
		else if("up"==direction && this.tryWalk(0, -1, this.hungry))
		{
			this.y--;
			this.dom.isMoving = true;
			this.$dom.animate({"top": "-="+cell.height()+"px"}, animation_speed, animation_type, function(){
				this.isMoving = false;
				getPressedKeys();
			});
		}  
		else if("down"==direction && this.tryWalk(0,1, this.hungry))
		{
			this.y++;
			this.dom.isMoving = true;
			this.$dom.animate({"top": "+="+cell.height()+"px"}, animation_speed, animation_type, function(){
				this.isMoving = false;
				getPressedKeys();
			});
		}
		
	} 
	Unit.prototype.tryWalk = function(x,y,hungry){  //TODO hungry push
		var animation_speed = settings.animation_speed;
		//console.log(hero.x+":"+hero.y);
		if(this.x+x<0 || this.x+x==settings.cells_x || this.y+y<0 || this.y+y==settings.cells_y){
			//console.log("THE WALL!");
			return false;
		}
		var direction = "";
		if (x<0)
			direction = "left"; 
		if (x>0)
			direction = "right";
		if (y<0)
			direction = "up";
		if (y>0)
			direction = "down";
		var to_check = bf.getCell(hero.x+x, hero.y+y);
		var ret = [];
				to_check.each(function(){
					check = $(this);
				if(check.hasClass('rock') && hungry)
				{
					check.hide("slide", { direction: direction }, animation_speed, function(){
						var if_gold = bf.getCell(this.x, this.y-1);
                        if ( if_gold == undefined )
                            return;
                        if_gold = if_gold.filter(".gold");
						if(if_gold.size()>0){
							if_gold.children().jrumble({
								x: 2,
								y: 2,
								rotation: 1
							});
							if_gold.children().trigger('startRumble');
							setTimeout(function(arg){
								arg.children().trigger('stopRumble');
								arg.fall();
							}, animation_speed*3, if_gold);
						};
						/**/
					});
					bf.removeItemsByClass(hero.x+x, hero.y+y, '.rock');
				} else if(check.hasClass('consume')){
					//console.log(check);
					check.hide("highlight",{},animation_speed/2);
					bf.removeItemsByClass(hero.x+x, hero.y+y, '.consume');
					if(check.hasClass('gem')){
						var score = parseInt($('#score').html());
						score++;
						$('#score').html(score);
					}
					if(check.hasClass('gold-fallen')){
						var score = parseInt($('#score-gold').html());
						score++;
						$('#score-gold').html(score);
					}
				} else if(check.hasClass('push')){
					ret.push(tryPush(x,y,check));
					//return false;
				}
			});
		var ret_bool = true;
		var i,l;
		for(i=0, l=ret.length; i<l; i++){
			ret_bool = ret_bool && ret[i];
		}
		return ret_bool; 
	}
