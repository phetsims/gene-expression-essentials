// Copyright 2015-2020, University of Colorado Boulder

/**
 * Motion strategy that moves towards a destination, but it wanders or meanders a bit on the way to look less directed
 * and, in some cases, more natural.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector3 from '../../../../../dot/js/Vector3.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';
import MoveDirectlyToDestinationMotionStrategy from './MoveDirectlyToDestinationMotionStrategy.js';
import RandomWalkMotionStrategy from './RandomWalkMotionStrategy.js';

/**
 * @param  {Property} destinationProperty
 * @param {Property} motionBoundsProperty
 * @param {Vector2} destinationOffset
 * @constructor
 */
function MeanderToDestinationMotionStrategy( destinationProperty, motionBoundsProperty, destinationOffset ) {
  MotionStrategy.call( this );
  this.randomWalkMotionStrategy = new RandomWalkMotionStrategy( motionBoundsProperty ); // @private
  this.directToDestinationMotionStrategy = new MoveDirectlyToDestinationMotionStrategy(
    destinationProperty, motionBoundsProperty, destinationOffset, 750 ); // @private
  this.destinationProperty = destinationProperty; // @private
}

geneExpressionEssentials.register( 'MeanderToDestinationMotionStrategy', MeanderToDestinationMotionStrategy );

inherit( MotionStrategy, MeanderToDestinationMotionStrategy, {

  /**
   * override
   * @public
   */
  dispose: function() {
    this.randomWalkMotionStrategy.dispose();
    this.directToDestinationMotionStrategy.dispose();
  },

  /**
   * @override
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector2}
   * @public
   */
  getNextPosition: function( currentPosition, bounds, dt ) {
    const nextPosition3D = this.getNextPosition3D( new Vector3( currentPosition.x, currentPosition.y, 0 ), bounds, dt );
    return new Vector2( nextPosition3D.x, nextPosition3D.y );
  },

  /**
   * @override
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector3}
   * @public
   */
  getNextPosition3D: function( currentPosition, bounds, dt ) {

    // If the destination in within the shape, go straight to it.
    if ( bounds.containsPoint( this.destinationProperty.get() ) ) {

      // Move directly towards the destination with no randomness.
      return this.directToDestinationMotionStrategy.getNextPosition3D( currentPosition, bounds, dt );
    }
    else {

      // Use a combination of the random and linear motion.
      const intermediatePosition = this.randomWalkMotionStrategy.getNextPosition3D( currentPosition, bounds, dt * 0.6 );
      return this.directToDestinationMotionStrategy.getNextPosition3D( intermediatePosition, bounds, dt * 0.4 );
    }
  }
} );

export default MeanderToDestinationMotionStrategy;
