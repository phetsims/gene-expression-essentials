// Copyright 2015, University of Colorado Boulder

/**
 * @author John Blanco
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
     * Gets the lower bound (minimum) of the range.
     *
     * @return {number} min
     */
    getMin: function() {
      return this.minValue;
    },

    /**
     * Gets the upper bound (maximum) of the range.
     *
     * @return {number} max
     */
    getMax: function() {
      return this.maxValue;
    },

    /**
     * Gets the length of the range.
     *
     * @return{number} length of the range
     */
    getLength: function() {
      return this.maxValue - this.minValue;
    },

    /**
     * Is the length of the range zero?
     *
     * @return{boolean}
     */
    isZero: function() {
      return ( this.maxValue - this.minValue === 0 );
    }

  } );
} );