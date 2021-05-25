// Copyright 2015-2021, University of Colorado Boulder

/**
 * Motion strategy where the controlled entity drifts at the front of a Z dimension, then moves to the back of Z space,
 * then moves instantly to a new randomly generated position within a set of possible "destination zones" (hence the
 * "teleport" portion of the name). This was created to use when a polymerase molecule needs to return to the beginning
 * of the transcribed area of a gene when it completes transcription. It may, at some point, have other applications.
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
const PRE_FADE_DRIFT_TIME = 1.5; // In seconds.
const FADE_AND_DRIFT_TIME = 1; // In seconds.
const PRE_TELEPORT_VELOCITY = 250; // In picometers per second.

class DriftThenTeleportMotionStrategy extends MotionStrategy {

  /**
   * @param {Vector2} wanderDirection
   * @param {Array.<Rectangle>} destinationZones
   * @param {Property.<MotionBounds>} motionBoundsProperty
   */
  constructor( wanderDirection, destinationZones, motionBoundsProperty ) {
    super();

    const handleMotionBoundsChanged = motionBounds => {
      this.motionBounds = motionBounds;
    };

    motionBoundsProperty.link( handleMotionBoundsChanged );

    this.disposeDriftThenTeleportMotionStrategy = () => {
      motionBoundsProperty.unlink( handleMotionBoundsChanged );
    };

    // list of valid places where the item can teleport
    this.destinationZones = destinationZones; // @private
    this.preFadeCountdown = PRE_FADE_DRIFT_TIME; // @private
    this.velocityXY = wanderDirection.timesScalar( PRE_TELEPORT_VELOCITY ); // @private
    this.velocityZ = -1 / FADE_AND_DRIFT_TIME; // @private
  }

  /**
   * @override
   * @public
   */
  dispose() {
    this.disposeDriftThenTeleportMotionStrategy();
  }

  /**
   * @param {Array.<Bounds2>} destinationZones
   * @param {Bounds2} bounds
   * @returns {Vector2}
   * @private
   */
  generateRandomPositionInBounds( destinationZones, bounds ) {

    // randomly choose one of the destination zones
    const destinationBounds = dotRandom.sample( destinationZones );

    // generate a random valid position within the chosen zone
    const reducedBoundsWidth = destinationBounds.getWidth() - bounds.getWidth();
    const reducedBoundsHeight = destinationBounds.getHeight() - bounds.getHeight();
    assert && assert(
    reducedBoundsWidth > 0 && reducedBoundsHeight > 0,
      'earning: bounds cannot contain shape'
    );
    return new Vector2(
      destinationBounds.x + bounds.getWidth() / 2 + dotRandom.nextDouble() * reducedBoundsWidth,
      destinationBounds.y + bounds.getHeight() / 2 + dotRandom.nextDouble() * reducedBoundsHeight
    );
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
    const position3D = this.getNextPosition3D( new Vector3( currentPosition.x, currentPosition.x, 0 ), bounds, dt );
    return new Vector2( position3D.x, position3D.y );
  }

  /**
   * @override
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector3}
   * @public
   */
  getNextPosition3D( currentPosition, bounds, dt ) {

    // Check if it is time to teleport.  This occurs when back of Z-space is reached.
    if ( currentPosition.z <= -1 ) {

      // Time to teleport.
      const destination2D = this.generateRandomPositionInBounds( this.destinationZones, bounds );
      return new Vector3( destination2D.x, destination2D.y, -1 );
    }

    // Determine movement for drift.
    let xyMovement;
    if ( this.motionBounds.testIfInMotionBoundsWithDelta( bounds, this.velocityXY, dt ) ) {
      xyMovement = this.velocityXY.timesScalar( dt );
    }
    else {
      xyMovement = new Vector2( 0, 0 );
    }
    let zMovement = 0;
    if ( this.preFadeCountdown > 0 ) {

      // In pre-fade state, so no movement in Z direction.
      this.preFadeCountdown -= dt;
    }
    else {

      // In fade-out state.
      zMovement = this.velocityZ * dt;
    }

    return new Vector3(
      currentPosition.x + xyMovement.x,
      currentPosition.y + xyMovement.y,
      Utils.clamp( currentPosition.z + zMovement, -1, 0 )
    );
  }
}

geneExpressionEssentials.register( 'DriftThenTeleportMotionStrategy', DriftThenTeleportMotionStrategy );

export default DriftThenTeleportMotionStrategy;
