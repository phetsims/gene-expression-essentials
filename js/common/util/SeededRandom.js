// Copyright 2002-2015, University of Colorado Boulder
/**
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aaron Davis
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  function SeededRandom( seed ) {
    this.random = function() {
      var x = Math.sin( seed++ ) * 10000;
      return x - Math.floor( x );
    };
  }

  return inherit( Object, SeededRandom, {

    nextBoolean: function() {
      return this.random() >= 0.5;
    },

    nextInt: function( n ) {
      var value = this.random() * n;
      return value | 0; // convert to int
    },

    nextDouble: function() {
      return this.random();
    }

  } );

} );