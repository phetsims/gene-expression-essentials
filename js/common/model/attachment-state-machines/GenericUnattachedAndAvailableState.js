// Copyright 2015-2020, University of Colorado Boulder

/**
 * GenericUnattachedAndAvailableState is a generic state when biomolecule is unattached and available
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MeanderToDestinationMotionStrategy from '../motion-strategies/MeanderToDestinationMotionStrategy.js';
import RandomWalkMotionStrategy from '../motion-strategies/RandomWalkMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

class GenericUnattachedAndAvailableState extends AttachmentState {

  constructor() {
    super();
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @param {number} dt
   * @public
   */
  step( enclosingStateMachine, dt ) {
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
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered( enclosingStateMachine ) {
    enclosingStateMachine.biomolecule.setMotionStrategy(
      new RandomWalkMotionStrategy( enclosingStateMachine.biomolecule.motionBoundsProperty )
    );

    // Allow user interaction.
    enclosingStateMachine.biomolecule.movableByUserProperty.set( true );
  }
}

geneExpressionEssentials.register( 'GenericUnattachedAndAvailableState', GenericUnattachedAndAvailableState );

export default GenericUnattachedAndAvailableState;