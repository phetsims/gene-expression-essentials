// Copyright 2002-2014, University of Colorado Boulder

/**
 * @author John Blanco
 * @author Mohamed Safi
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );
  var DoubleRange = require( 'GENE_EXPRESSION_BASICS/common/util/DoubleRange' );

  /**
   * Constraint value between min and max value
   * @param  {number} value
   * @param {number} minValue
   * @param  {number} maxValue
   * @constructor
   */

  function BoundedDoubleProperty( value, minValue, maxValue ) {
    Property.call( this, value );
    this.bounds = new DoubleRange( minValue, maxValue );
  }

  return inherit( Property, BoundedDoubleProperty, {

    /**
     * @param {number} value
     */
    set: function( value ) {
      var boundedValue = Util.clamp( value, this.bounds.getMin(), this.bounds.getMax() );
      Property.prototype.set.call( this, boundedValue );
    }

  } );

} );