// Copyright 2015, University of Colorado Boulder
/**
 * Model class for the base pair in the DNA molecule. In the real world, a "base pair" is a pair of nitrogenous bases
 * that connects to the DNA backbone on one side and in the center of the DNA strand on the other. For the purposes of
 * this simulation, a base pair only needs to represent a structural element of the DNA, and the individual bases are
 * not actually encapsulated here (nor anywhere in this simulation).
 * In this class the width of an individual base par is a constant, but the height can vary. This is used to create the
 * illusion of a twisted strand of DNA - the shorter base pairs are the ones that are more angled, and the longer ones
 * are the ones that are seen directly from the side.
 *
 * @author Mohamed Safi
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var BASE_PAIR_WIDTH = 13; // In picometers.  Not sure if this is close to real life, chosen to look decent in view.

  /**
   * @param {Vector2} centerLocation
   * @param {number} height
   * @constructor
   */
  function BasePair( centerLocation, height ) {
    this.shape = Shape.roundRect( centerLocation.x - BASE_PAIR_WIDTH / 2, centerLocation.y - height / 2, BASE_PAIR_WIDTH,
      height, BASE_PAIR_WIDTH / 4, BASE_PAIR_WIDTH / 4 );//private
  }

  geneExpressionEssentials.register( 'BasePair', BasePair );

  return inherit( Object, BasePair, {

    /**
     * @returns {Shape}
     */
    getShape: function() {
      return this.shape;
    },

    /**
     * @returns {Vector2}
     */
    getCenterLocation: function() {
      return this.shape.bounds.getCenter();
    }

  } );

} );
