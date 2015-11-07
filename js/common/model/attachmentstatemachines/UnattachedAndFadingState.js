// Copyright 2015, University of Colorado Boulder
/**
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/WanderInGeneralDirectionMotionStrategy' );

  // constants
  var PRE_FADE_TIME = 5;
  var FADE_OUT_TIME = 2;

  /**
   * @param {MessengerRnaAttachmentStateMachine} messengerRnaAttachmentStateMachine
   * @constructor
   */
  function UnattachedAndFadingState( messengerRnaAttachmentStateMachine ) {
    this.messengerRnaAttachmentStateMachine = messengerRnaAttachmentStateMachine;
    this.preFadeCountdown = PRE_FADE_TIME;
  }

  return inherit( AttachmentState, UnattachedAndFadingState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt
     */
    stepInTime: function( asm, dt ) {
      if ( this.preFadeCountdown > 0 ) {
        this.preFadeCountdown -= dt;
      }
      else {
        var biomolecule = this.messengerRnaAttachmentStateMachine;
        biomolecule.existenceStrength = Math.max( biomolecule.existenceStrength - dt / FADE_OUT_TIME, 0 );
      }
    },

    /**
     * @Override
     * @param {AttachmentStateMachine}  asm
     */
    entered: function( asm ) {
      this.preFadeCountdown = PRE_FADE_TIME;

      // Move upwards, away from the DNA and polymerase.
      asm.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy( new Vector2( 0, 0.75 ),
        asm.biomolecule.motionBoundsProperty ) );
    }

  } );


} );
