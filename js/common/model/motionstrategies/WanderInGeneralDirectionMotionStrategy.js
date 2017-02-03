// Copyright 2015, University of Colorado Boulder
/**
 /**
 * A motion strategy where the user moves in a general direction with some random direction changes every once in a while.
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/MotionStrategy' );


  // constants
  var MIN_VELOCITY = 100; // In picometers/s
  var MAX_VELOCITY = 500; // In picometers/s
  var MIN_TIME_IN_ONE_DIRECTION = 0.25; // In seconds.
  var MAX_TIME_IN_ONE_DIRECTION = 1.25; // In seconds.


  /**
   * @param  {Vector2} generalDirection
   * @param motionBoundsProperty
   * @constructor
   */
  function WanderInGeneralDirectionMotionStrategy( generalDirection, motionBoundsProperty ) {
    var self = this;
    MotionStrategy.call( self );
    self.directionChangeCountdown = 0;
    self.currentMotionVector = new Vector2( 0, 0 );
    motionBoundsProperty.link( function( motionBounds ) {
      self.motionBounds = motionBounds;
    } );

    self.generalDirection = generalDirection;

  }

  geneExpressionEssentials.register( 'WanderInGeneralDirectionMotionStrategy', WanderInGeneralDirectionMotionStrategy );

  return inherit( MotionStrategy, WanderInGeneralDirectionMotionStrategy, {


    /**
     * private
     * @returns {number}
     */
    generateDirectionChangeCountdownValue: function() {
      return MIN_TIME_IN_ONE_DIRECTION + phet.joist.random.nextDouble() *
                                         ( MAX_TIME_IN_ONE_DIRECTION - MIN_TIME_IN_ONE_DIRECTION );
    },


    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      this.directionChangeCountdown -= dt;
      if ( this.directionChangeCountdown <= 0 ) {

        // Time to change the direction.
        var newVelocity = MIN_VELOCITY + phet.joist.random.nextDouble() * ( MAX_VELOCITY - MIN_VELOCITY );
        var varianceAngle = ( phet.joist.random.nextDouble() - 0.5 ) * Math.PI / 3;
        this.currentMotionVector = this.generalDirection.withMagnitude( newVelocity ).rotated( varianceAngle );

        // Reset the countdown timer.
        this.directionChangeCountdown = this.generateDirectionChangeCountdownValue();
      }

      // Make sure that current motion will not cause the model element to move outside of the motion bounds.
      if ( !this.motionBounds.testIfInMotionBoundsWithDelta( shape, this.currentMotionVector, dt ) ) {

        // The current motion vector would take this element out of bounds, so it needs to "bounce".
        this.currentMotionVector = this.getMotionVectorForBounce( shape, this.currentMotionVector, dt, MAX_VELOCITY );

        // Reset the timer.
        this.directionChangeCountdown = this.generateDirectionChangeCountdownValue();
      }

      return currentLocation.plus( this.currentMotionVector.timesScalar( dt ) );
    },

    /**
     * @Override
     * @param {Vector3} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector3}
     */
    getNextLocation3D: function( currentLocation, shape, dt ) {

      // The 3D version of this motion strategy doesn't move in the z direction.  This may change some day.
      var nextLocation2D = this.getNextLocation( new Vector2( currentLocation.x, currentLocation.y ), shape, dt );
      return new Vector3( nextLocation2D.x, nextLocation2D.y, currentLocation.z );
    }

  } );


} );
