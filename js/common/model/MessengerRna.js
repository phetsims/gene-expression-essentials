// Copyright 2015, University of Colorado Boulder
/**
 * Class that represents messenger ribonucleic acid, or mRNA, in the model. This class is fairly complex, due to the
 * need for mRNA to wind up and unwind as it is transcribed, translated, and destroyed.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Map = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/Map' );
  var FlatSegment = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/FlatSegment' );
  var MessengerRnaAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/MessengerRnaAttachmentStateMachine' );
  var WindingBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/WindingBiomolecule' );
  var PlacementHint = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/PlacementHint' );
  var Property = require( 'AXON/Property' );
  var Ribosome = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Ribosome' );
  var MessengerRnaDestroyer = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MessengerRnaDestroyer' );

  // constants
  // Distance within which this will connect to a ribosome.
  var RIBOSOME_CONNECTION_DISTANCE = 400; // picometers
  var MRNA_DESTROYER_CONNECT_DISTANCE = 400; // picometers

  /**
   * Constructor.  This creates the mRNA as a single point, with the intention of growing it.
   *
   * @param {GeneExpressionModel} model
   * @param {Protein} proteinPrototype
   * @param {Vector2} position
   * @constructor
   */
  function MessengerRna( model, proteinPrototype, position ) {
    var self = this;

    // Map from ribosomes to the shape segment to which they are attached.
    self.mapRibosomeToShapeSegment = new Map();

    WindingBiomolecule.call( self, model, new Shape().moveToPoint( position ), position );

    // Externally visible indicator for whether this mRNA is being synthesized. Assumes that it is being synthesized
    // when created.
    this.beingSynthesizedProperty = new Property( true );

    // Protein prototype, used to keep track of protein that should be synthesized from this particular strand of mRNA.
    self.proteinPrototype = proteinPrototype;

    // Local reference to the non-generic state machine used by this molecule.
    self.mRnaAttachmentStateMachine = self.attachmentStateMachine; // private

    // mRNA destroyer that is destroying this mRNA. Null until and unless destruction has begun.
    self.messengerRnaDestroyer = null;

    // Shape segment where the mRNA destroyer is connected. This is null until and unless destruction has begun.
    self.segmentWhereDestroyerConnects = null;

    // Add the first segment to the shape segment list. This segment will contain the "leader" for the mRNA.
    var segment = new FlatSegment( position );
    segment.setCapacity( GEEConstants.LEADER_LENGTH );
    this.shapeSegments.add( segment );

    // Add the placement hints for the locations where the user can attach a ribosome or an mRNA destroyer.
    var ribosome = new Ribosome( model );
    self.ribosomePlacementHint = new PlacementHint( new Ribosome( model ) );
    self.mRnaDestroyerPlacementHint = new PlacementHint( new MessengerRnaDestroyer( model ) );

    this.shapeProperty.link( function() {
      // This hint always sits at the beginning of the RNA strand.
      var currentMRnaFirstPointPosition = self.firstShapeDefiningPoint.getPosition();
      self.ribosomePlacementHint.setPosition( currentMRnaFirstPointPosition.minus( ribosome.offsetToTranslationChannelEntrance ) );
      self.mRnaDestroyerPlacementHint.setPosition( currentMRnaFirstPointPosition );
    } );
  }

  geneExpressionEssentials.register( 'MessengerRna', MessengerRna );

  return inherit( WindingBiomolecule, MessengerRna, {
    /**
     * @Override
     * @param translationVector
     */
    translate: function( x, y ) {

      // Translate the current shape user the superclass facility.
      WindingBiomolecule.prototype.translate.call( this, x, y );

      var translationVector = new Vector2( x, y );
      // Translate each of the shape segments that define the outline shape.
      this.shapeSegments.forEach( function( shapeSegment ) {
        shapeSegment.translate( translationVector );
      } );

      // Translate each of the points that define the curly mRNA shape.
      var thisPoint = this.firstShapeDefiningPoint;
      while ( thisPoint !== null ) {
        thisPoint.translate( translationVector );
        thisPoint = thisPoint.getNextPointMass();
      }
    },

    /**
     * Command this mRNA strand to fade away when it has become fully formed. This was created for use in the 2nd tab,
     * where mRNA is never translated once it is produced.
     *
     * @param {boolean} fadeAwayWhenFormed
     */
    setFadeAwayWhenFormed: function( fadeAwayWhenFormed ) {
      // Just pass this through to the state machine.
      this.mRnaAttachmentStateMachine.setFadeAwayWhenFormed( fadeAwayWhenFormed );
    },

    /**
     * Advance the translation of the mRNA through the given ribosome by the specified length. The given ribosome must
     * already be attached to the mRNA.
     *
     * @param {Ribosome} ribosome - The ribosome by which the mRNA is being translated.
     * @param {number} length   - The amount of mRNA to move through the translation channel.
     * @return - true if the mRNA is completely through the channel, indicating, that transcription is complete, and false
     * if not.
     */
    advanceTranslation: function( ribosome, length ) {

      var segmentToAdvance = this.mapRibosomeToShapeSegment.get( ribosome );

      // Error checking.
      assert && assert( segmentToAdvance !== null ); // Should never happen, since it means that the ribosome isn't attached.

      // Advance the translation by advancing the position of the mRNA in the segment that corresponds to the translation
      // channel of the ribosome.
      segmentToAdvance.advance( length, this.shapeSegments );

      // Realign the segments, since they may well have changed shape.
      if ( this.shapeSegments.contains( segmentToAdvance ) ) {
        this.realignSegmentsFrom( segmentToAdvance );
      }

      // Since the sizes and relationships of the segments probably changed, the winding algorithm needs to be rerun.
      this.windPointsThroughSegments();

      // If there is anything left in this segment, then transcription is not yet complete.
      return segmentToAdvance.getContainedLength() <= 0;
    },

    /**
     * Advance the destruction of the mRNA by the specified length. This pulls the strand into the lead segment much like
     * translation does, but does not move the points into new segment, it just gets rid of them.
     *
     * @param {number} length
     * @return {boolean}
     */
    advanceDestruction: function( length ) {

      // Error checking.
      if ( this.segmentWhereDestroyerConnects === null ) {
        console.log( ' - Warning: Attempt to advance the destruction of mRNA that has no content left.' );
        return true;
      }

      // Advance the destruction by reducing the length of the mRNA.
      this.reduceLength( length );

      // Realign the segments, since they may well have changed shape.
      if ( this.shapeSegments.contains( this.segmentWhereDestroyerConnects ) ) {
        this.realignSegmentsFrom( this.segmentWhereDestroyerConnects );
      }

      if ( this.shapeSegments.length > 0 ) {

        // Since the sizes and relationships of the segments probably changed, the winding algorithm needs to be rerun.
        this.windPointsThroughSegments();
      }

      // If there is any length left, then the destruction is not yet complete. This is a quick way to test this.
      return this.firstShapeDefiningPoint === this.lastShapeDefiningPoint;
    },

    /**
     * Reduce the length of the mRNA. This handles both the shape segments and the shape-defining points.
     * @private
     * @param {number} reductionAmount
     */
    reduceLength: function( reductionAmount ) {
      if ( reductionAmount >= this.getLength() ) {

        // Reduce length to be zero.
        this.lastShapeDefiningPoint = this.firstShapeDefiningPoint;
        this.lastShapeDefiningPoint.setNextPointMass( null );
        this.shapeSegments.clear();
      }
      else {

        // Remove the length from the shape segments.
        this.segmentWhereDestroyerConnects.advanceAndRemove( reductionAmount, this.shapeSegments );

        // Remove the length from the shape defining points.
        for ( var amountRemoved = 0; amountRemoved < reductionAmount; ) {
          if ( this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint() <= reductionAmount - amountRemoved ) {

            // Remove the last point from the list.
            amountRemoved += this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint();
            this.lastShapeDefiningPoint = this.lastShapeDefiningPoint.getPreviousPointMass();
            this.lastShapeDefiningPoint.setNextPointMass( null );
          }
          else {

            // Reduce the distance of the last point from the previous point.
            this.lastShapeDefiningPoint.setTargetDistanceToPreviousPoint( this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint() - ( reductionAmount - amountRemoved ) );
            amountRemoved = reductionAmount;
          }
        }
      }
    },

    /**
     * Create a new version of the protein that should result when this strand of mRNA is translated.
     *
     * @return {Protein}
     */
    getProteinPrototype: function() {
      return this.proteinPrototype;
    },

    /**
     * Get the point in model space where the entrance of the given ribosome's translation channel should be in order to
     * be correctly attached to this strand of messenger RNA. This allows the ribosome to "follow" the mRNA if it is
     * moving or changing shape.
     *
     * @param {Ribosome} ribosome
     * @return {Vector2}
     */
    getRibosomeAttachmentLocation: function( ribosome ) {
      if ( !this.mapRibosomeToShapeSegment.contains( ribosome ) ) {
        console.log( ' Warning: Ignoring attempt to obtain attachment point for non-attached ribosome.' );
        return null;
      }
      var attachmentPoint;
      var segment = this.mapRibosomeToShapeSegment.get( ribosome );
      if ( this.shapeSegments.getPreviousItem( segment ) === null ) {

        // There is no previous segment, which means that the segment to which this ribosome is attached is the leader
        // segment. The attachment point is thus the leader length from its rightmost edge.
        attachmentPoint = new Vector2( segment.getLowerRightCornerPos().x - GEEConstants.LEADER_LENGTH,
          segment.getLowerRightCornerPos().y );
      }
      else {
        // The segment has filled up the channel, so calculate the position based on its left edge.
        attachmentPoint = new Vector2( segment.getUpperLeftCornerPos().x + ribosome.getTranslationChannelLength(),
          segment.getUpperLeftCornerPos().y );
      }
      return attachmentPoint;
    },

    /**
     * Release this mRNA from a ribosome. If this is the only ribosome to which the mRNA is connected, the mRNA will
     * start wandering.
     *
     * @param {Ribosome} ribosome
     */
    releaseFromRibosome: function( ribosome ) {
      this.mapRibosomeToShapeSegment.remove( ribosome );
      if ( this.mapRibosomeToShapeSegment.isEmpty() ) {
        this.mRnaAttachmentStateMachine.allRibosomesDetached();
      }
    },

    /**
     * Release this mRNA from the polymerase which is, presumably, transcribing
     * it.
     */
    releaseFromPolymerase: function() {
      this.mRnaAttachmentStateMachine.detach();
    },

    /**
     * Activate the placement hint(s) as appropriate for the given biomolecule.
     *
     * @param {MobileBiomolecule} biomolecule - And instance of the type of biomolecule for which any matching hints
     * should be activated.
     */
    activateHints: function( biomolecule ) {
      this.ribosomePlacementHint.activateIfMatch( biomolecule );
      this.mRnaDestroyerPlacementHint.activateIfMatch( biomolecule );
    },

    deactivateAllHints: function() {
      this.ribosomePlacementHint.activeProperty.set( false );
      this.mRnaDestroyerPlacementHint.activeProperty.set( false );
    },

    /**
     * Initiate the translation process by setting up the segments as needed. This should only be called after a ribosome
     * that was moving to attach with this mRNA arrives at the attachment point.
     *
     * @param {Ribosome} ribosome
     */
    initiateTranslation: function( ribosome ) {
      assert && assert( this.mapRibosomeToShapeSegment.contains( ribosome ) ); // State checking.

      // Set the capacity of the first segment to the size of the channel through which it will be pulled plus the leader
      // length.
      var firstShapeSegment = this.shapeSegments.get( 0 );
      assert && assert( firstShapeSegment.isFlat() );
      firstShapeSegment.setCapacity( ribosome.getTranslationChannelLength() + GEEConstants.LEADER_LENGTH );
    },

    /**
     * Initiate the destruction of this mRNA strand by setting up the segments as needed. This should only be called
     * after an mRNA destroyer has attached to the front of the mRNA strand. Once initiated, destruction cannot be stopped.
     *
     * @param {MessengerRnaDestroyer} messengerRnaDestroyer
     */
    initiateDestruction: function( messengerRnaDestroyer ) {
      assert && assert( this.messengerRnaDestroyer === messengerRnaDestroyer ); // Shouldn't get this from unattached destroyers.

      // Set the capacity of the first segment to the size of the channel through which it will be pulled plus the leader length.
      this.segmentWhereDestroyerConnects = this.shapeSegments.get( 0 );

      assert && assert( this.segmentWhereDestroyerConnects.isFlat() );
      this.segmentWhereDestroyerConnects.setCapacity( this.messengerRnaDestroyer.getDestructionChannelLength() + GEEConstants.LEADER_LENGTH );
    },

    /**
     * Get the proportion of the entire mRNA that has been translated by the given ribosome.
     *
     * @param {Ribosome} ribosome
     * @return
     */
    getProportionOfRnaTranslated: function( ribosome ) {
      assert && assert( this.mapRibosomeToShapeSegment.contains( ribosome ) ); // Makes no sense if ribosome isn't attached.
      var translatedLength = 0;
      var segmentInRibosomeChannel = this.mapRibosomeToShapeSegment.get( ribosome );

      assert && assert( segmentInRibosomeChannel.isFlat() ); // Make sure things are as we expect.

      // Add the length for each segment that precedes this ribosome.
      for ( var i = 0; i < this.shapeSegments.length; i++ ) {
        var shapeSegment = this.shapeSegments.get( i );
        if ( shapeSegment === segmentInRibosomeChannel ) {
          break;
        }
        translatedLength += shapeSegment.getContainedLength();
      }

      // Add the length for the segment that is inside the translation channel of this ribosome.
      translatedLength += segmentInRibosomeChannel.getContainedLength() -
                          ( segmentInRibosomeChannel.getLowerRightCornerPos().x -
                            segmentInRibosomeChannel.attachmentSite.locationProperty.get().x);

      return Math.max( translatedLength / this.getLength(), 0 );
    },

    /**
     *
     * @param {Ribosome} ribosome
     * @returns {AttachmentSite}
     */
    considerProposalFromByRibosome: function( ribosome ) {
      assert && assert( !this.mapRibosomeToShapeSegment.contains( ribosome ) ); // Shouldn't get redundant proposals from a ribosome.
      var returnValue = null;

      // Can't consider proposal if currently being destroyed.
      if ( this.messengerRnaDestroyer === null ) {

        // See if the attachment site at the leading edge of the mRNA is available.
        var leadingEdgeAttachmentSite = this.shapeSegments.get( 0 ).attachmentSite;
        if ( leadingEdgeAttachmentSite.attachedOrAttachingMoleculeProperty.get() === null &&
             leadingEdgeAttachmentSite.locationProperty.get().distance(
               ribosome.getEntranceOfRnaChannelPos() ) < RIBOSOME_CONNECTION_DISTANCE ) {

          // This attachment site is in range and available.
          returnValue = leadingEdgeAttachmentSite;

          // Update the attachment state machine.
          this.mRnaAttachmentStateMachine.attachedToRibosome();

          // Enter this connection in the map.
          this.mapRibosomeToShapeSegment.put( ribosome, this.shapeSegments.get( 0 ) );
        }
      }
      return returnValue;
    },

    /**
     *
     * @param {MessengerRnaDestroyer} messengerRnaDestroyer
     * @returns {AttachmentSite}
     */
    considerProposalFromByMessengerRnaDestroyer: function( messengerRnaDestroyer ) {
      assert && assert( this.messengerRnaDestroyer !== messengerRnaDestroyer ); // Shouldn't get redundant proposals from same destroyer.

      var returnValue = null;

      // Make sure that this mRNA is not already being destroyed.
      if ( this.messengerRnaDestroyer === null ) {

        // See if the attachment site at the leading edge of the mRNA is available.
        var leadingEdgeAttachmentSite = this.shapeSegments.get( 0 ).attachmentSite;
        if ( leadingEdgeAttachmentSite.attachedOrAttachingMoleculeProperty.get() === null &&
             leadingEdgeAttachmentSite.locationProperty.get().distance(
               messengerRnaDestroyer.getPosition() ) < MRNA_DESTROYER_CONNECT_DISTANCE ) {

          // This attachment site is in range and available.
          returnValue = leadingEdgeAttachmentSite;
          // Update the attachment state machine.
          this.mRnaAttachmentStateMachine.attachToDestroyer();
          // Keep track of the destroyer.
          this.messengerRnaDestroyer = messengerRnaDestroyer;
        }
      }

      return returnValue;
    },

    /*
     * Aborts the destruction process, used if the mRNA destroyer was on its way to the mRNA but the user picked it up
      * before it got there.
     */
    abortDestruction: function() {
      this.messengerRnaDestroyer = null;
      this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
    },

    /**
     * @Override
     * @returns {MessengerRnaAttachmentStateMachine}
     */
    createAttachmentStateMachine: function() {
      return new MessengerRnaAttachmentStateMachine( this );
    },

    /**
     *
     * @returns {Vector2}
     */
    getDestroyerAttachmentLocation: function() {
      // State checking - shouldn't be called before this is set.
      assert && assert( this.segmentWhereDestroyerConnects !== null );

      // Avoid null pointer exception.
      if ( this.segmentWhereDestroyerConnects === null ) {
        return Vector2.ZERO;
      }

      // The attachment location is at the right most side of the segment minus the leader length.
      return new Vector2( this.segmentWhereDestroyerConnects.getLowerRightCornerPos().x - GEEConstants.LEADER_LENGTH,
        this.segmentWhereDestroyerConnects.getLowerRightCornerPos().y );
    }

  } );
} );
