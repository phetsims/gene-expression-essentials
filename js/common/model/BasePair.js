// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model class for the base pair in the DNA molecule. In the real world, a "base pair" is a pair of nitrogenous bases
 * that connects to the DNA backbone on one side and in the center of the DNA strand on the other. For the purposes of
 * this simulation, a base pair only needs to represent a structural element of the DNA, and the individual bases are
 * not actually encapsulated here (nor anywhere in this simulation).
 *
 * In this class the width of an individual base pair is a constant, but the height can vary. This is used to create the
 * illusion of a twisted strand of DNA - the shorter base pairs are the ones that are more angled, and the longer ones
 * are the ones that are seen directly from the side.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants
const BASE_PAIR_WIDTH = 13; // In picometers.  Not sure if this is close to real life, chosen to look decent in view.

/**
 * @param {number} centerLocationX
 * @param {number} topYLocation
 * @param {number} bottomYLocation
 * @constructor
 */
function BasePair( centerLocationX, topYLocation, bottomYLocation ) {

  // @public - values that indicate where the base pair is positioned
  this.x = centerLocationX - BASE_PAIR_WIDTH / 2;
  this.topYLocation = topYLocation;
  this.bottomYLocation = bottomYLocation;
  this.width = BASE_PAIR_WIDTH;
}

geneExpressionEssentials.register( 'BasePair', BasePair );

inherit( Object, BasePair, {

  /**
   * @returns {number}
   * @public
   */
  getCenterLocationX: function() {
    return this.x + BASE_PAIR_WIDTH / 2;
  }
} );

export default BasePair;