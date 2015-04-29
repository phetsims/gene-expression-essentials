//  Copyright 2002-2014, University of Colorado Boulder
/**
 * This class defines a motion strategy that produces a random walk, meaning
 * that items using this strategy will move in one direction for a while, then
 * switch directions and move in another.
 *
 * @author John Blanco
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
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );
  var RAND = require( 'GENE_EXPRESSION_BASICS/common/model/util/Random' );
  var Util = require( 'DOT/Util' );

  //private static final
  var MIN_XY_VELOCITY = 200; // In picometers/s
  var MAX_XY_VELOCITY = 400; // In picometers/s
  var MIN_Z_VELOCITY = 0.3; // In normalized units per sec
  var MAX_Z_VELOCITY = 0.6; // In normalized units per sec
  var MIN_TIME_IN_ONE_DIRECTION = 0.25; // In seconds.
  var MAX_TIME_IN_ONE_DIRECTION = 0.8; // In seconds.


  /**
   *
   * @param {Property} motionBoundsProperty
   * @constructor
   */
  function RandomWalkMotionStrategy( motionBoundsProperty ) {
    var self = this;
    MotionStrategy.call( self );
    self.directionChangeCountdown = 0;
    self.currentMotionVector2D = new Vector2( 0, 0 );
    self.currentZVelocity = 0;
    motionBoundsProperty.link( function( motionBounds ) {
      self.motionBounds = motionBounds;
    } );

  }

  return inherit( MotionStrategy, RandomWalkMotionStrategy, {

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      var location3D = this.getNextLocation3D( new Vector3( currentLocation.x, currentLocation.getY(), 0 ), shape, dt );
      return new Vector2( location3D.x, location3D.getY() );
    },

    /**
     * private method
     * @returns {number}
     */
    generateDirectionChangeCountdownValue: function() {
      return MIN_TIME_IN_ONE_DIRECTION + RAND.nextDouble() * ( MAX_TIME_IN_ONE_DIRECTION - MIN_TIME_IN_ONE_DIRECTION );
    },


    /**
     * @Override
     * @param {Vector3} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector3}
     */
    getNextLocation3D: function( currentLocation, shape, dt ) {
      this.directionChangeCountdown -= dt;
      if ( this.directionChangeCountdown <= 0 ) {

        // Time to change direction.
        var newXYVelocity = MIN_XY_VELOCITY + RAND.nextDouble() * ( MAX_XY_VELOCITY - MIN_XY_VELOCITY );
        var newXYAngle = Math.PI * 2 * RAND.nextDouble();
        this.currentMotionVector2D = Vector2.createPolar( newXYVelocity, newXYAngle );
        this.currentZVelocity = MIN_Z_VELOCITY + RAND.nextDouble() * ( MAX_Z_VELOCITY - MIN_Z_VELOCITY );
        this.currentZVelocity = RAND.nextBoolean() ? -this.currentZVelocity : this.currentZVelocity;

        // Reset the countdown timer.
        this.directionChangeCountdown = this.generateDirectionChangeCountdownValue();
      }

      // Make sure that current motion will not cause the model element to
      // move outside of the motion bounds.
      if ( !this.motionBounds.testIfInMotionBounds( shape, this.currentMotionVector2D, dt ) ) {

        // The current motion vector would take this element out of bounds,
        // so it needs to "bounce".
        this.currentMotionVector2D = this.getMotionVectorForBounce( shape, this.currentMotionVector2D, dt, MAX_XY_VELOCITY );

        // Reset the timer.
        this.directionChangeCountdown = this.generateDirectionChangeCountdownValue();
      }

      // To prevent odd-looking situations, the Z direction is limited so
      // that biomolecules don't appear transparent when on top of the DNA
      // molecule.
      var minZ = this.getMinZ( shape, new Vector2( currentLocation.x, currentLocation.getY() ) );

      // Calculate the next location based on current motion.
      return new Vector2( currentLocation.x + this.currentMotionVector2D.x * dt,
        currentLocation.getY() + this.currentMotionVector2D.getY() * dt,
        Util.clamp( currentLocation.getZ() + this.currentZVelocity * dt, minZ, 0 ) );
    }

  } );


} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies;
//
//import java.awt.Shape;
//import java.awt.geom.Point2D;
//import java.util.Random;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.Point3D;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//
///**
// * This class defines a motion strategy that produces a random walk, meaning
// * that items using this strategy will move in one direction for a while, then
// * switch directions and move in another.
// *
// * @author John Blanco
// */
//public class RandomWalkMotionStrategy extends MotionStrategy {
//
//    private static final double MIN_XY_VELOCITY = 200; // In picometers/s
//    private static final double MAX_XY_VELOCITY = 400; // In picometers/s
//    private static final double MIN_Z_VELOCITY = 0.3; // In normalized units per sec
//    private static final double MAX_Z_VELOCITY = 0.6; // In normalized units per sec
//    private static final double MIN_TIME_IN_ONE_DIRECTION = 0.25; // In seconds.
//    private static final double MAX_TIME_IN_ONE_DIRECTION = 0.8; // In seconds.
//    private static final Random RAND = new Random();
//
//    private double directionChangeCountdown = 0;
//    private Vector2D currentMotionVector2D = new Vector2D( 0, 0 );
//    private double currentZVelocity = 0;
//
//    public RandomWalkMotionStrategy( Property<MotionBounds> motionBoundsProperty ) {
//        motionBoundsProperty.addObserver( new VoidFunction1<MotionBounds>() {
//            public void apply( MotionBounds motionBounds ) {
//                RandomWalkMotionStrategy.this.motionBounds = motionBounds;
//            }
//        } );
//    }
//
//    @Override public Vector2D getNextLocation( Vector2D currentLocation, Shape shape, double dt ) {
//        Point3D location3D = getNextLocation3D( new Point3D.Double( currentLocation.x, currentLocation.getY(), 0 ), shape, dt );
//        return new Vector2D( location3D.x, location3D.getY() );
//    }
//
//    @Override public Point3D getNextLocation3D( Point3D currentLocation, Shape shape, double dt ) {
//        directionChangeCountdown -= dt;
//        if ( directionChangeCountdown <= 0 ) {
//            // Time to change direction.
//            double newXYVelocity = MIN_XY_VELOCITY + RAND.nextDouble() * ( MAX_XY_VELOCITY - MIN_XY_VELOCITY );
//            double newXYAngle = Math.PI * 2 * RAND.nextDouble();
//            currentMotionVector2D = Vector2D.createPolar( newXYVelocity, newXYAngle );
//            currentZVelocity = MIN_Z_VELOCITY + RAND.nextDouble() * ( MAX_Z_VELOCITY - MIN_Z_VELOCITY );
//            currentZVelocity = RAND.nextBoolean() ? -currentZVelocity : currentZVelocity;
//            // Reset the countdown timer.
//            directionChangeCountdown = generateDirectionChangeCountdownValue();
//        }
//
//        // Make sure that current motion will not cause the model element to
//        // move outside of the motion bounds.
//        if ( !motionBounds.testIfInMotionBounds( shape, currentMotionVector2D, dt ) ) {
//            // The current motion vector would take this element out of bounds,
//            // so it needs to "bounce".
//            currentMotionVector2D = getMotionVectorForBounce( shape, currentMotionVector2D, dt, MAX_XY_VELOCITY );
//            // Reset the timer.
//            directionChangeCountdown = generateDirectionChangeCountdownValue();
//        }
//
//        // To prevent odd-looking situations, the Z direction is limited so
//        // that biomolecules don't appear transparent when on top of the DNA
//        // molecule.
//        double minZ = getMinZ( shape, new Point2D.Double( currentLocation.x, currentLocation.getY() ) );
//
//        // Calculate the next location based on current motion.
//        return new Point3D.Double( currentLocation.x + currentMotionVector2D.x * dt,
//                                   currentLocation.getY() + currentMotionVector2D.getY() * dt,
//                                   MathUtil.clamp( minZ, currentLocation.getZ() + currentZVelocity * dt, 0 ) );
//    }
//
//    private double generateDirectionChangeCountdownValue() {
//        return MIN_TIME_IN_ONE_DIRECTION + RAND.nextDouble() * ( MAX_TIME_IN_ONE_DIRECTION - MIN_TIME_IN_ONE_DIRECTION );
//    }
//}
