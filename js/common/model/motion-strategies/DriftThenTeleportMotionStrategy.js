// Copyright 2015, University of Colorado Boulder

/**
 * Motion strategy where the controlled entity drifts at the front of a Z dimension, then moves to the back of Z space,
 * then moves instantly to a new randomly generated location within a set of possible "destination zones" (hence the
 * "teleport" portion of the name). This was created to use when a polymerase molecule needs to return to the beginning
 * of the transcribed area of a gene when it completes transcription. It may, at some point, have other applications.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );
  var Util = require( 'DOT/Util' );
  var Vector3 = require( 'DOT/Vector3' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var PRE_FADE_DRIFT_TIME = 1.5; // In seconds.
  var FADE_AND_DRIFT_TIME = 1; // In seconds.
  var PRE_TELEPORT_VELOCITY = 250; // In picometers per second.

  /**
   * @param {Vector2} wanderDirection
   * @param {Array.<Rectangle>} destinationZones
   * @param {Property.<MotionBounds>} motionBoundsProperty
   * @constructor
   */
  function DriftThenTeleportMotionStrategy( wanderDirection, destinationZones, motionBoundsProperty ) {
    var self = this;
    MotionStrategy.call( this );
    motionBoundsProperty.link( function( motionBounds ) {
      self.motionBounds = motionBounds;
    } );

    // list of valid places where the item can teleport
    this.destinationZones = destinationZones; // @private
    this.preFadeCountdown = PRE_FADE_DRIFT_TIME; // @private
    this.velocityXY = wanderDirection.timesScalar( PRE_TELEPORT_VELOCITY ); // @private
    this.velocityZ = -1 / FADE_AND_DRIFT_TIME; // @private
  }

  geneExpressionEssentials.register( 'DriftThenTeleportMotionStrategy', DriftThenTeleportMotionStrategy );

  return inherit( MotionStrategy, DriftThenTeleportMotionStrategy, {

    /**
     * @param {Array.<Bounds2>} destinationZones
     * @param {Bounds2} bounds
     * @returns {Vector2}
     * @private
     */
    generateRandomLocationInBounds: function( destinationZones, bounds ) {

      // Randomly choose one of the destination zones.
      var index = phet.joist.random.nextInt( destinationZones.length );
      var destinationBounds = destinationZones[ index ];

      // Generate a random valid location within the chosen zone.
      var reducedBoundsWidth = destinationBounds.getWidth() - bounds.getWidth();
      var reducedBoundsHeight = destinationBounds.getHeight() - bounds.getHeight();
      if ( reducedBoundsWidth <= 0 || reducedBoundsHeight <= 0 ) {
        console.log( ' - Warning: Bounds cannot contain shape.' );
        return new Vector2( destinationBounds.getCenterX(), destinationBounds.getCenterY() );
      }
      else {
        return new Vector2(
          destinationBounds.x + bounds.getWidth() / 2 + phet.joist.random.nextDouble() * reducedBoundsWidth,
          destinationBounds.y + bounds.getHeight() / 2 + phet.joist.random.nextDouble() * reducedBoundsHeight );
      }
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
      var location3D = this.getNextLocation3D( new Vector3( currentLocation.x, currentLocation.x, 0 ), bounds, dt );
      return new Vector2( location3D.x, location3D.y );
    },

    /**
     * @override
     * @param {Vector2} currentLocation
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector3}
     * @public
     */
    getNextLocation3D: function( currentLocation, bounds, dt ) {

      // Check if it is time to teleport.  This occurs when back of Z-space is reached.
      if ( currentLocation.z <= -1 ) {

        // Time to teleport.
        var destination2D = this.generateRandomLocationInBounds( this.destinationZones, bounds );
        return new Vector3( destination2D.x, destination2D.y, -1 );
      }

      // Determine movement for drift.
      var xyMovement;
      if ( this.motionBounds.testIfInMotionBoundsWithDelta( bounds, this.velocityXY, dt ) ) {
        xyMovement = this.velocityXY.timesScalar( dt );
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

      return new Vector3(
        currentLocation.x + xyMovement.x,
        currentLocation.y + xyMovement.y,
        Util.clamp( currentLocation.z + zMovement, -1, 0 )
      );
    }
  } );
} );
