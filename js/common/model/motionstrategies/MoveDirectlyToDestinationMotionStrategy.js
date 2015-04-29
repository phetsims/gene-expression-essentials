//  Copyright 2002-2014, University of Colorado Boulder
/**
 *
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var Util = require( 'DOT/Util' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );

  //private static
  var MAX_Z_VELOCITY = 10; // Max Z velocity in normalized units.

  /**
   *
   * @param {Property} destinationProperty
   * @param {Property} motionBoundsProperty
   * @param {Vector2} destinationOffset
   * @param {number} velocity
   * @constructor
   */
  function MoveDirectlyToDestinationMotionStrategy( destinationProperty, motionBoundsProperty, destinationOffset, velocity ) {
    var self = this;
    MotionStrategy.call( self );
    motionBoundsProperty.link( function( motionBounds ) {
        self.motionBounds = motionBounds;
      }
    );


    self.velocityVector2D = new Vector2( 0, 0 ); // MutableVector2D TODO

    // Destination to which this motion strategy moves.  Note that it is
    // potentially a moving target.
    self.destinationProperty = destinationProperty;

    // Fixed offset from the destination location property used when computing
    // the actual target destination.  This is useful in cases where something
    // needs to move such that some point that is not its center is positioned
    // at the destination.
    self.offsetFromDestinationProperty = destinationOffset;// AbstractVector2D TODO

    // Scalar velocity with which the controlled item travels.
    self.scalarVelocity2D = velocity;

  }

  return inherit( MotionStrategy, MoveDirectlyToDestinationMotionStrategy, {

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      var nextLocation3D = this.getNextLocation3D( new Vector3( currentLocation.x, currentLocation.y, 0 ), shape, dt );
      return new Vector2( nextLocation3D.x, nextLocation3D.y );
    },

    /**
     * private method
     * @param {Vector2} currentLocation
     * @param {Vector2} destination
     * @param {number} velocity
     */
    updateVelocityVector2D: function( currentLocation, destination, velocity ) {
      if ( currentLocation.distance( destination ) === 0 ) {
        this.velocityVector2D.setXY( 0, 0 ); //TODO mutableVector2d
      }
      else {
        this.velocityVector2D.set( new Vector2( currentLocation, destination ).getInstanceOfMagnitude( velocity ) );  //TODO mutableVector2d
      }
    },


    /**
     * @Override
     * @param {Vector3} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector3}
     */
    getNextLocation3D: function( currentLocation3D, shape, dt ) {

      // Destination is assumed to always have a Z value of 0, i.e. at the
      // "surface".
      var currentDestination3D = new Vector3( this.destinationProperty.get().x - this.offsetFromDestinationProperty.x,
        this.destinationProperty.get().y - this.offsetFromDestinationProperty.y,
        0 );
      var currentDestination2D = new Vector2( this.destinationProperty.get().x - this.offsetFromDestinationProperty.x,
        this.destinationProperty.get().y - this.offsetFromDestinationProperty.y );
      var currentLocation2D = new Vector2( currentLocation3D.x, currentLocation3D.y );
      this.updateVelocityVector2D( currentLocation2D,
        new Vector2( currentDestination3D.x, currentDestination3D.y ),
        this.scalarVelocity2D );

      // Make the Z velocity such that the front (i.e. z = 0) will be reached
      // at the same time as the destination in XY space.
      var distanceToDestination2D = currentLocation2D.distance( this.destinationProperty.get() );
      var zVelocity;
      if ( distanceToDestination2D > 0 ) {
        zVelocity = Math.min( Math.abs( currentLocation3D.getZ() ) / ( currentLocation2D.distance( this.destinationProperty.get() ) / this.scalarVelocity2D ), MAX_Z_VELOCITY );
      }
      else {
        zVelocity = MAX_Z_VELOCITY;
      }

      // Make sure that current motion will not cause the model element to
      // move outside of the motion bounds.
      if ( this.motionBounds.inBounds( shape ) && !this.motionBounds.testIfInMotionBounds( shape, this.velocityVector2D, dt ) ) {
        // Not sure what to do in this case, where the destination causes
        // some portion of the shape to go out of bounds.  For now, just
        // issue a warning an allow it to happen.
        console.log( "MoveDirectlyToDestinationMotionStrategy - Warning: Destination is causing some portion of shape to move out of bounds." );
      }

      // Make sure that the current motion won't move the model element past
      // the destination.
      var distanceToDestination = currentLocation2D.distance( currentDestination2D );
      if ( this.velocityVector2D.magnitude() * dt > distanceToDestination ) {
        return currentDestination3D;
      }

      // Calculate the next location based on the motion vector.
      return new Vector3( currentLocation3D.x + this.velocityVector2D.x * dt,
        currentLocation3D.y + this.velocityVector2D.y * dt,
        Util.clamp( currentLocation3D.getZ() + zVelocity * dt, -1, 0 ) );
    }


  } );


} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies;
//
//import java.awt.Shape;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.Point3D;
//import edu.colorado.phet.common.phetcommon.math.vector.AbstractVector2D;
//import edu.colorado.phet.common.phetcommon.math.vector.MutableVector2D;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//
///**
// * A motion strategy that moves directly to the specified destination.
// *
// * @author John Blanco
// */
//public class MoveDirectlyToDestinationMotionStrategy extends MotionStrategy {
//
//    private static final double MAX_Z_VELOCITY = 10; // Max Z velocity in normalized units.
//
//    private final MutableVector2D velocityVector2D = new MutableVector2D( 0, 0 );
//
//    // Destination to which this motion strategy moves.  Note that it is
//    // potentially a moving target.
//    private final Property<Vector2D> destinationProperty;
//
//    // Fixed offset from the destination location property used when computing
//    // the actual target destination.  This is useful in cases where something
//    // needs to move such that some point that is not its center is positioned
//    // at the destination.
//    private final AbstractVector2D offsetFromDestinationProperty;
//
//    // Scalar velocity with which the controlled item travels.
//    private final double scalarVelocity2D;
//
//    public MoveDirectlyToDestinationMotionStrategy( Property<Vector2D> destinationProperty, Property<MotionBounds> motionBoundsProperty, AbstractVector2D destinationOffset, double velocity ) {
//        this.destinationProperty = destinationProperty;
//        this.scalarVelocity2D = velocity;
//        this.offsetFromDestinationProperty = destinationOffset;
//        motionBoundsProperty.addObserver( new VoidFunction1<MotionBounds>() {
//            public void apply( MotionBounds motionBounds ) {
//                MoveDirectlyToDestinationMotionStrategy.this.motionBounds = motionBounds;
//            }
//        } );
//    }
//
//    @Override public Vector2D getNextLocation( Vector2D currentLocation, Shape shape, double dt ) {
//        Point3D nextLocation3D = getNextLocation3D( new Point3D.Double( currentLocation.x, currentLocation.y, 0 ), shape, dt );
//        return new Vector2D( nextLocation3D.x, nextLocation3D.y );
//    }
//
//    @Override public Point3D getNextLocation3D( Point3D currentLocation3D, Shape shape, double dt ) {
//        // Destination is assumed to always have a Z value of 0, i.e. at the
//        // "surface".
//        Point3D currentDestination3D = new Point3D.Double( destinationProperty.get().x - offsetFromDestinationProperty.x,
//                                                           destinationProperty.get().y - offsetFromDestinationProperty.y,
//                                                           0 );
//        Vector2D currentDestination2D = new Vector2D( destinationProperty.get().x - offsetFromDestinationProperty.x,
//                                                      destinationProperty.get().y - offsetFromDestinationProperty.y );
//        Vector2D currentLocation2D = new Vector2D( currentLocation3D.x, currentLocation3D.y );
//        updateVelocityVector2D( currentLocation2D,
//                                new Vector2D( currentDestination3D.x, currentDestination3D.y ),
//                                scalarVelocity2D );
//
//        // Make the Z velocity such that the front (i.e. z = 0) will be reached
//        // at the same time as the destination in XY space.
//        double distanceToDestination2D = currentLocation2D.distance( destinationProperty.get() );
//        double zVelocity;
//        if ( distanceToDestination2D > 0 ) {
//            zVelocity = Math.min( Math.abs( currentLocation3D.getZ() ) / ( currentLocation2D.distance( destinationProperty.get() ) / scalarVelocity2D ), MAX_Z_VELOCITY );
//        }
//        else {
//            zVelocity = MAX_Z_VELOCITY;
//        }
//
//        // Make sure that current motion will not cause the model element to
//        // move outside of the motion bounds.
//        if ( motionBounds.inBounds( shape ) && !motionBounds.testIfInMotionBounds( shape, velocityVector2D, dt ) ) {
//            // Not sure what to do in this case, where the destination causes
//            // some portion of the shape to go out of bounds.  For now, just
//            // issue a warning an allow it to happen.
//            System.out.println( getClass().getName() + " - Warning: Destination is causing some portion of shape to move out of bounds." );
//        }
//
//        // Make sure that the current motion won't move the model element past
//        // the destination.
//        double distanceToDestination = currentLocation2D.distance( currentDestination2D );
//        if ( velocityVector2D.magnitude() * dt > distanceToDestination ) {
//            return currentDestination3D;
//        }
//
//        // Calculate the next location based on the motion vector.
//        return new Point3D.Double( currentLocation3D.x + velocityVector2D.x * dt,
//                                   currentLocation3D.y + velocityVector2D.y * dt,
//                                   MathUtil.clamp( -1, currentLocation3D.getZ() + zVelocity * dt, 0 ) );
//    }
//
//    private void updateVelocityVector2D( Vector2D currentLocation, Vector2D destination, double velocity ) {
//        if ( currentLocation.distance( destination ) == 0 ) {
//            velocityVector2D.setComponents( 0, 0 );
//        }
//        else {
//            velocityVector2D.setValue( new Vector2D( currentLocation, destination ).getInstanceOfMagnitude( velocity ) );
//        }
//    }
//}
