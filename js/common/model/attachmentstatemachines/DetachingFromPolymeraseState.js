// Copyright 2015, University of Colorado Boulder
/**
 * State where the mRNA is detaching from the polymerase. During this time, it moves generally upwards until either the
 * timer runs out or it is attached to by some biomolecule.
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
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var WanderingAroundCytoplasmState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/WanderingAroundCytoplasmState' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/WanderInGeneralDirectionMotionStrategy' );

  // constants
  var DETACHING_TIME = 3; // seconds

  function DetachingFromPolymeraseState( msgRnaAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.msgRnaAttachmentStateMachine = msgRnaAttachmentStateMachine; // parent class  reference
    this.detachingCountdownTimer = DETACHING_TIME;
  }

  geneExpressionEssentials.register( 'DetachingFromPolymeraseState', DetachingFromPolymeraseState );

  return inherit( AttachmentState, DetachingFromPolymeraseState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     */
    stepInTime: function( enclosingStateMachine, dt ) {
      this.detachingCountdownTimer -= dt;
      if ( this.detachingCountdownTimer <= 0 ) {

        // Done detaching, start wandering.
        this.msgRnaAttachmentStateMachine.setState( new WanderingAroundCytoplasmState() );
      }
    },

    /**
     * @Override
     * @param  {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {

      // Move upwards, away from the DNA and polymerase.
      enclosingStateMachine.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy(
        new Vector2( -0.5, 1 ), enclosingStateMachine.biomolecule.motionBoundsProperty ) );

      // Update externally visible state.
      this.msgRnaAttachmentStateMachine.messengerRna.beingSynthesizedProperty.set( false );
    }

  } );

} );
