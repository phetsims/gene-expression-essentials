// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class represents a "placement hint" in the model, which is a position where a biomolecule of the provided type
 * can be placed and which will be "hinted" to the user at the appropriate times.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Property from '../../../../axon/js/Property.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import ShapeChangingModelElement from './ShapeChangingModelElement.js';

class PlacementHint extends ShapeChangingModelElement {

  /**
   * @param {MobileBiomolecule} biomolecule - biomolecule that defines the shape of this hint
   */
  constructor( biomolecule ) {

    super( biomolecule.getShape() );

    // @public
    this.biomolecule = biomolecule;

    // @public - property that tracks whether or not the hint is should be visible to the user
    this.activeProperty = new Property( false );
  }

  /**
   * @returns {Color}
   * @public
   */
  getBaseColor() {
    return this.biomolecule.colorProperty.get();
  }

  /**
   * Determine whether the given biomolecule matches the one that this hint is meant to represent. In this base class,
   * type alone indicates a match. Subclass if greater specificity is needed.
   *
   * @param {MobileBiomolecule} testBiomolecule
   * @returns {boolean}
   * @public
   */
  isMatchingBiomolecule( testBiomolecule ) {
    return testBiomolecule instanceof this.biomolecule.constructor;
  }

  /**
   * If the proffered test biomolecule is of the appropriate type, activate this hint.
   * @param {MobileBiomolecule} testBiomolecule
   * @public
   */
  activateIfMatch( testBiomolecule ) {
    if ( this.isMatchingBiomolecule( testBiomolecule ) ) {
      this.activeProperty.set( true );
    }
  }
}

geneExpressionEssentials.register( 'PlacementHint', PlacementHint );

export default PlacementHint;
