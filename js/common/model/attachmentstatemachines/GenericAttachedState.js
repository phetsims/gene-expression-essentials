//  Copyright 2002-2015, University of Colorado Boulder
/**
 * The generic "attached" state isn't very useful, but is included for
 * completeness.  The reason it isn't useful is because the different
 * biomolecules all have their own unique behavior with respect to
 * attaching, and thus define their own attached states.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/WanderInGeneralDirectionMotionStrategy' );
  var FollowAttachmentSite = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/FollowAttachmentSite' );

  // constants
  var DEFAULT_ATTACH_TIME = 3; // In seconds.
  var attachCountdownTime = DEFAULT_ATTACH_TIME;

  function GenericAttachedState() {
    AttachmentState.call( this );
  }

  return inherit( AttachmentState, GenericAttachedState, {

    /**
     * @Override
     * @param  {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     */
    stepInTime: function( enclosingStateMachine, dt ) {
      var gsm = enclosingStateMachine;

      // See if it is time to detach.
      attachCountdownTime -= dt;
      if ( attachCountdownTime <= 0 ) {

        // Detach.
        gsm.detach();
        gsm.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy(
          gsm.biomolecule.getDetachDirection(), gsm.biomolecule.motionBoundsProperty ) );
      }
    },

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {
      attachCountdownTime = DEFAULT_ATTACH_TIME;
      enclosingStateMachine.biomolecule.setMotionStrategy( new FollowAttachmentSite( enclosingStateMachine.attachmentSite ) );

      // Prevent user interaction.
      enclosingStateMachine.biomolecule.movableByUser = false;
    }


  } );


} );