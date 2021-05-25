// Copyright 2015-2021, University of Colorado Boulder

/**
 * Base class for motion strategies that can be used to exhibit different sorts of motion. This class and its subclasses
 * have been written to be very general in order to enable reuse.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector3 from '../../../../../dot/js/Vector3.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GEEConstants from '../../GEEConstants.js';
import MotionBounds from './MotionBounds.js';

class MotionStrategy {

  constructor() {
    this.motionBounds = new MotionBounds(); //@protected
  }

  /**
   * Clean up references so that this is elibible for garbage collection.  This does nothing in the base class,
   * override as needed in subclasses.
   * @public
   */
  dispose() {
  }

  /**
   * Get the next position given the current position. State information contained in the motion strategy instance,
   * such as the current motion vector, will determine the next position.
   *
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds   Bounds of the controlled item, used in detecting whether the item would go outside of
   *                           the motion bounds.
   * @param {number} dt
   * @public
   */
  getNextPosition( currentPosition, bounds, dt ) {
    throw new Error( 'getNextPosition should be implemented in descendant classes of MotionStrategy .' );
  }

  /**
   * Get the next position in three dimensions given the current position. State information contained in the motion
   * strategy instance, such as the current motion vector, will determine the next position.
   *
   * @param {Vector3} currentPosition
   * @param {Bounds2} bounds   Bounds of the controlled item, used in detecting
   *                           whether the item would go outside of the motion
   *                           bounds.
   * @param {number} dt
   * @returns {Vector3}
   * @public
   */
  getNextPosition3D( currentPosition, bounds, dt ) {

    // Default version does not move in Z direction, override for true 3D motion.
    const nextPosition2D = this.getNextPosition( new Vector2( currentPosition.x, currentPosition.y ), bounds, dt );
    return new Vector3( nextPosition2D.x, nextPosition2D.y, 0 );
  }

  /**
   * This utility method will return a motion vector that reflects a "bounce" in the x, y, or both directions based on
   * which type of bounce will yield a next position for the shape that is within the motion bounds. If no such vector
   * can be found, a vector to the center of the motion bounds is returned.
   *
   * @param {Bounds2} bounds
   * @param {Vector2} originalMotionVector
   * @param {number} dt
   * @param {number} maxVelocity
   * @returns {Vector2}
   * @protected
   */
  getMotionVectorForBounce( bounds, originalMotionVector, dt, maxVelocity ) {
    // Check that this isn't being called inappropriately
    assert && assert( !this.motionBounds.inBounds( bounds.shiftedXY( originalMotionVector.x * dt, originalMotionVector.y * dt ) ) );

    // Try reversing X direction.
    const reversedXMotionVector = new Vector2( -originalMotionVector.x, originalMotionVector.y );
    if ( this.motionBounds.inBounds( bounds.shiftedXY( reversedXMotionVector.x * dt, reversedXMotionVector.y * dt ) ) ) {
      return reversedXMotionVector;
    }

    // Try reversing Y direction.
    const reversedYMotionVector = new Vector2( originalMotionVector.x, -originalMotionVector.y );
    if ( this.motionBounds.inBounds( bounds.shiftedXY( reversedYMotionVector.x * dt, reversedYMotionVector * dt ) ) ) {
      return reversedYMotionVector;
    }

    // Try reversing both X and Y directions.
    const reversedXYMotionVector = new Vector2( -originalMotionVector.x, -originalMotionVector.y );
    if ( this.motionBounds.inBounds( bounds.shiftedXY( reversedXYMotionVector.x * dt, reversedXYMotionVector.x * dt ) ) ) {
      return reversedXYMotionVector;
    }

    // If we reach this point, there is no vector that can be found that will bounce the molecule back into the motion
    // bounds. This might be because the molecule was dropped somewhere out of bounds, or maybe just that it is stuck
    // to the DNA or something. So, just return a vector back to the center of the motion bounds.  That should be a
    // safe bet.
    const centerOfMotionBounds = this.motionBounds.getBounds().getCenter();
    const vectorToMotionBoundsCenter = new Vector2( centerOfMotionBounds.x - bounds.getCenterX(),
      centerOfMotionBounds.y - bounds.getCenterY() );
    vectorToMotionBoundsCenter.multiplyScalar( maxVelocity / vectorToMotionBoundsCenter.magnitude );
    return vectorToMotionBoundsCenter;
  }

  /**
   * Utility function for determining the distance between two ranges.
   * @param {Range} r1
   * @param {Range} r2
   * @returns {number}
   * @private
   */
  calculateDistanceBetweenRanges( r1, r2 ) {
    let distance;
    if ( r1.intersects( r2 ) ) {

      // Ranges overlap, so there is no distance between them.
      distance = 0;
    }
    else if ( r1.max < r2.min ) {
      distance = r2.min - r1.max;
    }
    else {
      distance = r1.min - r2.max;
    }
    return distance;
  }

  /**
   * Limit the Z position so that biomolecules don't look transparent when on top of the DNA, and become less
   * transparent as they get close so that they don't appear to pop forward when connected to the DNA (or just
   * wandering above it).
   *
   * @param {Bounds2} bounds
   * @param {Vector2} positionXY
   * @returns {number}
   * @protected
   */
  getMinZ( bounds, positionXY ) {
    const shapeYRange = new Range( positionXY.y - bounds.height / 2,
      positionXY.y + bounds.height / 2 );
    const dnaYRange = new Range( GEEConstants.DNA_MOLECULE_Y_POS - GEEConstants.DNA_MOLECULE_DIAMETER / 2,
      GEEConstants.DNA_MOLECULE_Y_POS + GEEConstants.DNA_MOLECULE_DIAMETER / 2 );
    let minZ = -1;
    const distanceToEdgeOfDna = this.calculateDistanceBetweenRanges( shapeYRange, dnaYRange );
    if ( distanceToEdgeOfDna < shapeYRange.getLength() / 2 ) {

      // Limit the z-dimension so that the biomolecule is at the front when over the DNA and make a gradient as it
      // gets close to the DNA.
      minZ = -distanceToEdgeOfDna / ( shapeYRange.getLength() / 2 );
    }
    return minZ;
  }
}

geneExpressionEssentials.register( 'MotionStrategy', MotionStrategy );

export default MotionStrategy;
