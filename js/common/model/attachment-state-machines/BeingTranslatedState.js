// Copyright 2015-2020, University of Colorado Boulder

/**
 * One of the states for MessengerRnaAttachmentStateMachine. In this state mRNA is wandering around the cell's cytoplasm
 * unattached to anything.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import StillnessMotionStrategy from '../motion-strategies/StillnessMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

class BeingTranslatedState extends AttachmentState {

  constructor() {
    super();
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered( enclosingStateMachine ) {

    // Set a motion strategy that will not move this molecule, since its position will be defined by the translator(s).
    enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
  }
}

geneExpressionEssentials.register( 'BeingTranslatedState', BeingTranslatedState );

export default BeingTranslatedState;