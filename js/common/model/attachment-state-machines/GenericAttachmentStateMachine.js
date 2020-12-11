// Copyright 2015-2020, University of Colorado Boulder

/**
 * Generic attachment state machine - implements basic behavior of a biomolecule.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import WanderInGeneralDirectionMotionStrategy from '../motion-strategies/WanderInGeneralDirectionMotionStrategy.js';
import AttachmentStateMachine from './AttachmentStateMachine.js';
import GenericAttachedState from './GenericAttachedState.js';
import GenericMovingTowardsAttachmentState from './GenericMovingTowardsAttachmentState.js';
import GenericUnattachedAndAvailableState from './GenericUnattachedAndAvailableState.js';
import GenericUnattachedButUnavailableState from './GenericUnattachedButUnavailableState.js';

class GenericAttachmentStateMachine extends AttachmentStateMachine {

  /**
   * @param {MobileBiomolecule} biomolecule
   */
  constructor( biomolecule ) {
    super( biomolecule );

    // @public - States used by this state machine. These are often set by subclasses to non-default values in order to
    // change the default behavior.
    this.unattachedAndAvailableState = new GenericUnattachedAndAvailableState();
    this.attachedState = new GenericAttachedState();
    this.movingTowardsAttachmentState = new GenericMovingTowardsAttachmentState( this );
    this.unattachedButUnavailableState = new GenericUnattachedButUnavailableState();
    this.setState( this.unattachedAndAvailableState );
  }

  /**
   * @override
   * @public
   */
  detach() {
    assert && assert( this.attachmentSite !== null ); // Verify internal state is consistent
    this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
    this.attachmentSite = null;
    this.forceImmediateUnattachedButUnavailable();
  }

  /**
   * @override
   * @public
   */
  forceImmediateUnattachedAndAvailable() {
    if ( this.attachmentSite !== null ) {
      this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
    }
    this.attachmentSite = null;
    this.setState( this.unattachedAndAvailableState );
  }

  /**
   * @override
   * @public
   */
  forceImmediateUnattachedButUnavailable() {
    if ( this.attachmentSite !== null ) {
      this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
    }
    this.attachmentSite = null;
    this.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy( this.biomolecule.getDetachDirection(),
      this.biomolecule.motionBoundsProperty ) );
    this.setState( this.unattachedButUnavailableState );
  }
}

geneExpressionEssentials.register( 'GenericAttachmentStateMachine', GenericAttachmentStateMachine );

export default GenericAttachmentStateMachine;