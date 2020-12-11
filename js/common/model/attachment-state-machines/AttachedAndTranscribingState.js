// Copyright 2015-2020, University of Colorado Boulder

/**
 * One of the states for RnaPolymeraseAttachmentStateMachine. RnaPolymerase enters this state after conformation of
 * RnaPolymerase is complete
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../../../axon/js/Property.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GEEConstants from '../../GEEConstants.js';
import MessengerRna from '../MessengerRna.js';
import MoveDirectlyToDestinationMotionStrategy from '../motion-strategies/MoveDirectlyToDestinationMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

// constants
const MRNA_GROWTH_FACTOR = 0.63; // empirically determined adjustment factor to make mRNA appear to be about the right length

// used for comparing the position of Biomolecule and endOfGene's position.
const BIO_MOLECULE_POSITION_COMPARISON_EPSILON = 0.000001;

class AttachedAndTranscribingState extends AttachmentState {

  /**
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   */
  constructor( rnaPolymeraseAttachmentStateMachine ) {
    super();

    // @public (read-ony) {RnaPolymeraseAttachmentStateMachine}
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;

    // @private
    this.endOfGene = null;
    this.messengerRna = null;
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @param {number} dt - delta time
   * @public
   */
  step( asm, dt ) {
    const rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
    const dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
    const biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
    let attachedState = this.rnaPolymeraseAttachmentStateMachine.attachedState;
    const attachedAndDeconformingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndDeconformingState;

    // Verify that state is consistent
    assert && assert( asm.attachmentSite !== null );
    assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === biomolecule );

    // Grow the messenger RNA and position it to be attached to the polymerase.
    this.messengerRna.addLength( GEEConstants.TRANSCRIPTION_SPEED * MRNA_GROWTH_FACTOR * dt );
    this.messengerRna.setLowerRightPositionXY(
      rnaPolymerase.getPosition().x + rnaPolymerase.messengerRnaGenerationOffset.x,
      rnaPolymerase.getPosition().y + rnaPolymerase.messengerRnaGenerationOffset.y
    );

    // Move the DNA strand separator.
    dnaStrandSeparation.setXPosition( rnaPolymerase.getPosition().x );

    // Check for molecules that are in the way.
    const molecules = asm.biomolecule.getModel().getOverlappingBiomolecules( asm.biomolecule.bounds );
    molecules.forEach( molecule => {
      if ( molecule.getPosition().x > asm.biomolecule.getPosition().x && molecule.attachedToDnaProperty.get() ) {

        // This molecule is blocking transcription, so bump it off
        // of the DNA strand.
        molecule.forceDetach();
      }
    } );

    // If we've reached the end of the gene, detach.
    if ( biomolecule.getPosition().equalsEpsilon( this.endOfGene, BIO_MOLECULE_POSITION_COMPARISON_EPSILON ) ) {
      attachedState = attachedAndDeconformingState;
      this.rnaPolymeraseAttachmentStateMachine.setState( attachedState );
      this.messengerRna.releaseFromPolymerase();
      this.messengerRna.movableByUserProperty.set( true );
      this.messengerRna = null;
      this.endOfGene = null;
    }
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    const biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
    const transcribingAttachmentSite = this.rnaPolymeraseAttachmentStateMachine.transcribingAttachmentSite;
    const attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;

    // Prevent user interaction.
    asm.biomolecule.movableByUserProperty.set( false );

    // Determine the gene that is being transcribed.
    const geneToTranscribe = biomolecule.getModel().getDnaMolecule().getGeneAtPosition( biomolecule.getPosition() );
    assert && assert( geneToTranscribe !== null );

    // Set up the motion strategy to move to the end of the transcribed region of the gene.
    this.endOfGene = new Vector2( geneToTranscribe.getEndX(), GEEConstants.DNA_MOLECULE_Y_POS );

    asm.biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy(
      new Property( this.endOfGene.copy() ),
      biomolecule.motionBoundsProperty,
      new Vector2( 0, 0 ),
      GEEConstants.TRANSCRIPTION_SPEED
    ) );

    // Create the mRNA that will be grown as a result of this transcription.
    this.messengerRna = new MessengerRna(
      biomolecule.getModel(),
      geneToTranscribe.getProteinPrototype(),
      biomolecule.getPosition().plus( biomolecule.messengerRnaGenerationOffset ),
      { windingParamSet: geneToTranscribe.windingAlgorithmParameterSet }
    );
    biomolecule.spawnMessengerRna( this.messengerRna );
    this.messengerRna.movableByUserProperty.set( false );

    // Free up the initial attachment site by hooking up to a somewhat fictional attachment site instead.
    attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
    transcribingAttachmentSite.attachedOrAttachingMoleculeProperty.set( asm.biomolecule );
    this.rnaPolymeraseAttachmentStateMachine.attachmentSite = transcribingAttachmentSite;
  }
}

geneExpressionEssentials.register( 'AttachedAndTranscribingState', AttachedAndTranscribingState );

export default AttachedAndTranscribingState;
