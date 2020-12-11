// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class defined the attachment state machine for the biomolecules that destroy the messenger RNA molecules.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GenericAttachmentStateMachine from './GenericAttachmentStateMachine.js';
import MRnaDestroyerAttachedState from './MRnaDestroyerAttachedState.js';
import UnattachedAndAvailableForMRnaAttachmentState from './UnattachedAndAvailableForMRnaAttachmentState.js';

class MRnaDestroyerAttachmentStateMachine extends GenericAttachmentStateMachine {

  /**
   * @param {MessengerRnaDestroyer} messengerRnaDestroyer
   */
  constructor( messengerRnaDestroyer ) {
    super( messengerRnaDestroyer );

    // @public {MessengerRnaDestroyer}
    this.mRnaDestroyer = messengerRnaDestroyer;

    // @override - override the unattached state, since attaching to mRNA is a little different versus the default behavior
    this.unattachedAndAvailableState = new UnattachedAndAvailableForMRnaAttachmentState( this );

    // @override - Set up a non-default "attached" state, since the behavior is different from the default.
    this.attachedState = new MRnaDestroyerAttachedState( this );
  }

  /**
   * @override
   * @public
   */
  forceImmediateUnattachedAndAvailable() {
    if ( this.mRnaDestroyer.getMessengerRnaBeingDestroyed() !== null ) {

      // Abort a pending attachment to mRNA.
      this.mRnaDestroyer.getMessengerRnaBeingDestroyed().abortDestruction();
      this.mRnaDestroyer.clearMessengerRnaBeingDestroyed();
    }
    super.forceImmediateUnattachedAndAvailable();
  }
}

geneExpressionEssentials.register( 'MRnaDestroyerAttachmentStateMachine', MRnaDestroyerAttachmentStateMachine );

export default MRnaDestroyerAttachmentStateMachine;