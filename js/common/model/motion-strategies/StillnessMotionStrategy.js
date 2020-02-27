// Copyright 2015-2019, University of Colorado Boulder

/**
 * Motion strategy that has no motion, i.e. causes the user to be still.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

/**
 * @constructor
 */
function StillnessMotionStrategy() {
  MotionStrategy.call( this );
}

geneExpressionEssentials.register( 'StillnessMotionStrategy', StillnessMotionStrategy );

export default inherit( MotionStrategy, StillnessMotionStrategy, {

  /**
   * @override
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector2}
   * @public
   */
  getNextPosition: function( currentPosition, bounds, dt ) {
    return currentPosition;
  }
} );