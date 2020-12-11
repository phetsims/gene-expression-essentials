// Copyright 2015-2020, University of Colorado Boulder

/**
 * One of the states for RnaPolymeraseAttachmentStateMachine. RnaPolymerase enters this state when transcription of mRna
 * is complete
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GEEConstants from '../../GEEConstants.js';
import AttachmentState from './AttachmentState.js';
import BeingRecycledState from './BeingRecycledState.js';

// constants

// the deconformation rate needs to be a little faster than the conformational change rate so that the polymerase is
// less likely to collide at the end of the gene, see https://github.com/phetsims/gene-expression-essentials/issues/102.
const DECONFORMATION_RATE = GEEConstants.CONFORMATIONAL_CHANGE_RATE * 1.25;

class AttachedAndDeconformingState extends AttachmentState {

  /**
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   */
  constructor( rnaPolymeraseAttachmentStateMachine ) {
    super();

    // @public (read-ony) {RnaPolymeraseAttachmentStateMachine}
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;

    // @private
    this.conformationalChangeAmount = 0;
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @param {number} dt
   * @public
   */
  step( asm, dt ) {
    const biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;

    // Verify that state is consistent.
    assert && assert( asm.attachmentSite !== null );
    assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === biomolecule );

    const dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;

    this.conformationalChangeAmount = Math.max(
      this.conformationalChangeAmount - DECONFORMATION_RATE * dt,
      0
    );
    biomolecule.changeConformation( this.conformationalChangeAmount );
    dnaStrandSeparation.setProportionOfTargetAmount( this.conformationalChangeAmount );
    if ( this.conformationalChangeAmount === 0 ) {
      this.detachFromDna( asm );
    }
  }

  /**
   * take the steps necessary to detach from the DNA strand
   * @public
   */
  detachFromDna() {

    const asm = this.rnaPolymeraseAttachmentStateMachine;
    const dnaStrandSeparation = asm.dnaStrandSeparation;
    const rnaPolymerase = asm.rnaPolymerase;
    let attachmentSite = asm.attachmentSite;
    const recycleMode = asm.recycleMode;
    const recycleReturnZones = asm.recycleReturnZones;
    const attachedAndWanderingState = asm.attachedAndWanderingState;

    // Remove the DNA separator, which makes the DNA close back up.
    rnaPolymerase.getModel().getDnaMolecule().removeSeparation( dnaStrandSeparation );

    // Update externally visible state indication.
    asm.biomolecule.attachedToDnaProperty.set( false );

    // Make sure that we enter the correct initial state upon the next attachment.
    this.rnaPolymeraseAttachmentStateMachine.attachedState = attachedAndWanderingState;

    // Make sure the shape is back to normal (might not be is this was knocked off the strand by another polymerase).
    if ( this.conformationalChangeAmount > 0 ) {
      this.conformationalChangeAmount = 0;
      asm.biomolecule.changeConformation( this.conformationalChangeAmount );
    }

    // Detach from the DNA.
    attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
    attachmentSite = null;
    this.rnaPolymeraseAttachmentStateMachine.attachmentSite = attachmentSite;
    if ( recycleMode ) {
      this.rnaPolymeraseAttachmentStateMachine.setState(
        new BeingRecycledState( this.rnaPolymeraseAttachmentStateMachine, recycleReturnZones )
      );
    }
    else {
      this.rnaPolymeraseAttachmentStateMachine.forceImmediateUnattachedButUnavailable();
    }
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    // Prevent user interaction.
    asm.biomolecule.movableByUserProperty.set( false );
    this.conformationalChangeAmount = 1;
  }
}

geneExpressionEssentials.register( 'AttachedAndDeconformingState', AttachedAndDeconformingState );

export default AttachedAndDeconformingState;