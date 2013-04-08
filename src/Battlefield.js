"use strict";
	function Battlefield(w,h){
		w-=1;
		h-=1;
		var cells = $([]);
		var dom = document.getElementById('battlefield');
		var table = document.createElement("table");
		dom.appendChild(table);
		while(h>=0){
			cells[h] = $([]);
			var tr = document.createElement("tr");
			var _w = w;
			while(_w>=0){
				cells[h][_w] = $([]);
				var td = document.createElement("td");
				tr.appendChild(td);
				_w--;
			}
			table.appendChild(tr);
			h--;		
		}
		$('#battlefield > table').height(document.body.clientHeight-$('#stats').height());
		return{
			getCellOffset: function(x,y){
				return $('#battlefield > table > tr:eq('+y+') > td:eq('+x+')').offset();
			},
			cellContains: function (x,y,class_){
				if (y==-1 || x==-1 || y>=settings.cells_y || x>=settings.cells_x)
					return -1;
				return cells[x][y].filter(class_).size();
			},
			generateRandomItems: function(luck,class_){
				var w = settings.cells_x-1;
				while(w>=0){
					var h = settings.cells_y-1;
					while(h>=0){
						if(rand(luck)){
							this.createItem(w,h,class_);
						}
						h--;
					}
					w--;
				}
			},
			createItem: function(x,y,class_){ 
				"use strict";
				var item = $('.resources > .'+class_).clone();
				item[0].x=x;
				item[0].y=y;
				item.offset(bf.getCellOffset(x,y));
				item.appendTo(dom);
				cells[x][y] = cells[x][y].add(item);
			},
			removeItems: function(x,y,items){
				debug(1,'removeItems');
				debug(1,cells[x][y]);
				var t = cells[x][y].filter(function(){
					return $.inArray(this,items)<0;
				});
                cells[x][y] = t;

			},
			removeItemsByClass: function(x,y,class_){
				debug(1,'removeItemsByClass');
				debug(1,cells[x][y]);
				cells[x][y] = cells[x][y].not(class_);
			},
	  		addItems: function(x,y,items){
	  			debug(1,'addItems');
	  			debug(1,items);
	  			debug(1,cells[x][y]);
                cells[x][y]=cells[x][y].add(items);
			},
			getCell: function(x,y){
				return cells[x][y];
			},
            dom: dom
		}
	}
Battlefield.prototype = Entity.prototype;	