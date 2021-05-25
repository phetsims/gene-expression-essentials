// Copyright 2015-2021, University of Colorado Boulder

/**
 * One of the states for RnaPolymeraseAttachmentStateMachine. RnaPolymerase enters this state when it is attached to the
 * DNA but is not transcribing. In this state, it is doing a 1D random walk on the DNA strand.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import dotRandom from '../../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GEEConstants from '../../GEEConstants.js';
import MoveDirectlyToDestinationMotionStrategy from '../motion-strategies/MoveDirectlyToDestinationMotionStrategy.js';
import WanderInGeneralDirectionMotionStrategy from '../motion-strategies/WanderInGeneralDirectionMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

// constant
const REEVALUATE_TRANSCRIPTION_DECISION_TIME = 1; // seconds

class AttachedToDnaNotTranscribingState extends AttachmentState {

  /**
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   */
  constructor( rnaPolymeraseAttachmentStateMachine ) {
    super();

    // @public (read-ony) {RnaPolymeraseAttachmentStateMachine}
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;

    // @private - flag that is set upon entry that determines whether transcription occurs
    this.transcribe = false;

    // @private
    this.timeSinceTranscriptionDecision = 0;
  }

  /**
   * Helper function which detaches RnaPolymerase from the DNA
   * @param  {AttachmentStateMachine} asm
   * @private
   */
  detachFromDnaMolecule( asm ) {
    asm.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
    asm.attachmentSite = null;
    asm.setState( this.rnaPolymeraseAttachmentStateMachine.unattachedButUnavailableState );
    this.rnaPolymeraseAttachmentStateMachine.biomolecule.setMotionStrategy(
      new WanderInGeneralDirectionMotionStrategy( this.rnaPolymeraseAttachmentStateMachine.biomolecule.getDetachDirection(),
        this.rnaPolymeraseAttachmentStateMachine.biomolecule.motionBoundsProperty ) );
    this.rnaPolymeraseAttachmentStateMachine.detachFromDnaThreshold.reset(); // Reset this threshold.
    asm.biomolecule.attachedToDnaProperty.set( false ); // Update externally visible state indication.
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @param {number} dt
   * @public
   */
  step( asm, dt ) {

    // Verify that state is consistent
    assert && assert( asm.attachmentSite !== null );
    assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === asm.biomolecule );

    // set up some convenient variables
    let attachedState = this.rnaPolymeraseAttachmentStateMachine.attachedState;
    const attachedAndConformingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndConformingState;
    const biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
    const detachFromDnaThreshold = this.rnaPolymeraseAttachmentStateMachine.detachFromDnaThreshold;
    let attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;

    // Decide whether to transcribe the DNA. The decision is based on the affinity of the site and the time of
    // attachment.
    if ( this.transcribe ) {

      // Begin transcription.
      attachedState = attachedAndConformingState;
      this.rnaPolymeraseAttachmentStateMachine.setState( attachedState );
      detachFromDnaThreshold.reset(); // Reset this threshold.
    }
    else if ( dotRandom.nextDouble() >
              ( 1 - this.rnaPolymeraseAttachmentStateMachine.calculateProbabilityOfDetachment( attachmentSite.getAffinity(), dt ) ) ) {

      // The decision has been made to detach. Next, decide whether to detach completely from the DNA strand or just
      // jump to an adjacent base pair.
      if ( dotRandom.nextDouble() > detachFromDnaThreshold.get() ) {

        // Detach completely from the DNA.
        this.detachFromDnaMolecule( asm );
      }
      else {

        // Move to an adjacent base pair. Start by making a list of candidate base pairs.
        let attachmentSites = biomolecule.getModel().getDnaMolecule().getAdjacentAttachmentSitesRnaPolymerase(
          biomolecule,
          asm.attachmentSite
        );

        // Eliminate sites that are in use or that, if moved to, would put the biomolecule out of bounds.
        _.remove( attachmentSites, site => site.isMoleculeAttached() || !biomolecule.motionBoundsProperty.get().testIfInMotionBounds(
          biomolecule.bounds, site.positionProperty.get() ) );

        // Shuffle in order to produce random-ish behavior.
        attachmentSites = dotRandom.shuffle( attachmentSites );

        if ( attachmentSites.length === 0 ) {

          // No valid adjacent sites, so detach completely.
          this.detachFromDnaMolecule( asm );
        }
        else {

          // Move to an adjacent base pair. Firs, clear the previous attachment site.
          attachmentSite.attachedOrAttachingMoleculeProperty.set( null );

          // Set a new attachment site.
          attachmentSite = attachmentSites[ 0 ];

          // State checking - Make sure site is really available
          assert && assert( attachmentSite.attachedOrAttachingMoleculeProperty.get() === null );
          attachmentSite.attachedOrAttachingMoleculeProperty.set( biomolecule );

          // Set up the state to move to the new attachment site.
          this.rnaPolymeraseAttachmentStateMachine.setState(
            this.rnaPolymeraseAttachmentStateMachine.movingTowardsAttachmentState
          );
          biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy(
            attachmentSite.positionProperty,
            biomolecule.motionBoundsProperty,
            new Vector2( 0, 0 ),
            GEEConstants.VELOCITY_ON_DNA
          ) );
          this.rnaPolymeraseAttachmentStateMachine.attachmentSite = attachmentSite;

          // Update the detachment threshold. It gets lower over time to increase the probability of detachment.
          // Tweak as needed.
          detachFromDnaThreshold.set( detachFromDnaThreshold.get() * Math.pow( 0.5, GEEConstants.DEFAULT_ATTACH_TIME ) );
        }
      }
    }
    else {

      // Reevaluate the decision on whether to transcribe.  This is necessary to avoid getting stuck in the attached
      // state, which can happen if the affinity is changed after the state was initially entered, see
      // https://github.com/phetsims/gene-expression-essentials/issues/100.
      this.timeSinceTranscriptionDecision += dt;

      if ( this.timeSinceTranscriptionDecision >= REEVALUATE_TRANSCRIPTION_DECISION_TIME ) {
        this.transcribe = attachmentSite.getAffinity() > GEEConstants.DEFAULT_AFFINITY &&
                          dotRandom.nextDouble() < attachmentSite.getAffinity();
        this.timeSinceTranscriptionDecision = 0;
      }
    }
  }

  /**
   * @override
   * @param  { AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    const attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;
    const randValue = dotRandom.nextDouble();

    // Decide right away whether or not to transcribe.
    this.transcribe = attachmentSite.getAffinity() > GEEConstants.DEFAULT_AFFINITY &&
                      randValue < attachmentSite.getAffinity();

    // Allow user interaction.
    asm.biomolecule.movableByUserProperty.set( true );

    // Indicate attachment to DNA.
    asm.biomolecule.attachedToDnaProperty.set( true );
  }
}

geneExpressionEssentials.register( 'AttachedToDnaNotTranscribingState', AttachedToDnaNotTranscribingState );

export default AttachedToDnaNotTranscribingState;