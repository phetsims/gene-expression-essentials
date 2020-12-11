// Copyright 2015-2020, University of Colorado Boulder

/**
 * Attachment state machine for messenger RNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import AttachmentStateMachine from './AttachmentStateMachine.js';
import BeingDestroyedState from './BeingDestroyedState.js';
import BeingSynthesizedState from './BeingSynthesizedState.js';
import BeingTranslatedState from './BeingTranslatedState.js';
import DetachingFromPolymeraseState from './DetachingFromPolymeraseState.js';
import UnattachedAndFadingState from './UnattachedAndFadingState.js';
import WanderingAroundCytoplasmState from './WanderingAroundCytoplasmState.js';

class MessengerRnaAttachmentStateMachine extends AttachmentStateMachine {

  /**
   * @param {MessengerRna} messengerRna
   */
  constructor( messengerRna ) {
    super( messengerRna );

    // Local reference of appropriate type.
    this.messengerRna = messengerRna; //@private;

    // @private - flag to control whether the mRNA continues to exist once fully formed
    this.fadeAwayWhenFormed = false;
    this.setState( new BeingSynthesizedState() );
  }

  /**
   * @override
   * Detach from the RNA polymerase. Note that this should NOT be used to detach the mRNA from ribosomes or any other
   * biomolecules.
   * @public
   */
  detach() {
    if ( this.fadeAwayWhenFormed ) {
      this.setState( new UnattachedAndFadingState( this ) );
    }
    else {
      this.setState( new DetachingFromPolymeraseState( this ) );
    }
  }

  /**
   * @override
   * @public
   */
  forceImmediateUnattachedAndAvailable() {
    if ( this.attachmentSite !== null ) {
      const attachedOrAttachingMolecule = this.attachmentSite.attachedOrAttachingMoleculeProperty.get();

      // this is the case for when the incoming molecule is a ribosome
      attachedOrAttachingMolecule.cancelTranslation && attachedOrAttachingMolecule.cancelTranslation();

      // this is the case for when the incoming molecule is an mRNA destroyer
      attachedOrAttachingMolecule.cancelDestruction && attachedOrAttachingMolecule.cancelDestruction();

      this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
    }
    this.attachmentSite = null;
    this.setState( new WanderingAroundCytoplasmState() );
  }

  /**
   * Sets whether mRNA fades away or not when formed
   * @param {boolean} fadeAwayWhenFormed
   * @public
   */
  setFadeAwayWhenFormed( fadeAwayWhenFormed ) {
    this.fadeAwayWhenFormed = fadeAwayWhenFormed;
  }

  /**
   * Signals this state machine that at least one ribosome is now attached to the mRNA and is thus translating it.
   * @public
   */
  attachedToRibosome() {
    this.setState( new BeingTranslatedState() );
  }

  /**
   * Signals this state machine that all ribosomes that were translating it have completed the translation process and
   * have detached.
   * @public
   */
  allRibosomesDetached() {
    this.setState( new WanderingAroundCytoplasmState() );
  }

  /**
   * Signals this state machine that destroyer is now attached to the mRNA and is thus being destroyed.
   * @public
   */
  attachToDestroyer() {
    this.setState( new BeingDestroyedState() );
  }
}

geneExpressionEssentials.register( 'MessengerRnaAttachmentStateMachine', MessengerRnaAttachmentStateMachine );

export default MessengerRnaAttachmentStateMachine;