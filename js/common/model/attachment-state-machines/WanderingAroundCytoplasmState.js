// Copyright 2015-2019, University of Colorado Boulder

/**
 * One of the states of MessengerRnaAttachmentStateMachine. In this state mRNA is wandering around the cell's cytoplasm
 * unattached to anything.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import RandomWalkMotionStrategy from '../motion-strategies/RandomWalkMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

/**
 * @constructor
 */
function WanderingAroundCytoplasmState() {
  AttachmentState.call( this );
}

geneExpressionEssentials.register( 'WanderingAroundCytoplasmState', WanderingAroundCytoplasmState );
export default inherit( AttachmentState, WanderingAroundCytoplasmState, {

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered: function( enclosingStateMachine ) {
    enclosingStateMachine.biomolecule.setMotionStrategy(
      new RandomWalkMotionStrategy( enclosingStateMachine.biomolecule.motionBoundsProperty ) );
  }
} );