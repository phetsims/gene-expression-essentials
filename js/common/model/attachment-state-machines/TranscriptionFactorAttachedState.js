// Copyright 2015-2021, University of Colorado Boulder
/**
 * One of the states for TranscriptionFactorAttachmentStateMachine. Subclass of the "attached" state.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import dotRandom from '../../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GEEConstants from '../../GEEConstants.js';
import FollowAttachmentSite from '../motion-strategies/FollowAttachmentSite.js';
import MoveDirectlyToDestinationMotionStrategy from '../motion-strategies/MoveDirectlyToDestinationMotionStrategy.js';
import WanderInGeneralDirectionMotionStrategy from '../motion-strategies/WanderInGeneralDirectionMotionStrategy.js';
import GenericAttachedState from './GenericAttachedState.js';

// constants
const HALF_LIFE_FOR_HALF_AFFINITY = 1.5; // In seconds.

class TranscriptionFactorAttachedState extends GenericAttachedState {

  /**
   * @param {TranscriptionFactorAttachmentStateMachine} transcriptionFactorAttachmentStateMachine
   */
  constructor( transcriptionFactorAttachmentStateMachine ) {
    super();
    this.transcriptionFactorAttachmentStateMachine = transcriptionFactorAttachmentStateMachine; //@public
  }

  /**
   * Calculate the probability of detachment from the current base pair during the provided time interval. This uses
   * the same mathematics as is used for calculating probabilities of decay for radioactive
   * atomic nuclei.
   *
   * @param {number} affinity
   * @param {number} dt
   * @returns {number}
   * @public
   */
  calculateProbabilityOfDetachment( affinity, dt ) {

    // Map affinity to a half life. Units are in seconds. This formula can be tweaked as needed in order to make the
    // half life longer or shorter. However, zero affinity should always map to zero half life, and an affinity of one
    // should always map to an infinite half life.
    const halfLife = HALF_LIFE_FOR_HALF_AFFINITY * ( affinity / ( 1 - affinity ) );

    // Use standard half-life formula to decide on probability of detachment.
    return 1 - Math.exp( -0.693 * dt / halfLife );
  }

  /**
   * @param {AttachmentStateMachine} asm
   * @private
   */
  detachFromDnaMolecule( asm ) {
    const biomolecule = this.transcriptionFactorAttachmentStateMachine.biomolecule;
    asm.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
    asm.attachmentSite = null;
    asm.setState( this.transcriptionFactorAttachmentStateMachine.unattachedButUnavailableState );
    biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy( biomolecule.getDetachDirection(),
      biomolecule.motionBoundsProperty ) );
    this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold = 1; // Reset this threshold.
    asm.biomolecule.attachedToDnaProperty.set( false ); // Update externally visible state indication.
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @param {number} dt
   * @public
   */
  step( asm, dt ) {
    let attachmentSite = this.transcriptionFactorAttachmentStateMachine.attachmentSite;
    const detachFromDnaThreshold = this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold;
    const biomolecule = this.transcriptionFactorAttachmentStateMachine.biomolecule;
    const movingTowardsAttachmentState = this.transcriptionFactorAttachmentStateMachine.movingTowardsAttachmentState;

    // Decide whether or not to detach from the current attachment site.
    if ( dotRandom.nextDouble() > ( 1 - this.calculateProbabilityOfDetachment( attachmentSite.getAffinity(), dt ) ) ) {

      // The decision has been made to detach. Next, decide whether to detach completely from the DNA strand or just
      // jump to an adjacent base pair.
      if ( dotRandom.nextDouble() > detachFromDnaThreshold ) {

        // Detach completely from the DNA.
        this.detachFromDnaMolecule( asm );
      }
      else {

        // Move to an adjacent base pair. Start by making a list of candidate base pairs.
        let attachmentSites = biomolecule.getModel().getDnaMolecule().getAdjacentAttachmentSitesTranscriptionFactor( biomolecule, asm.attachmentSite );

        // Eliminate sites that, if moved to, would put the biomolecule out of bounds.
        _.remove( attachmentSites, site => !biomolecule.motionBoundsProperty.get().testIfInMotionBounds( biomolecule.bounds,
          site.positionProperty.get() ) );

        // Shuffle in order to produce random-ish behavior.
        attachmentSites = dotRandom.shuffle( attachmentSites );

        if ( attachmentSites.length === 0 ) {

          // No valid adjacent sites, so detach completely.
          this.detachFromDnaMolecule( asm );
        }
        else {

          // Clear the previous attachment site.
          attachmentSite.attachedOrAttachingMoleculeProperty.set( null );

          // Set a new attachment site.
          attachmentSite = attachmentSites[ 0 ];
          assert && assert( attachmentSite.attachedOrAttachingMoleculeProperty.get() === null );
          attachmentSite.attachedOrAttachingMoleculeProperty.set( biomolecule );

          // Set up the state to move to the new attachment site.
          this.transcriptionFactorAttachmentStateMachine.setState( movingTowardsAttachmentState );
          this.transcriptionFactorAttachmentStateMachine.attachmentSite = attachmentSite;
          biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy( attachmentSite.positionProperty,
            biomolecule.motionBoundsProperty, new Vector2( 0, 0 ), GEEConstants.VELOCITY_ON_DNA ) );

          // Update the detachment threshold. It gets lower over time to increase the probability of detachment.
          // Tweak as needed.
          this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold =
            detachFromDnaThreshold * Math.pow( 0.5, GEEConstants.DEFAULT_ATTACH_TIME );
        }
      }
    }
  }

  /**
   * @override
   * @param {AttachmentStateMachine} enclosingStateMachine
   * @public
   */
  entered( enclosingStateMachine ) {
    enclosingStateMachine.biomolecule.setMotionStrategy( new FollowAttachmentSite( enclosingStateMachine.attachmentSite ) );
    enclosingStateMachine.biomolecule.attachedToDnaProperty.set( true ); // Update externally visible state indication.
  }
}

geneExpressionEssentials.register( 'TranscriptionFactorAttachedState', TranscriptionFactorAttachedState );

export default TranscriptionFactorAttachedState;