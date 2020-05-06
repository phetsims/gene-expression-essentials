// Copyright 2015-2020, University of Colorado Boulder

/**
 * Attachment state machine for all protein molecules. This class controls how protein molecules behave with respect to
 * attachments.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import StillnessMotionStrategy from '../motion-strategies/StillnessMotionStrategy.js';
import AttachmentState from './AttachmentState.js';
import GenericAttachmentStateMachine from './GenericAttachmentStateMachine.js';

//------------------------------------------
//States for this attachment state machine
//------------------------------------------
const ProteinAttachedToRibosomeState = inherit( AttachmentState,

  /**
   * @param {ProteinAttachmentStateMachine} proteinAttachmentStateMachine
   */
  function( proteinAttachmentStateMachine ) {
    this.proteinAttachmentStateMachine = proteinAttachmentStateMachine;
  },
  {
    /**
     * @override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {
      const biomolecule = this.proteinAttachmentStateMachine.biomolecule;
      biomolecule.setMotionStrategy( new StillnessMotionStrategy() );

      // Prevent user interaction while the protein is growing.
      asm.biomolecule.movableByUserProperty.set( false );
    }
  } );

/**
 * @param biomolecule {MobileBiomolecule}
 * @constructor
 */
function ProteinAttachmentStateMachine( biomolecule ) {
  GenericAttachmentStateMachine.call( this, biomolecule );
  // Set up a new "attached" state, since the behavior is different from the default.
  this.attachedState = new ProteinAttachedToRibosomeState( this ); //@public
  this.setState( this.attachedState );
}

geneExpressionEssentials.register( 'ProteinAttachmentStateMachine', ProteinAttachmentStateMachine );
inherit( GenericAttachmentStateMachine, ProteinAttachmentStateMachine );
export default ProteinAttachmentStateMachine;