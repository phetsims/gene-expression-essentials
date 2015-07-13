// Copyright 2002-2014, University of Colorado Boulder

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
    this.minValue = minValue | 0;
    this.maxValue = maxValue | 0;
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
    }


  } );
} );