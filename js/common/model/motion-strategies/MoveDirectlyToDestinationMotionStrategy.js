// Copyright 2015-2020, University of Colorado Boulder

/**
 * A motion strategy that moves directly to the specified destination
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Utils from '../../../../../dot/js/Utils.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector3 from '../../../../../dot/js/Vector3.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

// constants
const MAX_Z_VELOCITY = 10; // Max Z velocity in normalized units.

class MoveDirectlyToDestinationMotionStrategy extends MotionStrategy {

  /**
   * @param {Property} destinationProperty
   * @param {Property} motionBoundsProperty
   * @param {Vector2} destinationOffset
   * @param {number} velocity
   */
  constructor( destinationProperty, motionBoundsProperty, destinationOffset, velocity ) {

    super();

    const handleMotionBoundsChanged = motionBounds => {
      this.motionBounds = motionBounds;
    };

    motionBoundsProperty.link( handleMotionBoundsChanged );

    this.disposeMoveDirectlyToDestinationMotionStrategy = () => {
      motionBoundsProperty.unlink( handleMotionBoundsChanged );
    };

    this.velocityVector2D = new Vector2( 0, 0 ); // @private

    // Destination to which this motion strategy moves. Note that it is potentially a moving target.
    this.destinationProperty = destinationProperty; // @private

    // Fixed offset from the destination position property used when computing the actual target destination. This is
    // useful in cases where something needs to move such that some point that is not its center is positioned at the
    // destination.
    this.offsetFromDestination = destinationOffset; //@private

    // Scalar velocity with which the controlled item travels.
    this.scalarVelocity2D = velocity; //@private
  }

  /**
   * @override
   * @public
   */
  dispose() {
    this.disposeMoveDirectlyToDestinationMotionStrategy();
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
    const nextPosition3D = this.getNextPosition3D( new Vector3( currentPosition.x, currentPosition.y, 0 ), bounds, dt );
    return new Vector2( nextPosition3D.x, nextPosition3D.y );
  }

  /**
   * @param {Vector2} currentPosition
   * @param {Vector2} destination
   * @param {number} velocity
   * @private
   */
  updateVelocityVector2D( currentPosition, destination, velocity ) {
    if ( currentPosition.distance( destination ) === 0 ) {
      this.velocityVector2D.setXY( 0, 0 );
    }
    else {
      this.velocityVector2D.set( destination.minus( currentPosition ).setMagnitude( velocity ) );
    }
  }

  /**
   * @override
   * @param {Vector3} currentPosition3D
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector3}
   * @public
   */
  getNextPosition3D( currentPosition3D, bounds, dt ) {

    // destination is assumed to always have a Z value of 0, i.e. at the "surface"
    const currentDestination3D = new Vector3(
      this.destinationProperty.get().x - this.offsetFromDestination.x,
      this.destinationProperty.get().y - this.offsetFromDestination.y,
      0
    );
    const currentDestination2D = new Vector2(
      this.destinationProperty.get().x - this.offsetFromDestination.x,
      this.destinationProperty.get().y - this.offsetFromDestination.y
    );
    const currentPosition2D = new Vector2( currentPosition3D.x, currentPosition3D.y );
    this.updateVelocityVector2D(
      currentPosition2D,
      new Vector2( currentDestination3D.x, currentDestination3D.y ),
      this.scalarVelocity2D
    );

    // make the Z velocity such that the front (i.e. z = 0) will be reached at the same time as the destination in XY
    // space
    const distanceToDestination2D = currentPosition2D.distance( this.destinationProperty.get() );
    let zVelocity;
    if ( distanceToDestination2D > 0 ) {
      zVelocity = Math.min(
        Math.abs( currentPosition3D.z ) / ( currentPosition2D.distance( this.destinationProperty.get() ) / this.scalarVelocity2D ),
        MAX_Z_VELOCITY
      );
    }
    else {
      zVelocity = MAX_Z_VELOCITY;
    }

    // make sure that the current motion won't move the model element past the destination
    const distanceToDestination = currentPosition2D.distance( currentDestination2D );
    if ( this.velocityVector2D.magnitude * dt > distanceToDestination ) {
      return currentDestination3D;
    }

    // calculate the next position based on the motion vector
    return new Vector3(
      currentPosition3D.x + this.velocityVector2D.x * dt,
      currentPosition3D.y + this.velocityVector2D.y * dt,
      Utils.clamp( currentPosition3D.z + zVelocity * dt, -1, 0 )
    );
  }
}

geneExpressionEssentials.register( 'MoveDirectlyToDestinationMotionStrategy', MoveDirectlyToDestinationMotionStrategy );

export default MoveDirectlyToDestinationMotionStrategy;
