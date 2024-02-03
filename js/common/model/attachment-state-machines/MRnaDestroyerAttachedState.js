// Copyright 2015-2021, University of Colorado Boulder

/**
 * One of the states for MRnaDestroyerAttachmentStateMachine. Destroyer enters this state when it attached to mRNA
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import dotRandom from '../../../../../dot/js/dotRandom.js';
import Range from '../../../../../dot/js/Range.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MessengerRnaFragment from '../MessengerRnaFragment.js';
import DestroyerTrackingRnaMotionStrategy from '../motion-strategies/DestroyerTrackingRnaMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

// constants

// Scalar velocity for transcription.
const RNA_DESTRUCTION_RATE = 750; // Picometers per second.

// Range of lengths for mRNA fragments.
const MRNA_FRAGMENT_LENGTH_RANGE = new Range( 100, 400 ); // In picometers.

class MRnaDestroyerAttachedState extends AttachmentState {

  /**
   * @param {MRnaDestroyerAttachmentStateMachine} MRnaDestroyerAttachmentStateMachine
   */
  constructor( MRnaDestroyerAttachmentStateMachine ) {
    super();

    // @public (read-ony) {MRnaDestroyerAttachmentStateMachine}
    this.MRnaDestroyerAttachmentStateMachine = MRnaDestroyerAttachmentStateMachine;

    this.messengerRnaFragment = null; //@private
    this.targetFragmentLength = 0; //@private
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @param {number} dt
   * @public
   */
  step( asm, dt ) {
    const biomolecule = this.MRnaDestroyerAttachmentStateMachine.biomolecule;

    // Verify that state is consistent.
    assert && assert( asm.attachmentSite !== null );
    assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === biomolecule );

    // Grow the mRNA fragment, release it if it is time to do so.
    if ( this.messengerRnaFragment === null ) {
      this.messengerRnaFragment = new MessengerRnaFragment( biomolecule.getModel(), biomolecule.getPosition() );
      this.messengerRnaFragment.movableByUserProperty.set( false );
      biomolecule.getModel().addMobileBiomolecule( this.messengerRnaFragment );
      this.targetFragmentLength = MRNA_FRAGMENT_LENGTH_RANGE.min +
                                  dotRandom.nextDouble() * MRNA_FRAGMENT_LENGTH_RANGE.getLength();
    }
    this.messengerRnaFragment.addLength( RNA_DESTRUCTION_RATE * dt );
    if ( this.messengerRnaFragment.getLength() >= this.targetFragmentLength ) {

      // Time to release this fragment.
      this.messengerRnaFragment.releaseFromDestroyer();
      this.messengerRnaFragment = null;
    }

    // Advance the destruction of the mRNA.  Destruction must proceed more slowly when the mRNA is being synthesized
    // to avoid a situation where it gets destroyed more rapidly than it is created.
    const destructionRate = biomolecule.getMessengerRnaBeingDestroyed().beingSynthesizedProperty.get() ?
                            RNA_DESTRUCTION_RATE / 2 : RNA_DESTRUCTION_RATE;
    const destructionComplete = this.MRnaDestroyerAttachmentStateMachine.mRnaDestroyer.advanceMessengerRnaDestruction(
      destructionRate * dt
    );
    if ( destructionComplete ) {

      // Detach the current mRNA fragment.
      if ( this.messengerRnaFragment !== null ) {
        this.messengerRnaFragment.releaseFromDestroyer();
        this.messengerRnaFragment = null;
      }

      // Remove the messenger RNA that is now destroyed from the model. There should be no visual representation left
      // to it at this point.
      biomolecule.getModel().removeMessengerRna(
        this.MRnaDestroyerAttachmentStateMachine.mRnaDestroyer.getMessengerRnaBeingDestroyed()
      );
      this.MRnaDestroyerAttachmentStateMachine.mRnaDestroyer.clearMessengerRnaBeingDestroyed();

      // Release this destroyer to wander in the cytoplasm.
      asm.detach();
    }
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    const mRnaDestroyer = this.MRnaDestroyerAttachmentStateMachine.mRnaDestroyer;
    mRnaDestroyer.initiateMessengerRnaDestruction();
    mRnaDestroyer.setMotionStrategy( new DestroyerTrackingRnaMotionStrategy( mRnaDestroyer ) );

    // Turn off user interaction while mRNA is being destroyed.
    asm.biomolecule.movableByUserProperty.set( false );
  }
}

geneExpressionEssentials.register( 'MRnaDestroyerAttachedState', MRnaDestroyerAttachedState );

export default MRnaDestroyerAttachedState;