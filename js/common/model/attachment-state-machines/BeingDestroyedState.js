// Copyright 2015-2020, University of Colorado Boulder

/**
 * One of the states for MessengerRnaAttachmentStateMachine. mRna enters this state when it is being destroyed.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import StillnessMotionStrategy from '../motion-strategies/StillnessMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

class BeingDestroyedState extends AttachmentState {

  /**
   */
  constructor() {
    super();
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered( enclosingStateMachine ) {

    // Set a motion strategy that will not move this molecule, since its position will be defined by the destroyer and
    // translators.
    enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
  }
}

geneExpressionEssentials.register( 'BeingDestroyedState', BeingDestroyedState );

export default BeingDestroyedState;