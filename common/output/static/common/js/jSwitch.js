/**
 * @fileOverview jSwitch.js
 * @author LvChengbin( kelcb@163.com )
 * @package jSwitch
 * @description
 */
    var jSwitch = function( config ) {
        this.superClass = null;
        this.__handlers = {};

        this.children = [];
        this.parent = null;

        this.config = {};

        if( config ) {
            jSwitch.extend( jSwitch.extend( {}, this.config ), config );
        }
    };

    /**
     * to dispose an object and remove all properties
     * @function dispose
     */
    jSwitch.prototype.dispose = function() {
        for( var prop in this ) this[ prop ] = null;
    };

    /**
     * to add event listener with an event type
     * @function addEventListener
     * @grammar Object.addEventListener( evt, handler, handlerName )
     * @param { String } evt - event type
     * @param { Function } handler - the function which would be execute when the event being fired
     * @param { String } handlerName - if exists, the handlerName would be stored in an object,
     * and users can use this handlerName to remove the handler from listener list
     * 
     * @return { Object } this
     */
    jSwitch.prototype.addEventListener = function( evt, handler, handlerName ) {
        if( !jSwitch.isFunction( handler ) ) return;

        // create an object for listeners
        this.__listeners || ( this.__listeners = {} );

        // create an object for handlers with keys as handler name
        this.__handlers || ( this.__handlers = {} );

        ( this.__listeners[ evt ] || ( this.__listeners[ evt ] = [] ) ).push( {
            handler : handler
        } );

        // store handler in object handlers with handler name
        handlerName && ( this.__handlers[ handlerName ] = handler );

        return this;
    };

    /**
     * remove an event listener with event or event type
     */
    jSwitch.prototype.removeEventListener = function( evt, handler ) {
        var listeners = this.__listeners,
            _handler = handler,
            handlers,
            i = 0,
            l;

        if( !listener || !( handlers = listeners[ evt ] ) || !( l = handlers.length ) ) return;

        if( jSwitch.isString( handler ) ) {
            if( !this.__handlers || !this.__handlers.hasOwnProperty( handler ) ) return;
            _handler = this.__handlers[ handler ];
            this.__handlers[ handler ] = null;
        }

        for( ; i < l; i += 1 ) {
            handlers[ i ].handler === _handler && handlers.splice( i--, 1 );
        }

        return this;
    };

    jSwitch.prototype.dispatchEvent = function( evt, params ) {
        var me = this;

        var type;

        if( !this.__listeners ) return;

        jSwitch.isString( evt ) && ( evt = new jSwitch.Event( evt ) );

        type = jSwitch.extend( evt, params || {}, true ).type;

        this.__listeners[ type ].each( function( handler, i ) {
            handler.call( me, evt );
        } );

        jSwitch.isFunction( this[ 'on' + type ] ) && this[ 'on' + type ].call( this, evt );

        return evt.returnValue || false;
    }

    jSwitch.createClass = function( constructor, extend, superClass ) {
        extend || ( extend || {} );
        superClass || ( superClass = jSwitch );

        var fn = function() {
            var attr;
            for( attr in extend ) this[ attr ] = extend[ attr ];
            this.superClass = superClass
            constructor.apply( this, arguments );
        };

        var Fn = new Function();

        Fn.prototype = superClass.prototype;
        fn.prototype = new Fn;

        fn.extend = function( obj ) {
            var attr;
            for( attr in obj ) fn.prototype[ attr ] = obj[ attr ];
            return fn;
        };

        return fn;
    };


    jSwitch.prototype.ready = ( function() {
        var isready = false,
            callbackPool = [];

        var handler = function() {
            document.removeEventListener( 'DOMContentLoaded', handler, false );
            ready();
        };

        document.addEventListener( 'DOMContentLoaded', handler, false );
        window.addEventListener( 'load', ready, false );

        function ready() {
            isready = true;
            while( callbackPool.length ) callbackPool.shift()();
        }

        return function( fn ) {
            isready  ? fn() : callbackPool.push( fn );
        };

    } )();

    jSwitch.prototype.initialize = function() {
        this.dispatchEvent( 'ready' );
    };

    jSwitch.prototype.broadcast = function() {
        this.children 
    };

    jSwitch.prototype.multicast = function() {
    }

    jSwitch.prototype.post = function() {
        //send message to parent
    };

    jSwitch.prototype.message = function( options ) {
        /**
        var defaultOptions = {
            from : this,
            to : xx
        };
        */

    };

    window.J = window.jSwitch = jSwitch;

