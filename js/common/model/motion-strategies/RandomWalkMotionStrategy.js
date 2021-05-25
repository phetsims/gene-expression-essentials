// Copyright 2015-2021, University of Colorado Boulder

/**
 * This class defines a motion strategy that produces a random walk, meaning that items using this strategy will move in
 * one direction for a while, then switch directions and move in another.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import dotRandom from '../../../../../dot/js/dotRandom.js';
import Utils from '../../../../../dot/js/Utils.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector3 from '../../../../../dot/js/Vector3.js';
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

class RandomWalkMotionStrategy extends MotionStrategy {

  /**
   * @param {Property} motionBoundsProperty
   */
  constructor( motionBoundsProperty ) {
    super();
    this.directionChangeCountdown = 0; // @private
    this.currentMotionVector2D = new Vector2( 0, 0 ); // @private
    this.currentZVelocity = 0; // @private

    const handleMotionBoundsChanged = motionBounds => {
      this.motionBounds = motionBounds;
    };

    motionBoundsProperty.link( handleMotionBoundsChanged );

    this.disposeRandomWalkMotionStrategy = () => {
      motionBoundsProperty.unlink( handleMotionBoundsChanged );
    };
  }

  /**
   * @override
   * @public
   */
  dispose() {
    this.disposeRandomWalkMotionStrategy();
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
    nextPosition3DScratchVector.x = currentPosition.x;
    nextPosition3DScratchVector.y = currentPosition.y;
    nextPosition3DScratchVector.z = 0;
    const position3D = this.getNextPosition3D( nextPosition3DScratchVector, bounds, dt );
    return new Vector2( position3D.x, position3D.y );
  }

  /**
   * @returns {number}
   * @private
   */
  generateDirectionChangeCountdownValue() {
    return MIN_TIME_IN_ONE_DIRECTION + dotRandom.nextDouble() *
           ( MAX_TIME_IN_ONE_DIRECTION - MIN_TIME_IN_ONE_DIRECTION );
  }

  /**
   * @override
   * @param {Vector3} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector3}
   * @public
   */
  getNextPosition3D( currentPosition, bounds, dt ) {
    this.directionChangeCountdown -= dt;
    if ( this.directionChangeCountdown <= 0 ) {

      // Time to change direction.
      const newXYVelocity = MIN_XY_VELOCITY + dotRandom.nextDouble() * ( MAX_XY_VELOCITY - MIN_XY_VELOCITY );
      const newXYAngle = Math.PI * 2 * dotRandom.nextDouble();
      this.currentMotionVector2D = Vector2.createPolar( newXYVelocity, newXYAngle );
      this.currentZVelocity = MIN_Z_VELOCITY + dotRandom.nextDouble() * ( MAX_Z_VELOCITY - MIN_Z_VELOCITY );
      this.currentZVelocity = dotRandom.nextBoolean() ? -this.currentZVelocity : this.currentZVelocity;

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
}

geneExpressionEssentials.register( 'RandomWalkMotionStrategy', RandomWalkMotionStrategy );

export default RandomWalkMotionStrategy;