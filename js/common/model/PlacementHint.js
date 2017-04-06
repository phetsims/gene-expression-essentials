// Copyright 2015, University of Colorado Boulder

/**
 * This class represents a "placement hint" in the model, which is a location where a biomolecule of the provided type
 * can be placed and which will be "hinted" to the user at the appropriate times.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ShapeChangingModelElement = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeChangingModelElement' );

  /**
   *
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function PlacementHint( biomolecule ) {
    // Biomolecule that defines the shape of this hint.
    this.biomolecule = biomolecule;

    ShapeChangingModelElement.call( this, biomolecule.getShape() );

    // Property that tracks whether or not the hint is should be visible to the user.
    this.activeProperty = new Property( false );
  }

  geneExpressionEssentials.register( 'PlacementHint', PlacementHint );

  return inherit( ShapeChangingModelElement, PlacementHint, {

    /**
     * @returns {Color}
     */

    getBaseColor: function() {
      return this.biomolecule.colorProperty.get();
    },

    /**
     * Determine whether the given biomolecule matches the one that this hint is meant to represent. In this base class,
     * type alone indicates a match. Subclass if greater specificity is needed.
     *
     * @param {MobileBiomolecule} testBiomolecule
     * @returns {boolean}
     */
    isMatchingBiomolecule: function( testBiomolecule ) {
      return testBiomolecule instanceof this.biomolecule.constructor;
    },

    /**
     * If the proffered test biomolecule is of the appropriate type, activate this hint.
     *
     * @param {MobileBiomolecule} testBiomolecule
     */
    activateIfMatch: function( testBiomolecule ) {
      if ( this.isMatchingBiomolecule( testBiomolecule ) ) {
        this.activeProperty.set( true );
      }
    }
  } );
} );
