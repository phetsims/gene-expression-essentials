// Copyright 2015-2020, University of Colorado Boulder

/**
 * One of the states for MessengerRnaAttachmentStateMachine. mRna enters this state when it is being destroyed.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import StillnessMotionStrategy from '../motion-strategies/StillnessMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

/**
 * @constructor
 */
function BeingDestroyedState() {
  AttachmentState.call( this );
}

geneExpressionEssentials.register( 'BeingDestroyedState', BeingDestroyedState );

inherit( AttachmentState, BeingDestroyedState, {

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered: function( enclosingStateMachine ) {

    // Set a motion strategy that will not move this molecule, since its position will be defined by the destroyer and
    // translators.
    enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
  }
} );

export default BeingDestroyedState;