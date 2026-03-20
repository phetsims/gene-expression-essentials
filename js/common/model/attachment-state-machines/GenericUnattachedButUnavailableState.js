// Copyright 2015-2026, University of Colorado Boulder

/**
 * GenericUnattachedButUnavailableState is a generic state when biomolecule is unattached but unavailable
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import AttachmentState from './AttachmentState.js';

// constants
const DEFAULT_DETACH_TIME = 3; // In seconds.

class GenericUnattachedButUnavailableState extends AttachmentState {

  /**
   */
  constructor() {
    super();
    this.detachCountdownTime = DEFAULT_DETACH_TIME; //@private
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @param {number} dt
   * @public
   */
  step( enclosingStateMachine, dt ) {
    const gsm = enclosingStateMachine;

    // Verify that state is consistent
    assert && assert( gsm.attachmentSite === null );

    // See if we've been detached long enough.
    this.detachCountdownTime -= dt;
    if ( this.detachCountdownTime <= 0 ) {

      // Move to the unattached-and-available state.
      gsm.setState( gsm.unattachedAndAvailableState );
    }
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered( enclosingStateMachine ) {
    this.detachCountdownTime = DEFAULT_DETACH_TIME;

    // Allow user interaction.
    enclosingStateMachine.biomolecule.movableByUserProperty.set( true );
  }
}

export default GenericUnattachedButUnavailableState;
