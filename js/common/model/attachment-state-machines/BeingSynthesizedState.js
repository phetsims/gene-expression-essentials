// Copyright 2015-2019, University of Colorado Boulder

/**
 * One of the states for MessengerRnaAttachmentStateMachine. mRna enters this state when it is being synthesized.
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import StillnessMotionStrategy from '../motion-strategies/StillnessMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

/**
 *
 * @constructor
 */
function BeingSynthesizedState() {
  AttachmentState.call( this );
}

geneExpressionEssentials.register( 'BeingSynthesizedState', BeingSynthesizedState );

export default inherit( AttachmentState, BeingSynthesizedState, {

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered: function( enclosingStateMachine ) {
    // Set the motion strategy to something that doesn't move the molecule, since its position will be controlled by
    // the polymerase that is synthesizing it.
    enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
  }
} );