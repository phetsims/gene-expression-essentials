// Copyright 2015-2017, University of Colorado Boulder

/**
 * GenericUnattachedAndAvailableState is a generic state when biomolecule is unattached and available
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MeanderToDestinationMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MeanderToDestinationMotionStrategy' );
  const RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/RandomWalkMotionStrategy' );

  function GenericUnattachedAndAvailableState() {
    AttachmentState.call( this );
  }

  geneExpressionEssentials.register( 'GenericUnattachedAndAvailableState', GenericUnattachedAndAvailableState );

  return inherit( Object, GenericUnattachedAndAvailableState, {

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     * @public
     */
    step: function( enclosingStateMachine, dt ) {
      const gsm = enclosingStateMachine;

      // Verify that state is consistent
      assert && assert( gsm.attachmentSite === null );

      // Make the biomolecule look for attachments.
      gsm.attachmentSite = gsm.biomolecule.proposeAttachments();
      if ( gsm.attachmentSite !== null ) {

        // A proposal was accepted.  Mark the attachment site as being in use.
        gsm.attachmentSite.attachedOrAttachingMoleculeProperty.set( gsm.biomolecule );

        // Start moving towards the site.
        gsm.biomolecule.setMotionStrategy(
          new MeanderToDestinationMotionStrategy(
            gsm.attachmentSite.positionProperty,
            gsm.biomolecule.motionBoundsProperty,
            gsm.destinationOffset
          )
        );

        // Update state.
        gsm.setState( gsm.movingTowardsAttachmentState );
      }
    },

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @public
     */
    entered: function( enclosingStateMachine ) {
      enclosingStateMachine.biomolecule.setMotionStrategy(
        new RandomWalkMotionStrategy( enclosingStateMachine.biomolecule.motionBoundsProperty )
      );

      // Allow user interaction.
      enclosingStateMachine.biomolecule.movableByUserProperty.set( true );
    }
  } );
} );