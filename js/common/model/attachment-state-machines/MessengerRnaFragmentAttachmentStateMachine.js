// Copyright 2015-2020, University of Colorado Boulder

/**
 * Attachment state machine for messenger RNA fragments. These fragments start their life as being attached to an mRNA
 * destroyer, and and then released into the cytoplasm to wander and fade.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import RandomWalkMotionStrategy from '../motion-strategies/RandomWalkMotionStrategy.js';
import StillnessMotionStrategy from '../motion-strategies/StillnessMotionStrategy.js';
import AttachmentState from './AttachmentState.js';
import AttachmentStateMachine from './AttachmentStateMachine.js';

// constants
const FADE_OUT_TIME = 3; // In seconds.

//------------------------------------------
// States for this attachment state machine
//------------------------------------------
class AttachedToDestroyerState extends AttachmentState {

  constructor( messengerRnaFragmentAttachmentStateMachine ) {
    super();
    this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
    biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
  }
}

class UnattachedAndFadingState extends AttachmentState {

  constructor( messengerRnaFragmentAttachmentStateMachine ) {
    super();
    this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
    assert && assert( biomolecule.existenceStrengthProperty.get() === 1 );
    biomolecule.setMotionStrategy( new RandomWalkMotionStrategy( biomolecule.motionBoundsProperty ) );
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @param {number} dt
   * @public
   */
  step( asm, dt ) {
    const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
    biomolecule.existenceStrengthProperty.set( Math.max( biomolecule.existenceStrengthProperty.get() - dt / FADE_OUT_TIME, 0 ) );
  }
}

class MessengerRnaFragmentAttachmentStateMachine extends AttachmentStateMachine {

  /**
   * @param {MobileBiomolecule} biomolecule
   */
  constructor( biomolecule ) {
    super( biomolecule );
    this.setState( new AttachedToDestroyerState( this ) );
  }

  /**
   * @override
   * @public
   */
  detach() {
    this.setState( new UnattachedAndFadingState( this ) );
  }
}

geneExpressionEssentials.register( 'MessengerRnaFragmentAttachmentStateMachine', MessengerRnaFragmentAttachmentStateMachine );

export default MessengerRnaFragmentAttachmentStateMachine;