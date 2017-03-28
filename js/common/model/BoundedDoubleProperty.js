// Copyright 2015, University of Colorado Boulder

/**
 * @author John Blanco
 * @author Mohamed Safi
 */

define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );

  /**
   * Constraint value between min and max value
   * @param  {number} value
   * @param {number} minValue
   * @param  {number} maxValue
   * @constructor
   */
  function BoundedDoubleProperty( value, minValue, maxValue ) {
    Property.call( this, value );
    this.bounds = new Range( minValue, maxValue );
  }

  geneExpressionEssentials.register( 'BoundedDoubleProperty', BoundedDoubleProperty );

  return inherit( Property, BoundedDoubleProperty, {

    /**
     * @param {number} value
     * @public
     */
    set: function( value ) {
      var boundedValue = Util.clamp( value, this.bounds.min, this.bounds.max );
      Property.prototype.set.call( this, boundedValue );
    }
  } );
} );