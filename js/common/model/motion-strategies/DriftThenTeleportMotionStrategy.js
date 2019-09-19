// Copyright 2015-2017, University of Colorado Boulder

/**
 * Motion strategy where the controlled entity drifts at the front of a Z dimension, then moves to the back of Z space,
 * then moves instantly to a new randomly generated location within a set of possible "destination zones" (hence the
 * "teleport" portion of the name). This was created to use when a polymerase molecule needs to return to the beginning
 * of the transcribed area of a gene when it completes transcription. It may, at some point, have other applications.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector3 = require( 'DOT/Vector3' );

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

    function handleMotionBoundsChanged( motionBounds ) {
      self.motionBounds = motionBounds;
    }

    motionBoundsProperty.link( handleMotionBoundsChanged );

    this.disposeDriftThenTeleportMotionStrategy = function() {
      motionBoundsProperty.unlink( handleMotionBoundsChanged );
    };

    // list of valid places where the item can teleport
    this.destinationZones = destinationZones; // @private
    this.preFadeCountdown = PRE_FADE_DRIFT_TIME; // @private
    this.velocityXY = wanderDirection.timesScalar( PRE_TELEPORT_VELOCITY ); // @private
    this.velocityZ = -1 / FADE_AND_DRIFT_TIME; // @private
  }

  geneExpressionEssentials.register( 'DriftThenTeleportMotionStrategy', DriftThenTeleportMotionStrategy );

  return inherit( MotionStrategy, DriftThenTeleportMotionStrategy, {

    /**
     * @override
     * @public
     */
    dispose: function() {
      this.disposeDriftThenTeleportMotionStrategy();
    },

    /**
     * @param {Array.<Bounds2>} destinationZones
     * @param {Bounds2} bounds
     * @returns {Vector2}
     * @private
     */
    generateRandomPositionInBounds: function( destinationZones, bounds ) {

      // randomly choose one of the destination zones
      var destinationBounds = phet.joist.random.sample( destinationZones );

      // generate a random valid location within the chosen zone
      var reducedBoundsWidth = destinationBounds.getWidth() - bounds.getWidth();
      var reducedBoundsHeight = destinationBounds.getHeight() - bounds.getHeight();
      assert && assert(
      reducedBoundsWidth > 0 && reducedBoundsHeight > 0,
        'earning: bounds cannot contain shape'
      );
      return new Vector2(
        destinationBounds.x + bounds.getWidth() / 2 + phet.joist.random.nextDouble() * reducedBoundsWidth,
        destinationBounds.y + bounds.getHeight() / 2 + phet.joist.random.nextDouble() * reducedBoundsHeight
      );
    },

    /**
     * @override
     * @param {Vector2} currentPosition
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     * @public
     */
    getNextPosition: function( currentPosition, bounds, dt ) {
      var position3D = this.getNextPosition3D( new Vector3( currentPosition.x, currentPosition.x, 0 ), bounds, dt );
      return new Vector2( position3D.x, position3D.y );
    },

    /**
     * @override
     * @param {Vector2} currentPosition
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector3}
     * @public
     */
    getNextPosition3D: function( currentPosition, bounds, dt ) {

      // Check if it is time to teleport.  This occurs when back of Z-space is reached.
      if ( currentPosition.z <= -1 ) {

        // Time to teleport.
        var destination2D = this.generateRandomPositionInBounds( this.destinationZones, bounds );
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
        currentPosition.x + xyMovement.x,
        currentPosition.y + xyMovement.y,
        Util.clamp( currentPosition.z + zMovement, -1, 0 )
      );
    }
  } );
} );
