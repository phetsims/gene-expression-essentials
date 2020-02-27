// Copyright 2015-2019, University of Colorado Boulder

/**
 * Attachment state machine for messenger RNA fragments. These fragments start their life as being attached to an mRNA
 * destroyer, and and then released into the cytoplasm to wander and fade.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../../phet-core/js/inherit.js';
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
const AttachedToDestroyerState = inherit(
  AttachmentState,

  /**
   * @param {MessengerRnaFragmentAttachmentStateMachine} messengerRnaFragmentAttachmentStateMachine
   */
  function( messengerRnaFragmentAttachmentStateMachine ) {
    this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;
  },
  {
    /**
     * @override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {
      const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
      biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
    }
  }
);

const UnattachedAndFadingState = inherit(
  AttachmentState,

  /**
   * @param {MessengerRnaFragmentAttachmentStateMachine} messengerRnaFragmentAttachmentStateMachine
   */
  function( messengerRnaFragmentAttachmentStateMachine ) {
    this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;
  },
  {
    /**
     * @override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {
      const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
      assert && assert( biomolecule.existenceStrengthProperty.get() === 1 );
      biomolecule.setMotionStrategy( new RandomWalkMotionStrategy( biomolecule.motionBoundsProperty ) );
    },

    /**
     * @override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt
     */
    step: function( asm, dt ) {
      const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
      biomolecule.existenceStrengthProperty.set( Math.max( biomolecule.existenceStrengthProperty.get() - dt / FADE_OUT_TIME, 0 ) );
    }
  } );

/**
 * @param {MobileBiomolecule} biomolecule
 * @constructor
 */
function MessengerRnaFragmentAttachmentStateMachine( biomolecule ) {
  AttachmentStateMachine.call( this, biomolecule );
  this.setState( new AttachedToDestroyerState( this ) );
}

geneExpressionEssentials.register( 'MessengerRnaFragmentAttachmentStateMachine', MessengerRnaFragmentAttachmentStateMachine );

export default inherit( AttachmentStateMachine, MessengerRnaFragmentAttachmentStateMachine, {

  /**
   * @override
   * @public
   */
  detach: function() {
    this.setState( new UnattachedAndFadingState( this ) );
  }
} );