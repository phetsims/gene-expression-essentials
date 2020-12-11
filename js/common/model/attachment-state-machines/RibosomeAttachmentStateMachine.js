// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class defined the attachment state machine for all ribosomes. Ribosomes pretty much only connect to mRNA, so
 * that's what this controls.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


// modules
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import Ribosome from '../Ribosome.js';
import GenericAttachmentStateMachine from './GenericAttachmentStateMachine.js';
import RibosomeAttachedState from './RibosomeAttachedState.js';
import UnattachedAndAvailableForMRnaAttachmentState from './UnattachedAndAvailableForMRnaAttachmentState.js';

class RibosomeAttachmentStateMachine extends GenericAttachmentStateMachine {

  /**
   * @param {MobileBiomolecule} biomolecule
   */
  constructor( biomolecule ) {
    super( biomolecule );

    // Set up a local reference of the needed type.

    this.ribosome = biomolecule; //@public

    // Protein created during translation process, null if no protein is being synthesized.
    this.proteinBeingSynthesized = null; //@public

    // Set up offset used when attaching to mRNA.
    this.setDestinationOffset( Ribosome.OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE );

    // @override - override the unattached state, since attaching to mRNA is a little different versus the default behavior
    this.unattachedAndAvailableState = new UnattachedAndAvailableForMRnaAttachmentState( this );

    // @override - Set up a non-default "attached" state, since the behavior is different from the default.
    this.attachedState = new RibosomeAttachedState( this ); //@public
  }

  /**
   * @override
   * @public
   */
  forceImmediateUnattachedAndAvailable() {
    if ( this.ribosome.getMessengerRnaBeingTranslated() !== null ) {
      this.ribosome.releaseMessengerRna();
    }
    super.forceImmediateUnattachedAndAvailable();
  }

  /**
   * detach is a little different for a ribosome, since it will likely have moved away from its original attachment
   * point on the mRNA
   * @override
   * @public
   */
  detach() {
    if ( this.attachmentSite ) {
      this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      this.attachmentSite = null;
    }
    this.forceImmediateUnattachedButUnavailable();
  }

  /**
   * returns true if the state indicates that the ribosome is currently translating mRNA, false otherwise
   * @returns {boolean}
   * @public
   */
  isTranslating() {
    return ( this.attachmentState === this.attachedState );
  }
}

geneExpressionEssentials.register( 'RibosomeAttachmentStateMachine', RibosomeAttachmentStateMachine );

export default RibosomeAttachmentStateMachine;