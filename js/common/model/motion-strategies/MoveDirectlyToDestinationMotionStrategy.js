// Copyright 2015-2017, University of Colorado Boulder

/**
 * A motion strategy that moves directly to the specified destination
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );

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

    function handleMotionBoundsChanged( motionBounds ) {
      self.motionBounds = motionBounds;
    }

    motionBoundsProperty.link( handleMotionBoundsChanged );

    this.disposeMoveDirectlyToDestinationMotionStrategy = function() {
      motionBoundsProperty.unlink( handleMotionBoundsChanged );
    };

    this.velocityVector2D = new Vector2( 0, 0 ); // @private

    // Destination to which this motion strategy moves. Note that it is potentially a moving target.
    this.destinationProperty = destinationProperty; // @private

    // Fixed offset from the destination location property used when computing the actual target destination. This is
    // useful in cases where something needs to move such that some point that is not its center is positioned at the
    // destination.
    this.offsetFromDestinationProperty = destinationOffset; //@private

    // Scalar velocity with which the controlled item travels.
    this.scalarVelocity2D = velocity; //@private

  }

  geneExpressionEssentials.register( 'MoveDirectlyToDestinationMotionStrategy', MoveDirectlyToDestinationMotionStrategy );

  return inherit( MotionStrategy, MoveDirectlyToDestinationMotionStrategy, {

    /**
     * @override
     * @public
     */
    dispose: function() {
      this.disposeMoveDirectlyToDestinationMotionStrategy();
    },

    /**
     * @override
     * @param {Vector2} currentLocation
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     * @public
     */
    getNextLocation: function( currentLocation, bounds, dt ) {
      var nextLocation3D = this.getNextLocation3D( new Vector3( currentLocation.x, currentLocation.y, 0 ), bounds, dt );
      return new Vector2( nextLocation3D.x, nextLocation3D.y );
    },

    /**
     * @param {Vector2} currentLocation
     * @param {Vector2} destination
     * @param {number} velocity
     * @private
     */
    updateVelocityVector2D: function( currentLocation, destination, velocity ) {
      if ( currentLocation.distance( destination ) === 0 ) {
        this.velocityVector2D.setXY( 0, 0 );
      }
      else {
        this.velocityVector2D.set( destination.minus( currentLocation ).setMagnitude( velocity ) );
      }
    },

    /**
     * @override
     * @param {Vector3} currentLocation3D
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector3}
     * @public
     */
    getNextLocation3D: function( currentLocation3D, bounds, dt ) {

      // destination is assumed to always have a Z value of 0, i.e. at the "surface"
      var currentDestination3D = new Vector3(
        this.destinationProperty.get().x - this.offsetFromDestinationProperty.x,
        this.destinationProperty.get().y - this.offsetFromDestinationProperty.y,
        0
      );
      var currentDestination2D = new Vector2(
        this.destinationProperty.get().x - this.offsetFromDestinationProperty.x,
        this.destinationProperty.get().y - this.offsetFromDestinationProperty.y
      );
      var currentLocation2D = new Vector2( currentLocation3D.x, currentLocation3D.y );
      this.updateVelocityVector2D(
        currentLocation2D,
        new Vector2( currentDestination3D.x, currentDestination3D.y ),
        this.scalarVelocity2D
      );

      // make the Z velocity such that the front (i.e. z = 0) will be reached at the same time as the destination in XY
      // space
      var distanceToDestination2D = currentLocation2D.distance( this.destinationProperty.get() );
      var zVelocity;
      if ( distanceToDestination2D > 0 ) {
        zVelocity = Math.min(
          Math.abs( currentLocation3D.z ) / ( currentLocation2D.distance( this.destinationProperty.get() ) / this.scalarVelocity2D ),
          MAX_Z_VELOCITY
        );
      }
      else {
        zVelocity = MAX_Z_VELOCITY;
      }

      // make sure that the current motion won't move the model element past the destination
      var distanceToDestination = currentLocation2D.distance( currentDestination2D );
      if ( this.velocityVector2D.magnitude() * dt > distanceToDestination ) {
        return currentDestination3D;
      }

      // calculate the next location based on the motion vector
      return new Vector3(
        currentLocation3D.x + this.velocityVector2D.x * dt,
        currentLocation3D.y + this.velocityVector2D.y * dt,
        Util.clamp( currentLocation3D.z + zVelocity * dt, -1, 0 )
      );
    }
  } );
} );