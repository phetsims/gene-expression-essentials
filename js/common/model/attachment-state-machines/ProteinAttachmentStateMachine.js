// Copyright 2015-2020, University of Colorado Boulder

/**
 * Attachment state machine for all protein molecules. This class controls how protein molecules behave with respect to
 * attachments.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import StillnessMotionStrategy from '../motion-strategies/StillnessMotionStrategy.js';
import AttachmentState from './AttachmentState.js';
import GenericAttachmentStateMachine from './GenericAttachmentStateMachine.js';

//------------------------------------------
//States for this attachment state machine
//------------------------------------------
class ProteinAttachedToRibosomeState extends AttachmentState {

  /**
   * @param {ProteinAttachmentStateMachine} proteinAttachmentStateMachine
   */
  constructor( proteinAttachmentStateMachine ) {
    super();
    this.proteinAttachmentStateMachine = proteinAttachmentStateMachine;
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    const biomolecule = this.proteinAttachmentStateMachine.biomolecule;
    biomolecule.setMotionStrategy( new StillnessMotionStrategy() );

    // Prevent user interaction while the protein is growing.
    asm.biomolecule.movableByUserProperty.set( false );
  }
}

class ProteinAttachmentStateMachine extends GenericAttachmentStateMachine {

  /**
   * @param biomolecule {MobileBiomolecule}
   */
  constructor( biomolecule ) {
    super( biomolecule );
    // Set up a new "attached" state, since the behavior is different from the default.
    this.attachedState = new ProteinAttachedToRibosomeState( this ); //@public
    this.setState( this.attachedState );
  }
}

geneExpressionEssentials.register( 'ProteinAttachmentStateMachine', ProteinAttachmentStateMachine );
export default ProteinAttachmentStateMachine;