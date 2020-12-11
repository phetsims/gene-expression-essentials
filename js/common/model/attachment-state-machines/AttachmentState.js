// Copyright 2015-2020, University of Colorado Boulder

/**
 * Base class for individual attachment states, used by the various attachment state machines.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';

class AttachmentState {

  /**
   * @abstract class
   */
  constructor() {
    // does nothing in base type
  }

  /**
   * Step function for this attachment state and is called by the step function of AttachmentStateMachine
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @param {number} dt
   * @public
   */
  step( enclosingStateMachine, dt ) {
    // By default does nothing, override to implement unique behavior.
  }

  /**
   * This is called whenever biomolecules state changes. This is called when setState function of
   * AttachmentStateMachine is called
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered( enclosingStateMachine ) {
    // By default does nothing, override to implement unique behavior.
  }

}

// Distance within which a molecule is considered to be attached to an attachment site. This essentially avoids
// floating point issues.
AttachmentState.ATTACHED_DISTANCE_THRESHOLD = 1;

geneExpressionEssentials.register( 'AttachmentState', AttachmentState );

export default AttachmentState;