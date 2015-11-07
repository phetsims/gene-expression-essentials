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
  function IntegerRange( minValue, maxValue ) {
    this.minValue = minValue | 0; // private
    this.maxValue = maxValue | 0; // private
  }

  return inherit( Object, IntegerRange, {

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
    },

    /**
     * Determines whether the range contains a value.
     *
     * @param value
     * @return {boolean}
     */
    contains: function( value ) {
      value = value | 0;
      return ( value >= this.minValue && value <= this.maxValue );
    },

    /**
     * Gets the length of the range.
     *
     * @return {number} length of the range
     */
    getLength: function() {
      return this.maxValue - this.minValue;
    },

    /**
     * Is the length of the range zero?
     *
     * @return {boolean} true or false
     */
    isZero: function() {
      return ( this.maxValue - this.minValue === 0 );
    },

    /**
     * Do the two ranges overlap with one another?
     * reference: http://eli.thegreenplace.net/2008/08/15/intersection-of-1d-segments/
     *
     * @param {DoubleRange} xRange
     * @return {boolean}
     */
    intersects:function(  xRange ) {
    return ( this.maxValue >= xRange.getMin() && xRange.getMax() >= this.minValue );
  }


  } );
} );