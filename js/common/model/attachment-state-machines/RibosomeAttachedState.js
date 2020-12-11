// Copyright 2015-2020, University of Colorado Boulder

/**
 * One of the states of the RibosomeAttachmentStateMachine. It defines what the ribosome does when attached to mRNA,
 * which is essentially to translate it.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import RibosomeTranslatingRnaMotionStrategy from '../motion-strategies/RibosomeTranslatingRnaMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

// constants
const RNA_TRANSLATION_RATE = 750; // picometers per second
const CLEAR_RNA_ATTACHMENT_LENGTH = 700; // length which, once translated, a new biomolecule can attach to mRNA

class RibosomeAttachedState extends AttachmentState {

  /**
   * @param {RibosomeAttachmentStateMachine} ribosomeAttachmentStateMachine
   */
  constructor( ribosomeAttachmentStateMachine ) {
    super();
    this.ribosomeAttachmentStateMachine = ribosomeAttachmentStateMachine; //@public
    this.proteinAttachmentPointScratchVector = new Vector2( 0, 0 );
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @param {number} dt
   * @public
   */
  step( asm, dt ) {

    let proteinBeingSynthesized = this.ribosomeAttachmentStateMachine.proteinBeingSynthesized;
    const ribosome = this.ribosomeAttachmentStateMachine.ribosome;
    const mRna = ribosome.getMessengerRnaBeingTranslated();

    // grow the protein
    proteinBeingSynthesized.setFullSizeProportion(
      mRna.getProportionOfRnaTranslated( ribosome )
    );
    this.proteinAttachmentPointScratchVector = ribosome.getProteinAttachmentPoint(
      this.proteinAttachmentPointScratchVector
    );
    proteinBeingSynthesized.setAttachmentPointPositionXY(
      this.proteinAttachmentPointScratchVector.x,
      this.proteinAttachmentPointScratchVector.y
    );

    // if enough translation of the mRNA has occurred, free up the attachment site on the mRNA so that other
    // biomolecules, such as another ribosome or and mRNA destroyer, can attach
    if ( asm.attachmentSite &&
         asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === ribosome &&
         mRna.getLengthOfRnaTranslated( ribosome ) > CLEAR_RNA_ATTACHMENT_LENGTH ) {
      asm.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      asm.attachmentSite = null;
    }

    // Advance the translation of the mRNA.  This must proceed more slowly if the mRNA is in the process of being
    // synthesized, otherwise the ribosome with run out of mRNA to work with.  The amount of reduction was chosen to
    // look good and to cause minimal "jumpiness" when translation and trnascription occur simultaneously.
    const translationRate = mRna.beingSynthesizedProperty.get() ? RNA_TRANSLATION_RATE * 0.4 : RNA_TRANSLATION_RATE;
    const translationComplete = ribosome.advanceMessengerRnaTranslation( translationRate * dt );
    if ( translationComplete ) {

      // release the mRNA
      ribosome.releaseMessengerRna();

      // release the protein
      proteinBeingSynthesized.release();
      proteinBeingSynthesized = null;

      // release this ribosome to wander in the cytoplasm
      asm.detach();
    }
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    const ribosome = this.ribosomeAttachmentStateMachine.ribosome;
    ribosome.initiateTranslation();
    ribosome.setMotionStrategy( new RibosomeTranslatingRnaMotionStrategy( ribosome ) );
    const proteinBeingSynthesized = ribosome.getMessengerRnaBeingTranslated().getProteinPrototype().createInstance();
    this.ribosomeAttachmentStateMachine.proteinBeingSynthesized = proteinBeingSynthesized;
    proteinBeingSynthesized.setAttachmentPointPosition( ribosome.getProteinAttachmentPoint() );
    ribosome.getModel().addMobileBiomolecule( proteinBeingSynthesized );

    // Prevent user interaction while translating.
    asm.biomolecule.movableByUserProperty.set( false );
  }
}

geneExpressionEssentials.register( 'RibosomeAttachedState', RibosomeAttachedState );

export default RibosomeAttachedState;