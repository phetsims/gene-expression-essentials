// Copyright 2015-2026, University of Colorado Boulder

/**
 * One of the states of MessengerRnaAttachmentStateMachine. In this state mRNA is wandering around the cell's cytoplasm
 * unattached to anything.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import RandomWalkMotionStrategy from '../motion-strategies/RandomWalkMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

class WanderingAroundCytoplasmState extends AttachmentState {

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
    enclosingStateMachine.biomolecule.setMotionStrategy(
      new RandomWalkMotionStrategy( enclosingStateMachine.biomolecule.motionBoundsProperty ) );
  }
}

export default WanderingAroundCytoplasmState;
