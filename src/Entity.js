	function Entity() { }

	Entity.prototype.setDom = function ( obj ){
		if ( obj instanceof jQuery) {
			this.dom = obj[ 0 ];
			this.$dom = obj;
		} else {
			this.dom = obj;
			this.$dom = $( obj );
		}
	}
