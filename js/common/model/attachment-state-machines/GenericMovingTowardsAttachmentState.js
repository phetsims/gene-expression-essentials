// Copyright 2015, University of Colorado Boulder

/**
 * GenericMovingTowardsAttachmentState is the generic moving towards attachment state
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );

  function GenericMovingTowardsAttachmentState( genericAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.genericAttachmentStateMachine = genericAttachmentStateMachine; //@public
  }

  geneExpressionEssentials.register( 'GenericMovingTowardsAttachmentState', GenericMovingTowardsAttachmentState );

  return inherit( AttachmentState, GenericMovingTowardsAttachmentState, {

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     * @public
     */
    stepInTime: function( enclosingStateMachine, dt ) {
      var gsm = enclosingStateMachine;
      // Verify that state is consistent

      assert && assert( gsm.attachmentSite !== null );
      assert && assert( gsm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === this.genericAttachmentStateMachine.biomolecule );

      // Calculate the location where this biomolecule must be in order to attach to the attachment site.
      var destination = new Vector2( gsm.attachmentSite.locationProperty.get().x - gsm.destinationOffset.x,
        gsm.attachmentSite.locationProperty.get().y - gsm.destinationOffset.y );

      // See if the attachment site has been reached.
      if ( gsm.biomolecule.getPosition().distance( destination ) < AttachmentState.ATTACHED_DISTANCE_THRESHOLD ) {

        // This molecule is now at the attachment site, so consider it attached.
        gsm.setState( gsm.attachedState );
      }
    },

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @public
     */
    entered: function( enclosingStateMachine ) {
      // Allow user interaction.
      enclosingStateMachine.biomolecule.movableByUserProperty.set( true );
    }
  } );
} );