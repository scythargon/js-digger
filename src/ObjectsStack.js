/**
 * Created with JetBrains WebStorm.
 * User: argon
 * Date: 4/10/13
 * Time: 3:08 PM
 * To change this template use File | Settings | File Templates.
 */

var ObjectStack = new ( function() {

    this.stack = [];

    this.push = function ( obj ) {

        var i;

        for ( i = 0; i < this.stack.length; i++) {
            if ( this.stack[ i ] == null ){
                this.stack[ i ] = obj;
                return;
            }
        };
        this.stack.push( obj );

    };

    this.getObjByDom = function ( dom ) {

        var found_or_error = false;
        try {

            var i;

            for ( i = 0; i < this.stack.length; i++) {
                if ( $(this.stack[ i ].dom).is($(dom))){
                    found_or_error = true;
                    return this.stack[ i ];
                }
            };
        } catch ( e ) {
            found_or_error = true;
            debug( 5, 'ObjectStack: already deleted' );
            return null;
        }

        if ( ! found_or_error )
            throw new Error( "getObjByDom: There are no such object in ObjectStack!" );
    };


    this.deleteObject = function ( obj ) {

        var i,
            deleted = false;

        for ( i = 0; i < this.stack.length; i++) {
            if ( this.stack[ i ] == obj)
            {
                this.stack[ i ] = null;
                deleted = true;
            };
        };

        if( ! deleted )
            throw new Error( "deleteObject: There are no such object in ObjectStack!" );

    };

})();