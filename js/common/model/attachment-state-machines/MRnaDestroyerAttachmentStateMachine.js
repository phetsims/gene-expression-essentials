// Copyright 2015-2019, University of Colorado Boulder

/**
 * This class defined the attachment state machine for the biomolecules that destroy the messenger RNA molecules.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GenericAttachmentStateMachine from './GenericAttachmentStateMachine.js';
import MRnaDestroyerAttachedState from './MRnaDestroyerAttachedState.js';
import UnattachedAndAvailableForMRnaAttachmentState from './UnattachedAndAvailableForMRnaAttachmentState.js';

/**
 * @param {MessengerRnaDestroyer} messengerRnaDestroyer
 * @constructor
 */
function MRnaDestroyerAttachmentStateMachine( messengerRnaDestroyer ) {
  GenericAttachmentStateMachine.call( this, messengerRnaDestroyer );

  // @public {MessengerRnaDestroyer}
  this.mRnaDestroyer = messengerRnaDestroyer;

  // @override - override the unattached state, since attaching to mRNA is a little different versus the default behavior
  this.unattachedAndAvailableState = new UnattachedAndAvailableForMRnaAttachmentState( this );

  // @override - Set up a non-default "attached" state, since the behavior is different from the default.
  this.attachedState = new MRnaDestroyerAttachedState( this );
}

geneExpressionEssentials.register( 'MRnaDestroyerAttachmentStateMachine', MRnaDestroyerAttachmentStateMachine );

export default inherit( GenericAttachmentStateMachine, MRnaDestroyerAttachmentStateMachine, {

  /**
   * @override
   * @public
   */
  forceImmediateUnattachedAndAvailable: function() {
    if ( this.mRnaDestroyer.getMessengerRnaBeingDestroyed() !== null ) {

      // Abort a pending attachment to mRNA.
      this.mRnaDestroyer.getMessengerRnaBeingDestroyed().abortDestruction();
      this.mRnaDestroyer.clearMessengerRnaBeingDestroyed();
    }
    GenericAttachmentStateMachine.prototype.forceImmediateUnattachedAndAvailable.call( this );
  }

} );