jSwitch.extend = function( target, src, force ) {
    var prop;

    if( force !== false ) force = true;
    for( prop in src ) {
        if( !src.hasOwnProperty( prop ) ) continue;
        if( force || !target.hasOwnProperty( prop ) ) {
            target[ prop ] = src[ prop ];
        }
    }
    return target;
};

'Arguments,Function,String,Number,Date,RegExp,Error'.split( ',' ).forEach( function( i ) {
    jSwitch[ 'is' + i ] = function( obj ) {
        return Object.prototype.toString.call( obj ) === '[object ' + i + ']';
    };
} );


jSwitch.extend( jSwitch, {
    $ : function( selector, context ) {
        context = context || document;
        return context.querySelector( selector );
    },

    $$ : function( selector, context ) {
        context = context || document;
        return context.querySelectorAll( selector );
    },

    isWindow : function( obj ) {
        return obj != null && obj === obj.window;
    },

    isArray : function( obj ) {
        return Array.isArray( obj );
    },

    isUndefined : function( obj ) {
        return typeof obj === 'undefined';
    },
    isObject : function( obj ) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    },
    clone : function( obj ) {
        if( !jSwitch.isObject( obj ) ) return obj;
        return jSwitch.isArray( obj ) ? obj.slice() : jSwitch.extend( {}, obj );
    }
} );

    jSwitch.Event = function( src, props ) {
        if( !( this instanceof jSwitch.Event ) ) {
            return new jSwitch.Event( type, props );
        }

        if( src && src.type ) {
            this.type = src.type;
            this.target = src.target || null;
            this.returnValue = true;
            this.currentTarget = null;
        } else {
            this.type = src;
        }

        if( props ) {
            jSwitch.extend( this, props );
        }

        this.timeStamp = src && src.timeStamp || +( new Date );
    };

    jSwitch.Event.prototype = {
        constructor : jSwitch.Event,
        preventDefault : function() {
        },
        stopPropergation : function() {
        }
    };

    /**
     * a class used to create a package in jSwtich
     * and all packages create with new J.Package is inherited from jSwitch
     */
    jSwitch.Package = function( options ) {
        var fn = function() {
            //this.hasOwnProperty( 'initialize' ) && this.initialize( options );
        };

        return jSwitch.createClass( fn, options, jSwitch );
    };
    
    jSwitch.prototype.mount = function( name, Package, options ) {
        var pkg = new Package( options );

        pkg.parent = this;
        pkg.name = name;

        this.children || ( this.children = {} );

        if( this.children[ name ] ) {
            console.warn( 'the package named "' + name + '" is already exists, and it will be override by this one' );
        }

        this.children[ name ] = pkg;

        pkg.dispatchEvent( 'mount', {
            dispatcher : this
        } );

        pkg.initialize && pkg.initialize( options );
    };

    jSwitch.prototype.unmount = function( pkg ) {
        /**
         * dispatch beforeunmount event before unmount
         */
        pkg.dispatchEvent( 'beforeunmount', {
            dispatcher : this
        } );

        if( jSwtich.isString( pkg ) ) {
            this.children.hasOwnProperty( pkg ) && ( this.children[ pkg ] = null ); 
        } else {
            for( item in this.children ) {
                if( this.children[ item ] === pkg ) {
                    this.children[ item ] = null;
                    break;
                }
            }
        }

        
        /**
         * remove package from children list
         */
        for( ; i < l; i += 1 ) {
            if( this.children[ i ] === pkg ) this.children.splice( i, 1 );
        }

        /**
         * to tell group manager remove this package from all group
         */

        /**
         * dispatch onunmount event after unmount this package from it's parent package
         */
        pkg.dispatchEvent( 'unmount', {
            dispatcher : this
        } );
    };
