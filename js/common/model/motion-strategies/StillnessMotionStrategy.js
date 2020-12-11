// Copyright 2015-2020, University of Colorado Boulder

/**
 * Motion strategy that has no motion, i.e. causes the user to be still.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

class StillnessMotionStrategy extends MotionStrategy {

  /**
   */
  constructor() {
    super();
  }

  /**
   * @override
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector2}
   * @public
   */
  getNextPosition( currentPosition, bounds, dt ) {
    return currentPosition;
  }
}

geneExpressionEssentials.register( 'StillnessMotionStrategy', StillnessMotionStrategy );

export default StillnessMotionStrategy;