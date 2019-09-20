// Copyright 2015-2019, University of Colorado Boulder

/**
 * The generic "attached" state isn't very useful, but is included for completeness. The reason it isn't useful is
 * because the different biomolecules all have their own unique behavior with respect to attaching, and thus define
 * their own attached states.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  const FollowAttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/FollowAttachmentSite' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/WanderInGeneralDirectionMotionStrategy' );

  // constants
  const DEFAULT_ATTACH_TIME = 3; // In seconds.

  /**
   *
   * @constructor
   */
  function GenericAttachedState() {
    AttachmentState.call( this );
    this.attachCountdownTime = DEFAULT_ATTACH_TIME; //@private
  }

  geneExpressionEssentials.register( 'GenericAttachedState', GenericAttachedState );

  return inherit( AttachmentState, GenericAttachedState, {

    /**
     * @override
     * @param  {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     * @public
     */
    step: function( enclosingStateMachine, dt ) {
      const gsm = enclosingStateMachine;

      // Verify that state is consistent.
      assert && assert( gsm.attachmentSite !== null );
      assert && assert( gsm.attachmentSite.attachedOrAttachingMolecule.get() === gsm.biomolecule );

      // See if it is time to detach.
      this.attachCountdownTime -= dt;
      if ( this.attachCountdownTime <= 0 ) {

        // Detach.
        gsm.detach();
        gsm.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy(
          gsm.biomolecule.getDetachDirection(), gsm.biomolecule.motionBoundsProperty ) );
      }
    },

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @public
     */
    entered: function( enclosingStateMachine ) {
      this.attachCountdownTime = DEFAULT_ATTACH_TIME;
      enclosingStateMachine.biomolecule.setMotionStrategy(
        new FollowAttachmentSite( enclosingStateMachine.attachmentSite ) );

      // Prevent user interaction.
      enclosingStateMachine.biomolecule.movableByUserProperty.set( false );
    }
  } );
} );