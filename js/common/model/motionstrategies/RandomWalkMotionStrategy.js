//  Copyright 2002-2014, University of Colorado Boulder
/**
 * This class defines a motion strategy that produces a random walk, meaning
 * that items using this strategy will move in one direction for a while, then
 * switch directions and move in another.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );
  var Random = require( 'DOT/Random' );
  var Util = require( 'DOT/Util' );

  // constants
  var MIN_XY_VELOCITY = 200; // In picometers/s
  var MAX_XY_VELOCITY = 400; // In picometers/s
  var MIN_Z_VELOCITY = 0.3; // In normalized units per sec
  var MAX_Z_VELOCITY = 0.6; // In normalized units per sec
  var MIN_TIME_IN_ONE_DIRECTION = 0.25; // In seconds.
  var MAX_TIME_IN_ONE_DIRECTION = 0.8; // In seconds.
  var RAND = new Random();

  // Vector used for intermediate calculations - Added to avoid excessive creation of Vector3 instances - Ashraf
  var nextLocation3DScratchInVector = new Vector3();
  var nextLocation3DScratchOutVector = new Vector3();


  /**
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
      nextLocation3DScratchInVector.x = currentLocation.x;
      nextLocation3DScratchInVector.y = currentLocation.y;
      nextLocation3DScratchInVector.z = 0;
      nextLocation3DScratchOutVector = this.getNextLocation3D( nextLocation3DScratchInVector, shape, dt, nextLocation3DScratchOutVector );
      return new Vector2( nextLocation3DScratchOutVector.x, nextLocation3DScratchOutVector.y );
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
     * @param {Vector3} // optional output vector
     * @returns {Vector3}
     */
    getNextLocation3D: function( currentLocation, shape, dt, outputVector ) {
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

      // Make sure that current motion will not cause the model element to move outside of the motion bounds.
      if ( !this.motionBounds.testIfInMotionBounds( shape, this.currentMotionVector2D, dt ) ) {

        // The current motion vector would take this element out of bounds, so it needs to "bounce".
        this.currentMotionVector2D = this.getMotionVectorForBounce( shape, this.currentMotionVector2D, dt, MAX_XY_VELOCITY );

        // Reset the timer.
        this.directionChangeCountdown = this.generateDirectionChangeCountdownValue();
      }

      // To prevent odd-looking situations, the Z direction is limited so
      // that biomolecules don't appear transparent when on top of the DNA
      // molecule.
      var minZ = this.getMinZ( shape, currentLocation );

      outputVector = outputVector || new Vector3();

      // Calculate the next location based on current motion.
      outputVector.x = currentLocation.x + this.currentMotionVector2D.x * dt;
      outputVector.y = currentLocation.y + this.currentMotionVector2D.y * dt;
      outputVector.z = Util.clamp( currentLocation.z + this.currentZVelocity * dt, minZ, 0 );

      return outputVector;
    }

  } );


} );

