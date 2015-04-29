//  Copyright 2002-2014, University of Colorado Boulder
/**
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  function Random() {
  }

  return inherit( Object, Random, {},
    {
      nextBoolean: function() {
        return Math.random() >= 0.5;
      },

      nextInt: function( n ) {
        var value = Math.random() * n;
        return value | 0; // convert to int
      },

      nextDouble: function() {
        return Math.random();
      }

    } );


} );