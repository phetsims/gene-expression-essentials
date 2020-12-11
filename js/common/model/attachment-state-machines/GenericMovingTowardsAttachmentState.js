// Copyright 2015-2020, University of Colorado Boulder

/**
 * GenericMovingTowardsAttachmentState is the generic moving towards attachment state
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import AttachmentState from './AttachmentState.js';

class GenericMovingTowardsAttachmentState extends AttachmentState {

  constructor( genericAttachmentStateMachine ) {
    super();
    this.genericAttachmentStateMachine = genericAttachmentStateMachine; //@public
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @param {number} dt
   * @public
   */
  step( enclosingStateMachine, dt ) {

    const gsm = enclosingStateMachine;

    // verify that state is consistent
    assert && assert( gsm.attachmentSite !== null );
    assert && assert( gsm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === this.genericAttachmentStateMachine.biomolecule );

    // calculate the position where this biomolecule must be in order to attach to the attachment site
    const destination = new Vector2(
      gsm.attachmentSite.positionProperty.get().x - gsm.destinationOffset.x,
      gsm.attachmentSite.positionProperty.get().y - gsm.destinationOffset.y
    );

    // see if the attachment site has been reached
    if ( gsm.biomolecule.getPosition().distance( destination ) < AttachmentState.ATTACHED_DISTANCE_THRESHOLD ) {

      // this molecule is now at the attachment site, so consider it attached
      gsm.setState( gsm.attachedState );
    }
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered( enclosingStateMachine ) {

    // allow user interaction
    enclosingStateMachine.biomolecule.movableByUserProperty.set( true );
  }
}

geneExpressionEssentials.register( 'GenericMovingTowardsAttachmentState', GenericMovingTowardsAttachmentState );

export default GenericMovingTowardsAttachmentState;