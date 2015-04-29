//  Copyright 2002-2014, University of Colorado Boulder
/**
 /**
 * Base class for motion strategies that can be used to exhibit different sorts
 * of motion.  This class and its subclasses have been written to be very
 * general in order to enable reuse.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var DoubleRange = require( 'GENE_EXPRESSION_BASICS/common/model/util/DoubleRange' );
  var DnaMolecule = require( 'GENE_EXPRESSION_BASICS/common/model/DnaMolecule' );
  var MotionBounds = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionBounds' );

  function MotionStrategy() {
    this.motionBounds = new MotionBounds();
  }

  return inherit( Object, MotionStrategy, {

    /**
     * Get the next location given the current position.  State information
     * contained in the motion strategy instance, such as the current motion
     * vector, will determine the next position.
     *
     * @param {Vector2} currentLocation
     * @param {Shape} shape           Shape of the controlled item, used in detecting
     *                        whether the item would go outside of the motion
     *                        bounds.
     * @param {number} dt
     * @return
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      throw new Error( 'detach should be implemented in descendant classes of MotionStrategy .' );
    },


    /**
     * Get the next location in three dimensions given the current position.
     * State information contained in the motion strategy instance, such as the
     * current motion vector, will determine the next position.
     *
     * @param {Vector3} currentLocation
     * @param {Shape} shape           Shape of the controlled item, used in detecting
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
     * This utility method will return a motion vector that reflects a "bounce"
     * in the x, y, or both directions based on which type of bounce will yield
     * a next location for the shape that is within the motion bounds.  If no
     * such vector can be found, a vector to the center of the motion bounds is
     * returned.
     *
     * @param {Shape} shape
     * @param {Vector2} originalMotionVector
     * @param {number} dt
     * @param {number} maxVelocity
     * @returns {Vector2}
     */
    getMotionVectorForBounce: function( shape, originalMotionVector, dt, maxVelocity ) {

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

      // If we reach this point, there is no vector that can be found that
      // will bounce the molecule back into the motion bounds.  This might be
      // because the molecule was dropped somewhere out of bounds, or maybe
      // just that it is stuck to the DNA or something.  So, just return a
      // vector back to the center of the motion bounds.  That should be a
      // safe bet.
      var centerOfMotionBounds = new Vector2( this.motionBounds.getBounds().bounds.getCenterX(),
        this.motionBounds.getBounds().bounds.getCenterY() );
      // TODO safi  MutableVector2D
      var vectorToMotionBoundsCenter = new Vector2( centerOfMotionBounds.x - shape.bounds.getCenterX(),
        centerOfMotionBounds.y - shape.bounds.getCenterY() );
      vectorToMotionBoundsCenter.scale( maxVelocity / vectorToMotionBoundsCenter.magnitude() );
      return new Vector2( vectorToMotionBoundsCenter );
    },

    /**
     * Utility function for determining the distance between two ranges.
     * private static
     * @param {DoubleRange} r1
     * @param {DoubleRange} r2
     * @return {number}
     */

    calculateDistanceBetweenRanges: function( r1, r2 ) {
      var distance;
      if ( this.rangesOverlap( r1, r2 ) ) {
        // Ranges overlap, so there is no distance between them.
        distance = 0;
      }
      else if ( r1.getMax() < r2.getMin() ) {
        distance = r2.getMin() - r1.getMax();
      }
      else {
        distance = r1.getMin() - r2.getMax();
      }
      return distance;
    },


    /**
     * Utility function for determining if ranges overlap.
     * private static boolean
     * @param {DoubleRange} r1
     * @param {DoubleRange} r2
     * @returns {boolean}
     */
    rangesOverlap: function( r1, r2 ) {
      return !( r1.getMin() > r2.getMax() || r1.getMax() < r2.getMin() );
    },


    /**
     * Limit the Z position so that biomolecules don't look transparent when
     * on top of the DNA, and become less transparent as they get close so
     * that they don't appear to pop forward when connected to the DNA (or just
     * wandering above it).
     * protected
     * @param {Shape} shape
     * @param {Vector2} positionXY
     * @return {number}
     */
    getMinZ: function( shape, positionXY ) {
      var shapeYRange = new DoubleRange( positionXY.y - shape.bounds.getHeight() / 2,
        positionXY.y + shape.bounds.getHeight() / 2 );
      var dnaYRange = new DoubleRange( DnaMolecule.Y_POS - DnaMolecule.DIAMETER / 2, DnaMolecule.Y_POS + DnaMolecule.DIAMETER / 2 );
      var minZ = -1;
      var distanceToEdgeOfDna = this.calculateDistanceBetweenRanges( shapeYRange, dnaYRange );
      if ( distanceToEdgeOfDna < shapeYRange.getLength() / 2 ) {

        // Limit the z-dimension so that the biomolecule is at the front
        // when over the DNA and make a gradient as it gets close to the DNA.
        minZ = -distanceToEdgeOfDna / ( shapeYRange.getLength() / 2 );
      }
      return minZ;

    }

  } );


} );
//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies;
//
//import java.awt.Shape;
//import java.awt.geom.AffineTransform;
//import java.awt.geom.Point2D;
//
//import edu.colorado.phet.common.phetcommon.math.Point3D;
//import edu.colorado.phet.common.phetcommon.math.vector.AbstractVector2D;
//import edu.colorado.phet.common.phetcommon.math.vector.MutableVector2D;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.util.DoubleRange;
//import edu.colorado.phet.geneexpressionbasics.common.model.DnaMolecule;
//
///**
// * Base class for motion strategies that can be used to exhibit different sorts
// * of motion.  This class and its subclasses have been written to be very
// * general in order to enable reuse.
// *
// * @author John Blanco
// */
//public abstract class MotionStrategy {
//
//    protected MotionBounds motionBounds = new MotionBounds();
//
//    /**
//     * Get the next location given the current position.  State information
//     * contained in the motion strategy instance, such as the current motion
//     * vector, will determine the next position.
//     *
//     * @param currentLocation
//     * @param shape           Shape of the controlled item, used in detecting
//     *                        whether the item would go outside of the motion
//     *                        bounds.
//     * @param dt
//     * @return
//     */
//    public abstract Vector2D getNextLocation( Vector2D currentLocation, Shape shape, double dt );
//
//    /**
//     * Get the next location in three dimensions given the current position.
//     * State information contained in the motion strategy instance, such as the
//     * current motion vector, will determine the next position.
//     *
//     * @param currentLocation
//     * @param shape           Shape of the controlled item, used in detecting
//     *                        whether the item would go outside of the motion
//     *                        bounds.
//     * @param dt
//     * @return
//     */
//    public Point3D getNextLocation3D( Point3D currentLocation, Shape shape, double dt ) {
//        // Default version does not move in Z direction, override for true 3D motion.
//        Vector2D nextLocation2D = getNextLocation( new Vector2D( currentLocation.x, currentLocation.y ), shape, dt );
//        return new Point3D.Double( nextLocation2D.x, nextLocation2D.y, 0 );
//    }
//
//    /**
//     * This utility method will return a motion vector that reflects a "bounce"
//     * in the x, y, or both directions based on which type of bounce will yield
//     * a next location for the shape that is within the motion bounds.  If no
//     * such vector can be found, a vector to the center of the motion bounds is
//     * returned.
//     */
//    protected Vector2D getMotionVectorForBounce( Shape shape, Vector2D originalMotionVector, double dt, double maxVelocity ) {
//        // Check that this isn't being called inappropriately.
//        AffineTransform currentMotionTransform = getMotionTransform( originalMotionVector, dt );
//        assert ( !motionBounds.inBounds( currentMotionTransform.createTransformedShape( shape ) ) );
//
//        // Try reversing X direction.
//        Vector2D reversedXMotionVector = new Vector2D( -originalMotionVector.x, originalMotionVector.y );
//        AffineTransform reverseXMotionTransform = getMotionTransform( reversedXMotionVector, dt );
//        if ( motionBounds.inBounds( reverseXMotionTransform.createTransformedShape( shape ) ) ) {
//            return reversedXMotionVector;
//        }
//        // Try reversing Y direction.
//        Vector2D reversedYMotionVector = new Vector2D( originalMotionVector.x, -originalMotionVector.y );
//        AffineTransform reverseYMotionTransform = getMotionTransform( reversedYMotionVector, dt );
//        if ( motionBounds.inBounds( reverseYMotionTransform.createTransformedShape( shape ) ) ) {
//            return reversedYMotionVector;
//        }
//        // Try reversing both X and Y directions.
//        Vector2D reversedXYMotionVector = new Vector2D( -originalMotionVector.x, -originalMotionVector.y );
//        AffineTransform reverseXYMotionTransform = getMotionTransform( reversedXYMotionVector, dt );
//        if ( motionBounds.inBounds( reverseXYMotionTransform.createTransformedShape( shape ) ) ) {
//            return reversedXYMotionVector;
//        }
//        // If we reach this point, there is no vector that can be found that
//        // will bounce the molecule back into the motion bounds.  This might be
//        // because the molecule was dropped somewhere out of bounds, or maybe
//        // just that it is stuck to the DNA or something.  So, just return a
//        // vector back to the center of the motion bounds.  That should be a
//        // safe bet.
//        Point2D centerOfMotionBounds = new Point2D.Double( motionBounds.getBounds().getBounds2D().getCenterX(),
//                                                           motionBounds.getBounds().getBounds2D().getCenterY() );
//        MutableVector2D vectorToMotionBoundsCenter = new MutableVector2D( centerOfMotionBounds.x - shape.getBounds2D().getCenterX(),
//                                                                          centerOfMotionBounds.y - shape.getBounds2D().getCenterY() );
//        vectorToMotionBoundsCenter.scale( maxVelocity / vectorToMotionBoundsCenter.magnitude() );
//        return new Vector2D( vectorToMotionBoundsCenter );
//    }
//
//    private AffineTransform getMotionTransform( AbstractVector2D motionVector, double dt ) {
//        return AffineTransform.getTranslateInstance( motionVector.x * dt, motionVector.y * dt );
//    }
//
//    // Utility function for determining if ranges overlap.
//    private static boolean rangesOverlap( DoubleRange r1, DoubleRange r2 ) {
//        return !( r1.getMin() > r2.getMax() || r1.getMax() < r2.getMin() );
//    }
//
//    /**
//     * Utility function for determining the distance between two ranges.
//     *
//     * @param r1
//     * @param r2
//     * @return
//     */
//    private static double calculateDistanceBetweenRanges( DoubleRange r1, DoubleRange r2 ) {
//        double distance;
//        if ( rangesOverlap( r1, r2 ) ) {
//            // Ranges overlap, so there is no distance between them.
//            distance = 0;
//        }
//        else if ( r1.getMax() < r2.getMin() ) {
//            distance = r2.getMin() - r1.getMax();
//        }
//        else {
//            distance = r1.getMin() - r2.getMax();
//        }
//        return distance;
//    }
//
//    /**
//     * Limit the Z position so that biomolecules don't look transparent when
//     * on top of the DNA, and become less transparent as they get close so
//     * that they don't appear to pop forward when connected to the DNA (or just
//     * wandering above it).
//     *
//     * @param shape
//     * @param positionXY
//     * @return
//     */
//    protected static double getMinZ( Shape shape, Point2D positionXY ) {
//        DoubleRange shapeYRange = new DoubleRange( positionXY.y - shape.getBounds2D().getHeight() / 2,
//                                                   positionXY.y + shape.getBounds2D().getHeight() / 2 );
//        DoubleRange dnaYRange = new DoubleRange( DnaMolecule.Y_POS - DnaMolecule.DIAMETER / 2, DnaMolecule.Y_POS + DnaMolecule.DIAMETER / 2 );
//        double minZ = -1;
//        double distanceToEdgeOfDna = calculateDistanceBetweenRanges( shapeYRange, dnaYRange );
//        if ( distanceToEdgeOfDna < shapeYRange.getLength() / 2 ) {
//            // Limit the z-dimension so that the biomolecule is at the front
//            // when over the DNA and make a gradient as it gets close to the DNA.
//            minZ = -distanceToEdgeOfDna / ( shapeYRange.getLength() / 2 );
//        }
//        return minZ;
//    }
//}
