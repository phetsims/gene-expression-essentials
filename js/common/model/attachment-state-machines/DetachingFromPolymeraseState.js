// Copyright 2015-2020, University of Colorado Boulder

/**
 * One of the states for MessengerRnaAttachmentStateMachine. mRna enters this state when it is detaching from the
 * polymerase. During this time, it moves generally upwards until either the timer runs out or it is attached to by some
 * biomolecule.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import WanderInGeneralDirectionMotionStrategy from '../motion-strategies/WanderInGeneralDirectionMotionStrategy.js';
import AttachmentState from './AttachmentState.js';
import WanderingAroundCytoplasmState from './WanderingAroundCytoplasmState.js';

// constants
const DETACHING_TIME = 3; // seconds

function DetachingFromPolymeraseState( msgRnaAttachmentStateMachine ) {
  AttachmentState.call( this );

  // @public (read-ony) {RnaPolymeraseAttachmentStateMachine}
  this.msgRnaAttachmentStateMachine = msgRnaAttachmentStateMachine;

  // @private
  this.detachingCountdownTimer = DETACHING_TIME;
}

geneExpressionEssentials.register( 'DetachingFromPolymeraseState', DetachingFromPolymeraseState );

inherit( AttachmentState, DetachingFromPolymeraseState, {

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @param {number} dt
   * @public
   */
  step: function( enclosingStateMachine, dt ) {
    this.detachingCountdownTimer -= dt;
    if ( this.detachingCountdownTimer <= 0 ) {

      // Done detaching, start wandering.
      this.msgRnaAttachmentStateMachine.setState( new WanderingAroundCytoplasmState() );
    }
  },

  /**
   * @override
   * @param  {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered: function( enclosingStateMachine ) {
    // Move upwards, away from the DNA and polymerase.
    enclosingStateMachine.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy(
      new Vector2( -0.5, 1 ), enclosingStateMachine.biomolecule.motionBoundsProperty ) );

    // Update externally visible state.
    this.msgRnaAttachmentStateMachine.messengerRna.beingSynthesizedProperty.set( false );
  }
} );

export default DetachingFromPolymeraseState;