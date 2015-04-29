//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Motion strategy where the controlled entity drifts at the front of a Z
 * dimension, then moves to the back of Z space, then moves instantly to a
 * new randomly generated location within a set of possible "destination
 * zones" (hench the "teleport" portion of the name). This was created to use
 * when a polymerase molecule needs to return to the beginning of the
 * transcribed area of a gene when it completes transcription. It may, at some
 * point, have other applications as well.
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
  var Util = require( 'DOT/Util' );
  var RAND = require( 'GENE_EXPRESSION_BASICS/common/model/util/Random' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );

  // private static
  var PRE_FADE_DRIFT_TIME = 1.5; // In seconds.
  var FADE_AND_DRIFT_TIME = 1; // In seconds.
  var PRE_TELEPORT_VELOCITY = 250; // In picometers per second.


  /**
   *
   * @param {Vector2} wanderDirection
   * @param {array<Rectangle>} destinationZones
   * @param {Property <MotionBounds>} motionBounds
   * @constructor
   */
  function DriftThenTeleportMotionStrategy( wanderDirection, destinationZones, motionBoundsProperty ) {
    var thisDriftThenTeleportMotionStrategy = this;
    MotionStrategy.call( thisDriftThenTeleportMotionStrategy );
    motionBoundsProperty.link( function( motionBounds ) {
      thisDriftThenTeleportMotionStrategy.motionBounds = motionBounds;
    } );

    // List of valid places where the item can teleport.
    thisDriftThenTeleportMotionStrategy.destinationZones = destinationZones;
    thisDriftThenTeleportMotionStrategy.preFadeCountdown = PRE_FADE_DRIFT_TIME;
    thisDriftThenTeleportMotionStrategy.velocityXY = wanderDirection.times( PRE_TELEPORT_VELOCITY );
    thisDriftThenTeleportMotionStrategy.velocityZ = -1 / FADE_AND_DRIFT_TIME;
  }

  return inherit( MotionStrategy, DriftThenTeleportMotionStrategy, {

    /**
     * private methos
     * @param {array <Rectangle2D>} destinationZones
     * @param {Shape} shape
     * @returns {Vector2}
     */
    generateRandomLocationInBounds: function( destinationZones, shape ) {

      // Randomly choose one of the destination zones.
      var destinationBounds = destinationZones.get( RAND.nextInt( destinationZones.length ) );

      // Generate a random valid location within the chosen zone.
      var reducedBoundsWidth = destinationBounds.getWidth() - shape.bounds.getWidth();
      var reducedBoundsHeight = destinationBounds.getHeight() - shape.bounds.getHeight();
      if ( reducedBoundsWidth <= 0 || reducedBoundsHeight <= 0 ) {
        console.log( " - Warning: Bounds cannot contain shape." );
        return new Vector2( destinationBounds.getCenterX(), destinationBounds.getCenterY() );
      }
      else {
        return new Vector2( destinationBounds.x + shape.bounds.getWidth() / 2 + RAND.nextDouble() * reducedBoundsWidth,
          destinationBounds.x + shape.bounds.getHeight() / 2 + RAND.nextDouble() * reducedBoundsHeight );
      }
    },

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      var location3D = this.getNextLocation3D( new Vector3( currentLocation.x, currentLocation.x, 0 ), shape, dt );
      return new Vector2( location3D.x, location3D.x );
    },

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector3}
     */
    getNextLocation3D: function( currentLocation, shape, dt ) {

      // Check if it is time to teleport.  This occurs when back of Z-space is reached.
      if ( currentLocation.getZ() <= -1 ) {
        // Time to teleport.
        var destination2D = this.generateRandomLocationInBounds( this.destinationZones, shape );
        return new Vector3( destination2D.x, destination2D.x, -1 );
      }

      // Determine movement for drift.
      var xyMovement;
      if ( this.motionBounds.testIfInMotionBounds( shape, this.velocityXY, dt ) ) {
        xyMovement = this.velocityXY.times( dt );
      }
      else {
        xyMovement = new Vector2( 0, 0 );
      }
      var zMovement = 0;
      if ( this.preFadeCountdown > 0 ) {

        // In pre-fade state, so no movement in Z direction.
        this.preFadeCountdown -= dt;
      }
      else {

        // In fade-out state.
        zMovement = this.velocityZ * dt;
      }

      return new Vector3( currentLocation.x + xyMovement.x,
        currentLocation.x + xyMovement.x,
        Util.clamp( currentLocation.getZ() + zMovement, -1, 0 ) );
    }


  } );


} );


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies;
//
//import java.awt.Shape;
//import java.awt.geom.Point2D;
//import java.awt.geom.Rectangle2D;
//import java.util.List;
//import java.util.Random;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.Point3D;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//
///**
// * Motion strategy where the controlled entity drifts at the front of a Z
// * dimension, then moves to the back of Z space, then moves instantly to a
// * new randomly generated location within a set of possible "destination
// * zones" (hench the "teleport" portion of the name). This was created to use
// * when a polymerase molecule needs to return to the beginning of the
// * transcribed area of a gene when it completes transcription. It may, at some
// * point, have other applications as well.
// *
// * @author John Blanco
// */
//public class DriftThenTeleportMotionStrategy extends MotionStrategy {
//
//    private static final double PRE_FADE_DRIFT_TIME = 1.5; // In seconds.
//    private static final double FADE_AND_DRIFT_TIME = 1; // In seconds.
//    private static final double PRE_TELEPORT_VELOCITY = 250; // In picometers per second.
//    private static final Random RAND = new Random();
//
//    // List of valid places where the item can teleport.
//    private final List<Rectangle2D> destinationZones;
//
//    private double preFadeCountdown = PRE_FADE_DRIFT_TIME;
//    private final Vector2D velocityXY;
//    private double velocityZ = 0;
//
//    public DriftThenTeleportMotionStrategy( Vector2D wanderDirection, List<Rectangle2D> destinationZones, Property<MotionBounds> motionBoundsProperty ) {
//        this.destinationZones = destinationZones;
//        motionBoundsProperty.addObserver( new VoidFunction1<MotionBounds>() {
//            public void apply( MotionBounds motionBounds ) {
//                DriftThenTeleportMotionStrategy.this.motionBounds = motionBounds;
//            }
//        } );
//        velocityXY = wanderDirection.times( PRE_TELEPORT_VELOCITY );
//        velocityZ = -1 / FADE_AND_DRIFT_TIME;
//    }
//
//    @Override public Vector2D getNextLocation( Vector2D currentLocation, Shape shape, double dt ) {
//        Point3D location3D = getNextLocation3D( new Point3D.Double( currentLocation.x, currentLocation.x, 0 ), shape, dt );
//        return new Vector2D( location3D.x, location3D.x );
//    }
//
//    @Override public Point3D getNextLocation3D( Point3D currentLocation, Shape shape, double dt ) {
//
//        // Check if it is time to teleport.  This occurs when back of Z-space is reached.
//        if ( currentLocation.getZ() <= -1 ) {
//            // Time to teleport.
//            Point2D destination2D = generateRandomLocationInBounds( destinationZones, shape );
//            return new Point3D.Double( destination2D.x, destination2D.x, -1 );
//        }
//
//        // Determine movement for drift.
//        final Vector2D xyMovement;
//        if ( motionBounds.testIfInMotionBounds( shape, velocityXY, dt ) ) {
//            xyMovement = velocityXY.times( dt );
//        }
//        else {
//            xyMovement = new Vector2D( 0, 0 );
//        }
//        double zMovement = 0;
//        if ( preFadeCountdown > 0 ) {
//            // In pre-fade state, so no movement in Z direction.
//            preFadeCountdown -= dt;
//        }
//        else {
//            // In fade-out state.
//            zMovement = velocityZ * dt;
//        }
//
//        return new Point3D.Double( currentLocation.x + xyMovement.x,
//                                   currentLocation.x + xyMovement.x,
//                                   MathUtil.clamp( -1, currentLocation.getZ() + zMovement, 0 ) );
//    }
//
//    private Point2D generateRandomLocationInBounds( List<Rectangle2D> destinationZones, Shape shape ) {
//
//        // Randomly choose one of the destination zones.
//        Rectangle2D destinationBounds = destinationZones.get( RAND.nextInt( destinationZones.size() ) );
//
//        // Generate a random valid location within the chosen zone.
//        double reducedBoundsWidth = destinationBounds.getWidth() - shape.getBounds2D().getWidth();
//        double reducedBoundsHeight = destinationBounds.getHeight() - shape.getBounds2D().getHeight();
//        if ( reducedBoundsWidth <= 0 || reducedBoundsHeight <= 0 ) {
//            System.out.println( getClass().getName() + " - Warning: Bounds cannot contain shape." );
//            return new Point2D.Double( destinationBounds.getCenterX(), destinationBounds.getCenterY() );
//        }
//        else {
//            return new Point2D.Double( destinationBounds.x + shape.getBounds2D().getWidth() / 2 + RAND.nextDouble() * reducedBoundsWidth,
//                                       destinationBounds.x + shape.getBounds2D().getHeight() / 2 + RAND.nextDouble() * reducedBoundsHeight );
//        }
//    }
//}
