// Copyright 2002-2014, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Mohamed Safi
 */

define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * holds min and max value
   * @param {number} minValue
   * @param {number} maxValue
   * @constructor
   */
  function DoubleRange( minValue, maxValue ) {
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  return inherit( Object, DoubleRange, {

    /**
     *
     * @returns {number}
     */
    getMin: function() {
      return this.minValue;
    },

    /**
     *
     * @returns {number}
     */
    getMax: function() {
      return this.maxValue;
    }

  } );
} );