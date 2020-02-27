// Copyright 2017-2019, University of Colorado Boulder

/**
 * One of the states used in RibosomeAttachmentStateMachine and MMRnaDestroyerAttachmentStateMachine. This state
 * descends from the GenericUnattachedAndAvailableState, but it handles a special case where it has to move differently
 * if the mRNA is in the process of being transcribed (aka synthesized).  This state is only used for attachments that
 * are formed with messenger RNA (mRNA).
 *
 * For more information about why this sub-type is needed, please see:
 * It is set up like this due to https://github.com/phetsims/gene-expression-essentials/issues/24
 * It is set up like this due to https://github.com/phetsims/gene-expression-essentials/issues/91
 *
 * @author John Blanco
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GEEConstants from '../../GEEConstants.js';
import MeanderToDestinationMotionStrategy from '../motion-strategies/MeanderToDestinationMotionStrategy.js';
import MoveDirectlyToDestinationMotionStrategy from '../motion-strategies/MoveDirectlyToDestinationMotionStrategy.js';
import GenericUnattachedAndAvailableState from './GenericUnattachedAndAvailableState.js';

/**
 * @constructor
 * @param  {AttachmentStateMachine} attachmentStateMachine
 */
function UnattachedAndAvailableForMRnaAttachmentState( attachmentStateMachine ) {
  GenericUnattachedAndAvailableState.call( this, attachmentStateMachine );
  this.attachmentStateMachine = attachmentStateMachine; //@public
}

geneExpressionEssentials.register(
  'UnattachedAndAvailableForMRnaAttachmentState',
  UnattachedAndAvailableForMRnaAttachmentState
);

export default inherit( GenericUnattachedAndAvailableState, UnattachedAndAvailableForMRnaAttachmentState, {

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @param {number} dt
   * @public
   */
  step: function( enclosingStateMachine, dt ) {
    const gsm = enclosingStateMachine;

    // verify that state is consistent
    assert && assert( gsm.attachmentSite === null );

    // make the biomolecule look for attachments
    gsm.attachmentSite = gsm.biomolecule.proposeAttachments();
    if ( gsm.attachmentSite !== null ) {

      // A proposal was accepted.  Mark the attachment site as being in use.
      gsm.attachmentSite.attachedOrAttachingMoleculeProperty.set( gsm.biomolecule );

      // Start moving towards the attachment site on the mRNA.  If the mRNA is being transcribed (aka synthesized),
      // it will be moving rapidly, so we will need a motion strategy that moves to it quickly.
      if ( gsm.attachmentSite.owner.beingSynthesizedProperty.get() ) {

        gsm.biomolecule.setMotionStrategy(
          new MoveDirectlyToDestinationMotionStrategy(
            gsm.attachmentSite.positionProperty,
            gsm.biomolecule.motionBoundsProperty,
            gsm.destinationOffset,
            GEEConstants.TRANSCRIPTION_SPEED * 2
          )
        );
      }
      else {
        gsm.biomolecule.setMotionStrategy(
          new MeanderToDestinationMotionStrategy(
            gsm.attachmentSite.positionProperty,
            gsm.biomolecule.motionBoundsProperty,
            gsm.destinationOffset
          )
        );
      }

      // Update state.
      gsm.setState( gsm.movingTowardsAttachmentState );
    }
  }
} );