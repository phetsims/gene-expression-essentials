// Copyright 2015-2022, University of Colorado Boulder

/**
 * Class that represents messenger ribonucleic acid, or mRNA, in the model. This class is fairly complex, due to the
 * need for mRNA to wind up and unwind as it is transcribed, translated, and destroyed.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GEEConstants from '../GEEConstants.js';
import MessengerRnaAttachmentStateMachine from './attachment-state-machines/MessengerRnaAttachmentStateMachine.js';
import AttachmentSite from './AttachmentSite.js';
import FlatSegment from './FlatSegment.js';
import MessengerRnaDestroyer from './MessengerRnaDestroyer.js';
import PlacementHint from './PlacementHint.js';
import Ribosome from './Ribosome.js';
import WindingBiomolecule from './WindingBiomolecule.js';

// constants
const RIBOSOME_CONNECTION_DISTANCE = 400; // picometers - distance within which this will connect to a ribosome
const MRNA_DESTROYER_CONNECT_DISTANCE = 400; // picometers - Distance within which this will connect to a mRNA destroyer
const INITIAL_MRNA_SHAPE = Shape.circle( 0, 0, 0.1 ); // tiny circle until the strand starts to grow
const MIN_LENGTH_TO_ATTACH = 75; // picometers - min length before attachments are allowed

class MessengerRna extends WindingBiomolecule {

  /**
   * Constructor.  This creates the mRNA as a single point, with the intention of growing it.
   *
   * @param {GeneExpressionModel} model
   * @param {Protein} proteinPrototype
   * @param {Vector2} position
   * @param {Object} [options]
   */
  constructor( model, proteinPrototype, position, options ) {

    super( model, INITIAL_MRNA_SHAPE, position, options );

    // @private {Object} - object that maps from ribosomes to the shape segment to which they are attached
    this.mapRibosomeToShapeSegment = {};

    // @public {BooleanProperty} - externally visible indicator for whether this mRNA is being synthesized, assumes that
    // it is being synthesized when initially created
    this.beingSynthesizedProperty = new BooleanProperty( true ); //@public

    // @private - protein prototype, used to keep track of protein that should be synthesized from this particular
    // strand of mRNA
    this.proteinPrototype = proteinPrototype;

    // @private - local reference to the non-generic state machine used by this molecule
    this.mRnaAttachmentStateMachine = this.attachmentStateMachine;

    // @private - mRNA destroyer that is destroying this mRNA. Null until and unless destruction has begun.
    this.messengerRnaDestroyer = null;

    // @private - Shape segment where the mRNA destroyer is connected. This is null until destruction has begun.
    this.segmentBeingDestroyed = null;

    // @private {AttachmentSite} - site where ribosomes or mRNA destroyers can attach
    this.attachmentSite = new AttachmentSite( this, new Vector2( 0, 0 ), 1 );

    // set the initial position
    this.setPosition( position );

    // Add the first segment to the shape segment list. This segment will contain the "leader" for the mRNA.
    const segment = new FlatSegment( this, Vector2.ZERO );
    segment.setCapacity( GEEConstants.LEADER_LENGTH );
    this.shapeSegments.push( segment );

    // Add the placement hints for the positions where the user can attach a ribosome or an mRNA destroyer.
    const ribosome = new Ribosome( model );
    this.ribosomePlacementHint = new PlacementHint( ribosome ); //@public(read-only)
    this.mRnaDestroyerPlacementHint = new PlacementHint( new MessengerRnaDestroyer( model ) ); //@public(read-only)

    const updateHintPositions = shape => {

      // All hints always sit at the beginning of the RNA strand and are positioned relative to its center.
      const strandStartPosition = new Vector2( shape.bounds.minX, shape.bounds.maxY );
      this.ribosomePlacementHint.setPosition( strandStartPosition.minus( ribosome.offsetToTranslationChannelEntrance ) );
      this.mRnaDestroyerPlacementHint.setPosition( strandStartPosition );
    };

    this.shapeProperty.link( updateHintPositions );

    // update the attachment site position when the mRNA moves or changes shape
    const attachmentSitePositionUpdater = this.updateAttachmentSitePosition.bind( this );
    this.positionProperty.link( attachmentSitePositionUpdater );
    this.shapeProperty.link( attachmentSitePositionUpdater );

    this.disposeMessengerRna = function() {
      this.shapeProperty.unlink( updateHintPositions );
      this.shapeProperty.unlink( attachmentSitePositionUpdater );
      this.positionProperty.unlink( attachmentSitePositionUpdater );
    };
  }

  /**
   * @public
   */
  dispose() {
    this.mapRibosomeToShapeSegment = null;
    this.disposeMessengerRna();
    super.dispose();
  }

  /**
   * Command this mRNA strand to fade away when it has become fully formed. This was created for use in the 2nd
   * screen, where mRNA is never translated once it is produced.
   * @param {boolean} fadeAwayWhenFormed
   * @public
   */
  setFadeAwayWhenFormed( fadeAwayWhenFormed ) {

    // Just pass this through to the state machine.
    this.mRnaAttachmentStateMachine.setFadeAwayWhenFormed( fadeAwayWhenFormed );
  }

  /**
   * Advance the translation of the mRNA through the given ribosome by the specified length. The given ribosome must
   * already be attached to the mRNA.
   * @param {Ribosome} ribosome - The ribosome by which the mRNA is being translated.
   * @param {number} length   - The amount of mRNA to move through the translation channel.
   * @returns - true if the mRNA is completely through the channel, indicating, that transcription is complete, and false
   * if not.
   * @public
   */
  advanceTranslation( ribosome, length ) {

    const segmentToAdvance = this.mapRibosomeToShapeSegment[ ribosome.id ];

    // Error checking.
    assert && assert( segmentToAdvance !== null ); // Should never happen, since it means that the ribosome isn't attached.

    // Advance the translation by advancing the position of the mRNA in the segment that corresponds to the translation
    // channel of the ribosome.
    segmentToAdvance.advance( length, this, this.shapeSegments );

    // Realign the segments, since they may well have changed shape.
    if ( this.shapeSegments.indexOf( segmentToAdvance ) !== -1 ) {
      this.realignSegmentsFrom( segmentToAdvance );
      this.recenter();
    }

    // Since the sizes and relationships of the segments probably changed, the winding algorithm needs to be rerun.
    this.windPointsThroughSegments();

    // If there is anything left in this segment, then transcription is not yet complete.
    return segmentToAdvance.getContainedLength() <= 0;
  }

  /**
   * Advance the destruction of the mRNA by the specified length. This pulls the strand into the lead segment much like
   * translation does, but does not move the points into new segment, it just gets rid of them.
   * @param {number} length
   * @returns {boolean}
   * @public
   */
  advanceDestruction( length ) {

    // Error checking.
    assert && assert(
      this.segmentBeingDestroyed !== null,
      'error - attempt to advance the destruction of mRNA that has no content left'
    );

    // Advance the destruction by reducing the length of the mRNA.
    this.reduceLength( length );

    // Realign the segments, since they may well have changed shape.
    if ( this.shapeSegments.indexOf( this.segmentBeingDestroyed ) !== -1 ) {
      this.realignSegmentsFrom( this.segmentBeingDestroyed );
    }

    if ( this.shapeSegments.length > 0 ) {

      // Since the sizes and relationships of the segments probably changed, the winding algorithm needs to be rerun.
      this.windPointsThroughSegments();
    }

    // If there is any length left, then the destruction is not yet complete. This is a quick way to test this.
    return this.firstShapeDefiningPoint === this.lastShapeDefiningPoint;
  }

  /**
   * Reduce the length of the mRNA. This handles both the shape segments and the shape-defining points.
   * @param {number} reductionAmount
   * @private
   */
  reduceLength( reductionAmount ) {
    if ( reductionAmount >= this.getLength() ) {

      // Reduce length to be zero.
      this.lastShapeDefiningPoint = this.firstShapeDefiningPoint;
      this.lastShapeDefiningPoint.setNextPoint( null );
      this.shapeSegments.length = 0;
    }
    else {

      // Remove the length from the shape segments.
      this.segmentBeingDestroyed.advanceAndRemove( reductionAmount, this, this.shapeSegments );

      // Remove the length from the shape defining points.
      for ( let amountRemoved = 0; amountRemoved < reductionAmount; ) {
        if ( this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint() <= reductionAmount - amountRemoved ) {

          // Remove the last point from the list.
          amountRemoved += this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint();
          this.lastShapeDefiningPoint = this.lastShapeDefiningPoint.getPreviousPoint();
          this.lastShapeDefiningPoint.setNextPoint( null );
        }
        else {

          // Reduce the distance of the last point from the previous point.
          this.lastShapeDefiningPoint.setTargetDistanceToPreviousPoint( this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint() - ( reductionAmount - amountRemoved ) );
          amountRemoved = reductionAmount;
        }
      }
    }
  }

  /**
   * @private
   */
  updateAttachmentSitePosition() {
    if ( this.shapeSegments.length > 0 ) {
      const leadingShapeSegment = this.shapeSegments[ 0 ];
      this.attachmentSite.positionProperty.set( new Vector2(
        this.positionProperty.get().x + leadingShapeSegment.bounds.minX,
        this.positionProperty.get().y + leadingShapeSegment.bounds.minY
      ) );
    }
    else {
      this.attachmentSite.positionProperty.set( this.positionProperty.get() );
    }
  }

  /**
   * Create a new version of the protein that should result when this strand of mRNA is translated.
   * @returns {Protein}
   * @public
   */
  getProteinPrototype() {
    return this.proteinPrototype;
  }

  /**
   * Get the point in model space where the entrance of the given ribosome's translation channel should be in order to
   * be correctly attached to this strand of messenger RNA. This allows the ribosome to "follow" the mRNA if it is
   * moving or changing shape.
   * @param {Ribosome} ribosome
   * @returns {Vector2}
   * @public
   */
  getRibosomeGenerateInitialPosition3D( ribosome ) {
    assert && assert(
      this.mapRibosomeToShapeSegment[ ribosome.id ],
      'attempt made to get attachment position for unattached ribosome'
    );
    let generateInitialPosition3D;
    const mRnaPosition = this.positionProperty.get();
    const segment = this.mapRibosomeToShapeSegment[ ribosome.id ];
    let segmentCornerPosition;
    if ( this.getPreviousShapeSegment( segment ) === null ) {

      // There is no previous segment, which means that the segment to which this ribosome is attached is the leader
      // segment. The attachment point is thus the leader length from its rightmost edge.
      segmentCornerPosition = segment.getLowerRightCornerPosition();
      generateInitialPosition3D = mRnaPosition.plusXY(
        segmentCornerPosition.x - GEEConstants.LEADER_LENGTH,
        segmentCornerPosition.y
      );
    }
    else {

      // The segment has filled up the channel, so calculate the position based on its left edge.
      segmentCornerPosition = segment.getUpperLeftCornerPosition();
      generateInitialPosition3D = mRnaPosition.plusXY(
        segmentCornerPosition.x + ribosome.getTranslationChannelLength(),
        segmentCornerPosition.y
      );
    }
    return generateInitialPosition3D;
  }

  /**
   * Release this mRNA from a ribosome. If this is the only ribosome to which the mRNA is connected, the mRNA will
   * start wandering.
   * @param {Ribosome} ribosome
   * @public
   */
  releaseFromRibosome( ribosome ) {
    delete this.mapRibosomeToShapeSegment[ ribosome.id ];
    if ( _.keys( this.mapRibosomeToShapeSegment ).length === 0 ) {
      this.mRnaAttachmentStateMachine.allRibosomesDetached();
    }
  }

  /**
   * Release this mRNA from the polymerase which is, presumably, transcribing it.
   * @public
   */
  releaseFromPolymerase() {
    this.mRnaAttachmentStateMachine.detach();
  }

  /**
   * This override checks to see if the mRNA is about to be translated and destroyed and, if so, aborts those
   * operations.  If translation or destruction are in progress, nothing is done, since those can't be stopped once
   * they've started.
   * @override
   * @public
   */
  handleGrabbedByUser() {

    const attachedOrAttachingMolecule = this.attachmentSite.attachedOrAttachingMoleculeProperty.get();

    if ( attachedOrAttachingMolecule instanceof Ribosome ) {

      // if a ribosome is moving towards this mRNA strand but translation hasn't started, call off the wedding
      if ( !attachedOrAttachingMolecule.isTranslating() ) {
        attachedOrAttachingMolecule.cancelTranslation();
        this.releaseFromRibosome( attachedOrAttachingMolecule );
        this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
      }
    }
    else if ( attachedOrAttachingMolecule instanceof MessengerRnaDestroyer ) {

      // state checking
      assert && assert(
        this.messengerRnaDestroyer === attachedOrAttachingMolecule,
        'something isn\t right - the destroyer for the attachment site doesn\'t match the expected reference'
      );

      // if an mRNA destroyer is moving towards this mRNA strand but translation hasn't started, call off the wedding
      if ( !this.isDestructionInProgress() ) {
        attachedOrAttachingMolecule.cancelMessengerRnaDestruction();
        this.messengerRnaDestroyer = null;
        this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
      }
    }
  }

  /**
   * Activate the placement hint(s) as appropriate for the given biomolecule.
   * @param {MobileBiomolecule} biomolecule - instance of the type of biomolecule for which any matching hints
   * should be activated.
   * @public
   */
  activateHints( biomolecule ) {
    this.ribosomePlacementHint.activateIfMatch( biomolecule );
    this.mRnaDestroyerPlacementHint.activateIfMatch( biomolecule );
  }

  /**
   * Deactivate placement hints for all biomolecules
   * @public
   */
  deactivateAllHints() {
    this.ribosomePlacementHint.activeProperty.set( false );
    this.mRnaDestroyerPlacementHint.activeProperty.set( false );
  }

  /**
   * Initiate the translation process by setting up the segments as needed. This should only be called after a ribosome
   * that was moving to attach with this mRNA arrives at the attachment point.
   * @param {Ribosome} ribosome
   * @public
   */
  initiateTranslation( ribosome ) {
    assert && assert( this.mapRibosomeToShapeSegment[ ribosome.id ] ); // State checking.

    // Set the capacity of the first segment to the size of the channel through which it will be pulled plus the
    // leader length.
    const firstShapeSegment = this.shapeSegments[ 0 ];
    assert && assert( firstShapeSegment.isFlat() );
    firstShapeSegment.setCapacity( ribosome.getTranslationChannelLength() + GEEConstants.LEADER_LENGTH );
  }

  /**
   * Initiate the destruction of this mRNA strand by setting up the segments as needed. This should only be called
   * after an mRNA destroyer has attached to the front of the mRNA strand. Once initiated, destruction cannot be stopped.
   * @param {MessengerRnaDestroyer} messengerRnaDestroyer
   * @public
   */
  initiateDestruction( messengerRnaDestroyer ) {
    assert && assert( this.messengerRnaDestroyer === messengerRnaDestroyer ); // Shouldn't get this from unattached destroyers.

    // Set the capacity of the first segment to the size of the channel through which it will be pulled plus the leader length.
    this.segmentBeingDestroyed = this.shapeSegments[ 0 ];

    assert && assert( this.segmentBeingDestroyed.isFlat() );
    this.segmentBeingDestroyed.setCapacity(
      this.messengerRnaDestroyer.getDestructionChannelLength() + GEEConstants.LEADER_LENGTH
    );
  }

  /**
   * returns true if destruction has started, false if not - note that destruction must actually have started, and
   * the state where an mRNA destroyer is moving towards the mRNA doesn't count
   * @private
   */
  isDestructionInProgress() {
    return this.segmentBeingDestroyed !== null;
  }

  /**
   * Get the proportion of the entire mRNA that has been translated by the given ribosome.
   * @param {Ribosome} ribosome
   * @returns {number}
   * @public
   */
  getProportionOfRnaTranslated( ribosome ) {
    const translatedLength = this.getLengthOfRnaTranslated( ribosome );
    return Math.max( translatedLength / this.getLength(), 0 );
  }

  /**
   * Get the length of the mRNA that has been translated by the given ribosome.
   * @param {Ribosome} ribosome
   * @returns {number}
   * @public
   */
  getLengthOfRnaTranslated( ribosome ) {
    assert && assert( this.mapRibosomeToShapeSegment[ ribosome.id ] ); // Makes no sense if ribosome isn't attached.
    let translatedLength = 0;
    const segmentInRibosomeChannel = this.mapRibosomeToShapeSegment[ ribosome.id ];

    assert && assert( segmentInRibosomeChannel.isFlat() ); // Make sure things are as we expect.

    // Add the length for each segment that precedes this ribosome.
    for ( let i = 0; i < this.shapeSegments.length; i++ ) {
      const shapeSegment = this.shapeSegments[ i ];
      if ( shapeSegment === segmentInRibosomeChannel ) {
        break;
      }
      translatedLength += shapeSegment.getContainedLength();
    }

    // Add the length for the segment that is inside the translation channel of this ribosome.
    translatedLength += segmentInRibosomeChannel.getContainedLength() -
                        ( segmentInRibosomeChannel.getLowerRightCornerPosition().x -
                        segmentInRibosomeChannel.attachmentSite.positionProperty.get().x );

    return translatedLength;
  }

  /**
   * returns true if this messenger RNA is in a state where attachments can occur
   * @returns {boolean}
   * @private
   */
  attachmentAllowed() {

    // For an attachment proposal to be considered, the mRNA can't be controlled by the user, too short, or in the
    // process of being destroyed.
    return !this.userControlledProperty.get() &&
           this.getLength() >= MIN_LENGTH_TO_ATTACH &&
           this.messengerRnaDestroyer === null;
  }

  /**
   * Consider proposal from ribosome, and, if the proposal is accepted, return the attachment position
   * @param {Ribosome} ribosome
   * @returns {AttachmentSite}
   * @public
   */
  considerProposalFromRibosome( ribosome ) {
    assert && assert( !this.mapRibosomeToShapeSegment[ ribosome.id ] ); // Shouldn't get redundant proposals from a ribosome.
    let returnValue = null;

    if ( this.attachmentAllowed() ) {

      // See if the attachment site at the leading edge of the mRNA is available and close by.
      if ( this.attachmentSite.attachedOrAttachingMoleculeProperty.get() === null &&
           this.attachmentSite.positionProperty.get().distance( ribosome.getEntranceOfRnaChannelPosition() ) < RIBOSOME_CONNECTION_DISTANCE ) {

        // This attachment site is in range and available.
        returnValue = this.attachmentSite;

        // Update the attachment state machine.
        this.mRnaAttachmentStateMachine.attachedToRibosome();

        // Enter this connection in the map.
        this.mapRibosomeToShapeSegment[ ribosome.id ] = this.shapeSegments[ 0 ];
      }
    }
    return returnValue;
  }

  /**
   * Consider proposal from mRnaDestroyer and if it can attach return the attachment position
   * @param {MessengerRnaDestroyer} messengerRnaDestroyer
   * @returns {AttachmentSite}
   * @public
   */
  considerProposalFromMessengerRnaDestroyer( messengerRnaDestroyer ) {
    assert && assert( this.messengerRnaDestroyer !== messengerRnaDestroyer ); // Shouldn't get redundant proposals from same destroyer.

    let returnValue = null;

    if ( this.attachmentAllowed() ) {

      // See if the attachment site at the leading edge of the mRNA is available and close by.
      if ( this.attachmentSite.attachedOrAttachingMoleculeProperty.get() === null &&
           this.attachmentSite.positionProperty.get().distance( messengerRnaDestroyer.getPosition() ) <
           MRNA_DESTROYER_CONNECT_DISTANCE ) {

        // This attachment site is in range and available.
        returnValue = this.attachmentSite;

        // Update the attachment state machine.
        this.mRnaAttachmentStateMachine.attachToDestroyer();

        // Keep track of the destroyer.
        this.messengerRnaDestroyer = messengerRnaDestroyer;
      }
    }

    return returnValue;
  }

  /**
   * Aborts the destruction process, used if the mRNA destroyer was on its way to the mRNA but the user picked up
   * once of the two biomolecules before destruction started.
   * @public
   */
  abortDestruction() {
    this.messengerRnaDestroyer = null;
    this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
  }

  /**
   * @override
   * @returns {MessengerRnaAttachmentStateMachine}
   * @public
   */
  createAttachmentStateMachine() {
    return new MessengerRnaAttachmentStateMachine( this );
  }

  /**
   * Get the point in model space where the entrance of the given destroyer's translation channel should be in order to
   * be correctly attached to this strand of messenger RNA.
   * @returns {Vector2}
   * @public
   */
  getDestroyerGenerateInitialPosition3D() {

    // state checking - shouldn't be called before this is set
    assert && assert( this.segmentBeingDestroyed !== null );

    // the attachment position is at the right most side of the segment minus the leader length
    return this.attachmentSite.positionProperty.get();
  }
}

geneExpressionEssentials.register( 'MessengerRna', MessengerRna );

export default MessengerRna;
