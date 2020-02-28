// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class defines a motion strategy that produces a random walk, meaning that items using this strategy will move in
 * one direction for a while, then switch directions and move in another.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Utils from '../../../../../dot/js/Utils.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector3 from '../../../../../dot/js/Vector3.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

// constants
const MIN_XY_VELOCITY = 200; // In picometers/s
const MAX_XY_VELOCITY = 400; // In picometers/s
const MIN_Z_VELOCITY = 0.3; // In normalized units per sec
const MAX_Z_VELOCITY = 0.6; // In normalized units per sec
const MIN_TIME_IN_ONE_DIRECTION = 0.25; // In seconds.
const MAX_TIME_IN_ONE_DIRECTION = 0.8; // In seconds.

// Vector used for intermediate calculations - Added to avoid excessive creation of Vector3 instances - Ashraf
const nextPosition3DScratchVector = new Vector3( 0, 0, 0 );

/**
 * @param {Property} motionBoundsProperty
 * @constructor
 */
function RandomWalkMotionStrategy( motionBoundsProperty ) {
  const self = this;
  MotionStrategy.call( self );
  this.directionChangeCountdown = 0; // @private
  this.currentMotionVector2D = new Vector2( 0, 0 ); // @private
  this.currentZVelocity = 0; // @private

  function handleMotionBoundsChanged( motionBounds ) {
    self.motionBounds = motionBounds;
  }

  motionBoundsProperty.link( handleMotionBoundsChanged );

  this.disposeRandomWalkMotionStrategy = function() {
    motionBoundsProperty.unlink( handleMotionBoundsChanged );
  };
}

geneExpressionEssentials.register( 'RandomWalkMotionStrategy', RandomWalkMotionStrategy );

export default inherit( MotionStrategy, RandomWalkMotionStrategy, {

  /**
   * @override
   * @public
   */
  dispose: function() {
    this.disposeRandomWalkMotionStrategy();
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
    nextPosition3DScratchVector.x = currentPosition.x;
    nextPosition3DScratchVector.y = currentPosition.y;
    nextPosition3DScratchVector.z = 0;
    const position3D = this.getNextPosition3D( nextPosition3DScratchVector, bounds, dt );
    return new Vector2( position3D.x, position3D.y );
  },

  /**
   * @returns {number}
   * @private
   */
  generateDirectionChangeCountdownValue: function() {
    return MIN_TIME_IN_ONE_DIRECTION + phet.joist.random.nextDouble() *
           ( MAX_TIME_IN_ONE_DIRECTION - MIN_TIME_IN_ONE_DIRECTION );
  },

  /**
   * @override
   * @param {Vector3} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector3}
   * @public
   */
  getNextPosition3D: function( currentPosition, bounds, dt ) {
    this.directionChangeCountdown -= dt;
    if ( this.directionChangeCountdown <= 0 ) {

      // Time to change direction.
      const newXYVelocity = MIN_XY_VELOCITY + phet.joist.random.nextDouble() * ( MAX_XY_VELOCITY - MIN_XY_VELOCITY );
      const newXYAngle = Math.PI * 2 * phet.joist.random.nextDouble();
      this.currentMotionVector2D = Vector2.createPolar( newXYVelocity, newXYAngle );
      this.currentZVelocity = MIN_Z_VELOCITY + phet.joist.random.nextDouble() * ( MAX_Z_VELOCITY - MIN_Z_VELOCITY );
      this.currentZVelocity = phet.joist.random.nextBoolean() ? -this.currentZVelocity : this.currentZVelocity;

      // Reset the countdown timer.
      this.directionChangeCountdown = this.generateDirectionChangeCountdownValue();
    }

    // Make sure that current motion will not cause the model element to move outside of the motion bounds.
    if ( !this.motionBounds.testIfInMotionBoundsWithDelta( bounds, this.currentMotionVector2D, dt ) ) {

      // The current motion vector would take this element out of bounds, so it needs to "bounce".
      this.currentMotionVector2D = this.getMotionVectorForBounce( bounds, this.currentMotionVector2D, dt, MAX_XY_VELOCITY );

      // Reset the timer.
      this.directionChangeCountdown = this.generateDirectionChangeCountdownValue();
    }

    // To prevent odd-looking situations, the Z direction is limited so that biomolecules don't appear transparent
    // when on top of the DNA molecule.
    const minZ = this.getMinZ( bounds, currentPosition );

    // Calculate the next position based on current motion.
    return new Vector3(
      currentPosition.x + this.currentMotionVector2D.x * dt,
      currentPosition.y + this.currentMotionVector2D.y * dt,
      Utils.clamp( currentPosition.z + this.currentZVelocity * dt, minZ, 0 )
    );
  }
} );