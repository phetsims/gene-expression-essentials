//  Copyright 2002-2014, University of Colorado Boulder
/**
 *
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var Util = require( 'DOT/Util' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );

  // constants
  var MAX_Z_VELOCITY = 10; // Max Z velocity in normalized units.

  /**
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
    self.velocityVector2D = new Vector2( 0, 0 );

    // Destination to which this motion strategy moves.  Note that it is
    // potentially a moving target.
    self.destinationProperty = destinationProperty;

    // Fixed offset from the destination location property used when computing
    // the actual target destination.  This is useful in cases where something
    // needs to move such that some point that is not its center is positioned
    // at the destination.
    self.offsetFromDestinationProperty = destinationOffset;

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
        this.velocityVector2D.setXY( 0, 0 );
      }
      else {
        this.velocityVector2D.set( destination.minus( currentLocation ).withMagnitude( velocity ) );
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
        zVelocity = Math.min( Math.abs( currentLocation3D.z ) / ( currentLocation2D.distance(
          this.destinationProperty.get() ) / this.scalarVelocity2D ), MAX_Z_VELOCITY );
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
        console.log( "MoveDirectlyToDestinationMotionStrategy - Warning: " +
                     "Destination is causing some portion of shape to move out of bounds." );
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
        Util.clamp( currentLocation3D.z + zVelocity * dt, -1, 0 ) );
    }

  } );

} );
