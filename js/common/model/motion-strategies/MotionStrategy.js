// Copyright 2015, University of Colorado Boulder
/**
 /**
 * Base class for motion strategies that can be used to exhibit different sorts of motion. This class and its subclasses
 * have been written to be very general in order to enable reuse.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );
  var Range = require( 'DOT/Range' );
  var MotionBounds = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionBounds' );

  function MotionStrategy() {
    this.motionBounds = new MotionBounds();
  }

  geneExpressionEssentials.register( 'MotionStrategy', MotionStrategy );

  return inherit( Object, MotionStrategy, {

    /**
     * Get the next location given the current position. State information contained in the motion strategy instance,
     * such as the current motion vector, will determine the next position.
     *
     * @param {Vector2} currentLocation
     * @param {Shape} shape   Shape of the controlled item, used in detecting
     *                        whether the item would go outside of the motion
     *                        bounds.
     * @param {number} dt
     * @return
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      throw new Error( 'getNextLocation should be implemented in descendant classes of MotionStrategy .' );
    },


    /**
     * Get the next location in three dimensions given the current position. State information contained in the motion
     * strategy instance, such as the current motion vector, will determine the next position.
     *
     * @param {Vector3} currentLocation
     * @param {Shape} shape   Shape of the controlled item, used in detecting
     *                        whether the item would go outside of the motion
     *                        bounds.
     * @param {number} dt
     * @return
     */
    getNextLocation3D: function( currentLocation, shape, dt ) {

      // Default version does not move in Z direction, override for true 3D motion.
      var nextLocation2D = this.getNextLocation( new Vector2( currentLocation.x, currentLocation.y ), shape, dt );
      return new Vector3( nextLocation2D.x, nextLocation2D.y, 0 );
    },

    /**
     * private method
     * @param {Vector2} motionVector
     * @param {number} dt
     */
    getMotionTransform: function( motionVector, dt ) {
      return Matrix3.translation( motionVector.x * dt, motionVector.y * dt );
    },

    /**
     * This utility method will return a motion vector that reflects a "bounce" in the x, y, or both directions based on
     * which type of bounce will yield a next location for the shape that is within the motion bounds. If no such vector
     * can be found, a vector to the center of the motion bounds is returned.
     *
     * @param {Shape} shape
     * @param {Vector2} originalMotionVector
     * @param {number} dt
     * @param {number} maxVelocity
     * @returns {Vector2}
     */
    getMotionVectorForBounce: function( shape, originalMotionVector, dt, maxVelocity ) {
      // Check that this isn't being called inappropriately
      var currentMotionTransform = this.getMotionTransform( originalMotionVector, dt );
      assert && assert( !this.motionBounds.inBounds( shape.transformed( currentMotionTransform ) ) );

      // Try reversing X direction.
      var reversedXMotionVector = new Vector2( -originalMotionVector.x, originalMotionVector.y );
      var reverseXMotionTransform = this.getMotionTransform( reversedXMotionVector, dt );
      if ( this.motionBounds.inBounds( shape.transformed( reverseXMotionTransform ) ) ) {
        return reversedXMotionVector;
      }

      // Try reversing Y direction.
      var reversedYMotionVector = new Vector2( originalMotionVector.x, -originalMotionVector.y );
      var reverseYMotionTransform = this.getMotionTransform( reversedYMotionVector, dt );
      if ( this.motionBounds.inBounds( shape.transformed( reverseYMotionTransform ) ) ) {
        return reversedYMotionVector;
      }

      // Try reversing both X and Y directions.
      var reversedXYMotionVector = new Vector2( -originalMotionVector.x, -originalMotionVector.y );
      var reverseXYMotionTransform = this.getMotionTransform( reversedXYMotionVector, dt );
      if ( this.motionBounds.inBounds( shape.transformed( reverseXYMotionTransform ) ) ) {
        return reversedXYMotionVector;
      }

      // If we reach this point, there is no vector that can be found that will bounce the molecule back into the motion
      // bounds. This might be because the molecule was dropped somewhere out of bounds, or maybe just that it is stuck
      // to the DNA or something. So, just return a vector back to the center of the motion bounds.  That should be a
      // safe bet.
      var centerOfMotionBounds = this.motionBounds.getBounds().getCenter();
      var vectorToMotionBoundsCenter = new Vector2( centerOfMotionBounds.x - shape.bounds.getCenterX(),
        centerOfMotionBounds.y - shape.bounds.getCenterY() );
      vectorToMotionBoundsCenter.multiplyScalar( maxVelocity / vectorToMotionBoundsCenter.magnitude() );
      return vectorToMotionBoundsCenter;
    },

    /**
     * Utility function for determining the distance between two ranges.
     * private static
     * @param {Range} r1
     * @param {Range} r2
     * @return {number}
     */
    calculateDistanceBetweenRanges: function( r1, r2 ) {
      var distance;
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
    },


    /**
     * Limit the Z position so that biomolecules don't look transparent when on top of the DNA, and become less
     * transparent as they get close so that they don't appear to pop forward when connected to the DNA (or just
     * wandering above it).
     *
     * @param {Shape} shape
     * @param {Vector2} positionXY
     * @return {number}
     */
    getMinZ: function( shape, positionXY ) {
      var shapeYRange = new Range( positionXY.y - shape.bounds.height / 2,
        positionXY.y + shape.bounds.height / 2 );
      var dnaYRange = new Range( CommonConstants.DNA_MOLECULE_Y_POS - CommonConstants.DNA_MOLECULE_DIAMETER / 2,
        CommonConstants.DNA_MOLECULE_Y_POS + CommonConstants.DNA_MOLECULE_DIAMETER / 2 );
      var minZ = -1;
      var distanceToEdgeOfDna = this.calculateDistanceBetweenRanges( shapeYRange, dnaYRange );
      if ( distanceToEdgeOfDna < shapeYRange.getLength() / 2 ) {

        // Limit the z-dimension so that the biomolecule is at the front when over the DNA and make a gradient as it
        // gets close to the DNA.
        minZ = -distanceToEdgeOfDna / ( shapeYRange.getLength() / 2 );
      }
      return minZ;
    }

  } );

} );
