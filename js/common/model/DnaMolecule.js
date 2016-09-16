// Copyright 2015, University of Colorado Boulder
/**
 * This class models a molecule of DNA in the model.  It includes the shape of
 * the two "backbone" strands of the DNA and the individual base pairs, defines
 * where the various genes reside, and retains other information about the DNA
 * molecule.  This is an important and central object in the model for this
 * simulation.
 *
 * A big simplifying assumption that this class makes is that molecules that
 * attach to the DNA do so to individual base pairs.  In reality, biomolecules
 * attach to groups of base pairs, the exact configuration of which dictate
 * where biomolecules attach. This was unnecessarily complicated for the needs
 * of this sim.

 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );
  var AttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/AttachmentSite' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var BioShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BioShapeUtils' );
  var IntegerRange = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/IntegerRange' );
  var BasePair = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BasePair' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var DnaStrandSegment = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaStrandSegment' );
  var DnaStrandPoint = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaStrandPoint' );
    var StubGeneExpressionModel = require('GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/StubGeneExpressionModel');

  // constants
  // Distance within which transcription factors may attach.
  var TRANSCRIPTION_FACTOR_ATTACHMENT_DISTANCE = 400;

  // Distance within which RNA polymerase may attach.
  var RNA_POLYMERASE_ATTACHMENT_DISTANCE = 400;

  /**
   * @param {GeneExpressionModel} model //  The gene expression model within which this DNA strand exists.
   * Needed for evaluation of biomolecule interaction.
   *
   * @param {number} numBasePairs - number of base pairs in the strand
   *
   * @param {number} leftEdgeXOffset - x position in model space of the left side of
   * the molecule.  Y position is assumed to be zero.
   *
   * @param {boolean} pursueAttachments - flag that controls whether the DNA strand
   * actively pulls in transcription factors and polymerase, or just lets them drift into place.
   *
   * @constructor
   */
  function DnaMolecule( model, numBasePairs, leftEdgeXOffset, pursueAttachments ) {
      this.model = model || new StubGeneExpressionModel();
    this.leftEdgeXOffset = leftEdgeXOffset;
    this.pursueAttachments = pursueAttachments; // Flag that controls active pursual of transcription factors and polymerase.
    this.moleculeLength = numBasePairs * CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS;
    this.numberOfTwists = this.moleculeLength / CommonConstants.LENGTH_PER_TWIST;

    // Points that, when connected, define the shape of the DNA strands.
    this.strandPoints = []; // Array of DnaStrandPoint

    // The backbone strands that are portrayed in the view, which consist of lists of shapes.
    // This is done so that the shapes can be colored differently and layered in order to create a "twisted" look.
    this.strand1Segments = []; // Array of DnaStrandSegment
    this.strand2Segments = []; // Array of DnaStrandSegment

    // Base pairs within the DNA strand.
    this.basePairs = []; // Array of BasePair

    this.genes = [];// Array of Genes on this strand of DNA. // private

    // List of forced separations between the two strands.
    this.separations = []; // @private - Array.{DnaSeparation}

    // Add the initial set of shape-defining points for each of the two
    // strands.  Points are spaced the same as the base pairs.
    for ( var i = 0; i < this.moleculeLength / CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS; i++ ) {
      var xPos = leftEdgeXOffset + i * CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS;
      this.strandPoints.push( new DnaStrandPoint( xPos, this.getDnaStrandYPosition( xPos, 0 ),
        this.getDnaStrandYPosition( xPos, CommonConstants.INTER_STRAND_OFFSET ) ) );
    }

    // Shadow of the points that define the strand shapes, used for rapid
    // evaluation of any shape changes.
    // Create a shadow of the shape-defining points.  This will be used for detecting shape changes.
    this.strandPointsShadow = [];

    for ( var j = 0; j < this.strandPoints.length; j++ ) {
      var strandPoint = this.strandPoints[ j ];
      this.strandPointsShadow.push( new DnaStrandPoint( strandPoint ) );
    }

    // Create the sets of segments that will be observed by the view.
    this.initializeStrandSegments();

    // Add in the base pairs between the backbone strands.  This calculates the distance between the
    // two strands and puts a line between them in  order to look like the base pair.
    var basePairXPos = leftEdgeXOffset;
    while ( basePairXPos <= this.strandPoints[ this.strandPoints.length - 1 ].xPos ) {
      var strand1YPos = this.getDnaStrandYPosition( basePairXPos, 0 );
      var strand2YPos = this.getDnaStrandYPosition( basePairXPos, CommonConstants.INTER_STRAND_OFFSET );
      var height = Math.abs( strand1YPos - strand2YPos );
      var basePairYPos = ( strand1YPos + strand2YPos ) / 2;
      this.basePairs.push( new BasePair( new Vector2( basePairXPos, basePairYPos ), height ) );
      basePairXPos += CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS;
    }
  }

  geneExpressionEssentials.register( 'DnaMolecule', DnaMolecule );

  return inherit( Object, DnaMolecule, {

    /**
     * private
     * Get the index of the nearest base pair given an X position in model space.
     *
     * @param {number} xOffset
     * @returns {number}
     */
    getBasePairIndexFromXOffset: function( xOffset ) {
      // assert xOffset >= leftEdgeXOffset && xOffset < leftEdgeXOffset + moleculeLength;
      xOffset = Util.clamp( xOffset, this.leftEdgeXOffset, this.leftEdgeXOffset + CommonConstants.LENGTH_PER_TWIST * this.numberOfTwists );
      return (Math.round( ( xOffset - this.leftEdgeXOffset - CommonConstants.INTER_STRAND_OFFSET ) / CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS )) | 0; // make it int

    },

    /**
     * private
     * Get the X location of the nearest base pair given an arbitrary x location.
     * @param {number} xPos
     * @returns {number}
     */
    getNearestBasePairXOffset: function( xPos ) {
      return this.getBasePairXOffsetByIndex( this.getBasePairIndexFromXOffset( xPos ) );
    },


    /**
     * Initialize the DNA stand segment lists.
     * private
     */
    initializeStrandSegments: function() {
      var self = this;
      var strand1SegmentPoints = []; //ArrayList<Point2D> TODO
      var strand2SegmentPoints = [];
      var segmentStartX = this.strandPoints[ 0 ].xPos;
      var strand1InFront = true;
      _.forEach( this.strandPoints, function( dnaStrandPoint ) {
        var xPos = dnaStrandPoint.xPos;
        strand1SegmentPoints.push( new Vector2( xPos, dnaStrandPoint.strand1YPos ) );
        strand2SegmentPoints.push( new Vector2( xPos, dnaStrandPoint.strand2YPos ) );
        if ( xPos - segmentStartX >= ( CommonConstants.LENGTH_PER_TWIST / 2 ) ) {

          // Time to add these segments and start a new ones.
          self.strand1Segments.push( new DnaStrandSegment( BioShapeUtils.createCurvyLineFromPoints( strand1SegmentPoints ), strand1InFront ) );
          self.strand2Segments.push( new DnaStrandSegment( BioShapeUtils.createCurvyLineFromPoints( strand2SegmentPoints ), !strand1InFront ) );
          var firstPointOfNextSegment = strand1SegmentPoints[ strand1SegmentPoints.length - 1 ];
          strand1SegmentPoints = []; // clear;
          strand1SegmentPoints.push( firstPointOfNextSegment ); // This point must be on this segment too in order to prevent gaps.
          firstPointOfNextSegment = strand2SegmentPoints[ strand2SegmentPoints.length - 1 ];
          strand2SegmentPoints = []; //clear;
          strand2SegmentPoints.push( firstPointOfNextSegment ); // This point must be on this segment too in order to prevent gaps.
          segmentStartX = firstPointOfNextSegment.x;
          strand1InFront = !strand1InFront;
        }
      } );
    },

    /**
     * Get the Y position in model space for a DNA strand for the given X
     * position and offset.  The offset acts like a "phase difference", thus
     * allowing this method to be used to get location information for both
     * DNA strands.
     *
     * @param {number} xPos
     * @param {number} offset
     * @return {number}
     */
    getDnaStrandYPosition: function( xPos, offset ) {
      return Math.sin( ( xPos + offset ) / CommonConstants.LENGTH_PER_TWIST * Math.PI * 2 ) * CommonConstants.DNA_MOLECULE_DIAMETER / 2;
    },

    /**
     * private
     * Update the strand segment shapes based on things that might have
     * changed, such as biomolecules attaching and separating the strands or
     * otherwise deforming the nominal double-helix shape.
     */
    updateStrandSegments: function() {
      var self = this;
      // Set the shadow points to the nominal, non-deformed positions.
      _.forEach( this.strandPointsShadow, function( dnaStrandPoint ) {
        dnaStrandPoint.strand1YPos = self.getDnaStrandYPosition( dnaStrandPoint.xPos, 0 );
        dnaStrandPoint.strand2YPos = self.getDnaStrandYPosition( dnaStrandPoint.xPos, CommonConstants.INTER_STRAND_OFFSET );
      } );

      // Move the shadow points to account for any separations.
      _.forEach( this.separations, function( separation ) {
        var windowWidth = separation.getAmount() * 1.5; // Make the window wider than it is high.  This was chosen to look decent, tweak if needed.
        var separationWindowXIndexRange = new IntegerRange( Math.floor( ( separation.getXPos() - ( windowWidth / 2 ) -
                                                                          self.leftEdgeXOffset ) / CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS ) | 0,
          Math.floor( ( separation.getXPos() + ( windowWidth / 2 ) - self.leftEdgeXOffset ) / CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS ) | 0 );
        for ( var i = separationWindowXIndexRange.getMin(); i < separationWindowXIndexRange.getMax(); i++ ) {
          var windowCenterX = ( separationWindowXIndexRange.getMin() + separationWindowXIndexRange.getMax() ) / 2;
          if ( i >= 0 && i < self.strandPointsShadow.length ) {

            // Perform a windowing algorithm that weights the separation
            // at 1 in the center, 0 at the edges, and linear
            // graduations in between.  By
            var separationWeight = 1 - Math.abs( 2 * ( i - windowCenterX ) / separationWindowXIndexRange.getLength() );
            self.strandPointsShadow[ i ].strand1YPos = ( 1 - separationWeight ) * self.strandPointsShadow[ i ].strand1YPos +
                                                               separationWeight * separation.getAmount() / 2;
            self.strandPointsShadow[ i ].strand2YPos = ( 1 - separationWeight ) * self.strandPointsShadow[ i ].strand2YPos -
                                                               separationWeight * separation.getAmount() / 2;
          }
        }
      } );

      // See if any of the points have moved and, if so, update the
      // corresponding shape segment.
      var numSegments = this.strand1Segments.length;
      for ( var i = 0; i < numSegments; i++ ) {
        var segmentChanged = false;
        var strand1Segment = this.strand1Segments[ i ];
        var strand2Segment = this.strand2Segments[ i ];

        // Determine the bounds of the current segment.  Assumes that the
        // bounds for the strand1 and strand2 segments are the same, which
        // should be a safe assumption.
        var bounds = strand1Segment.getShape().bounds;
        var pointIndexRange = new IntegerRange( Math.floor( ( bounds.getMinX() - this.leftEdgeXOffset ) / CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS ) | 0,
          Math.floor( ( bounds.getMaxX() - this.leftEdgeXOffset ) / CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS ) | 0 );

        // Check to see if any of the points within the identified range
        // have changed and, if so, update the corresponding segment shape
        // in the strands.  If the points for either strand has changed,
        // both are updated.
        for ( var j = pointIndexRange.getMin(); j <= pointIndexRange.getMax(); j++ ) {
          if ( !this.strandPoints[ j ].equals( this.strandPointsShadow[ j ] ) ) {

            // The point has changed.  Update it, mark the change.
            this.strandPoints[ j ].set( this.strandPointsShadow[ j ] );
            segmentChanged = true;
          }
        }

        if ( segmentChanged ) {

          // Update the shape of this segment.
          var strand1ShapePoints = [];
          var strand2ShapePoints = [];
          for ( var k = pointIndexRange.getMin(); k <= pointIndexRange.getMax(); k++ ) {
            //for performance reasons using object literals instead of Vector instances
            strand1ShapePoints.push( { x: this.strandPoints[ k ].xPos, y: this.strandPoints[ k ].strand1YPos } );
            strand2ShapePoints.push( { x: this.strandPoints[ k ].xPos, y: this.strandPoints[ k ].strand2YPos } );
          }
          strand1Segment.setShape( BioShapeUtils.createCurvyLineFromPoints( strand1ShapePoints ) );
          strand2Segment.setShape( BioShapeUtils.createCurvyLineFromPoints( strand2ShapePoints ) );
        }
      }
    },

    /**
     *
     * @param {number} dt
     */
    stepInTime: function( dt ) {
      this.updateStrandSegments();
      _.forEach( this.genes, function( gene ) {
        gene.updateAffinities();
      } );
    },

    /**
     * @returns {number}
     */
    getLength: function() {
      return this.moleculeLength;
    },

    /**
     * Add a gene to the DNA strand.  Adding a gene essentially defines it,
     * since in this sim, the base pairs don't actually encode anything, so
     * adding the gene essentially delineates where it is on the strand.
     *
     * @param {Gene} geneToAdd Gene to add to the DNA strand.
     */
    addGene: function( geneToAdd ) {
      this.genes.push( geneToAdd );
    },

    /**
     * Get the X position of the specified base pair.  The first base pair at
     * the left side of the DNA molecule is base pair 0, and it goes up from
     * there.
     *
     * @param {number} basePairNumber
     * @returns {number}
     */
    getBasePairXOffsetByIndex: function( basePairNumber ) {
      return this.leftEdgeXOffset + CommonConstants.INTER_STRAND_OFFSET +
             basePairNumber * CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS;
    },

    /**
     * @param {DnaSeparation} separation
     */
    addSeparation: function( separation ) {
      this.separations.push( separation );
    },

    /**
     * @param {DnaSeparation} separation
     */
    removeSeparation: function( separation ) {
      if ( !_.contains( this.separations, separation ) ) {
        console.log( ' - Warning: Ignoring attempt to remove separation that can\'t be found.' );
      }
      else {
        _.remove( this.separations, function( value ) {
          return separation === value;
        } );
      }
    },

    /**
     * @returns {Array <DnaStrandSegment>}
     */
    getStrand1Segments: function() {
      return this.strand1Segments;
    },

    /**
     * @returns {Array <DnaStrandSegment>}
     */
    getStrand2Segments: function() {
      return this.strand2Segments;
    },

    /**
     * @returns {Array <Gene>}
     */
    getGenes: function() {
      return this.genes;
    },

    /**
     * @returns {Gene}
     */
    getLastGene: function() {
      return this.genes[ this.genes.length - 1 ];
    },

    /**
     * @returns {Array <BasePair>}
     */
    getBasePairs: function() {
      return this.basePairs;
    },

    /**
     * @param {MobileBiomolecule} biomolecule
     */
    activateHints: function( biomolecule ) {
      _.forEach( this.genes, function( gene ) {
        gene.activateHints( biomolecule );
      } );
    },

    deactivateAllHints: function() {
      _.forEach( this.genes, function( gene ) {
        gene.deactivateHints();
      } );

    },

    /**
     * Get the position in model space of the leftmost edge of the DNA strand.
     * The Y position is in the vertical center of the strand.
     *
     * @returns {Vector2}
     */
    getLeftEdgePos: function() {
      return new Vector2( this.leftEdgeXOffset, CommonConstants.DNA_MOLECULE_Y_POS );
    },


    /**
     * Consider an attachment proposal from a transcription factor instance.
     * To determine whether or not to accept or reject this proposal, the base
     * pairs are scanned in order to determine whether there is an appropriate
     * and available attachment site within the attachment distance.
     * or Consider an attachment proposal from an instance of RNA polymerase.
     *
     * @param {TranscriptionFactor} transcriptionFactor
     * @return {AttachmentSite}
     */
    considerProposalFromByTranscriptionFactor: function( transcriptionFactor ) {
      var self = this;
      return this.considerProposalFromBiomolecule( transcriptionFactor, TRANSCRIPTION_FACTOR_ATTACHMENT_DISTANCE,
        function( basePairIndex ) {
          return self.getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex, transcriptionFactor.getConfig() );
        },
        function( gene ) {
          return true; // TFs can always attach if a spot is available.
        },
        function( gene ) {
          return gene.getMatchingSite( transcriptionFactor.getConfig() );
        }
      );

    },

    /**
     * @param {RnaPolymerase} rnaPolymerase
     * @returns {AttachmentSite}
     */
    considerProposalFromByRnaPolymerase: function( rnaPolymerase ) {
      var self = this;
      return this.considerProposalFromBiomolecule( rnaPolymerase, RNA_POLYMERASE_ATTACHMENT_DISTANCE,
        function( basePairIndex ) {
          return self.getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex );
        },
        function( gene ) {
          return gene.transcriptionFactorsSupportTranscription();
        },
        function( gene ) {
          return gene.getPolymeraseAttachmentSite();
        }
      );

    },

    /**
     * @private
     * Consider a proposal from a biomolecule.  This is the generic version
     * that avoids duplicated code.
     * @param {MobileBiomolecule} biomolecule
     * @param {number} maxAttachDistance
     * @param {Function<Integer>} getAttachSiteForBasePair
     * @param {Function<Gene>} isOkayToAttach
     * @param {Function<Gene>} getAttachmentSite
     * @returns {*}
     */
    considerProposalFromBiomolecule: function( biomolecule, maxAttachDistance, getAttachSiteForBasePair, isOkayToAttach,
                                               getAttachmentSite ) {

      var potentialAttachmentSites = [];
      for ( var i = 0; i < this.basePairs.length; i++ ) {
        // See if the base pair is within the max attachment distance.
        var attachmentSiteLocation = new Vector2( this.basePairs[ i ].getCenterLocation().x, CommonConstants.DNA_MOLECULE_Y_POS );
        if ( attachmentSiteLocation.distance( biomolecule.getPosition() ) <= maxAttachDistance ) {
          // In range.  Add it to the list if it is available.
          var potentialAttachmentSite = getAttachSiteForBasePair( i );
          if ( potentialAttachmentSite.attachedOrAttachingMolecule === null ) {
            potentialAttachmentSites.push( potentialAttachmentSite );
          }
        }
      }

      // If there aren't any potential attachment sites in range, check for
      // a particular set of conditions under which the DNA provides an
      // attachment site anyways.
      if ( potentialAttachmentSites.length === 0 && this.pursueAttachments ) {
        _.forEach( this.genes, function( gene ) {
          if ( isOkayToAttach( gene ) ) {
            var matchingSite = getAttachmentSite( gene );

            // Found a matching site on a gene.
            if ( matchingSite.attachedOrAttachingMolecule === null ) {

              // The site is unoccupied, so add it to the list of  potential sites.
              potentialAttachmentSites.push( matchingSite );
            }
            else if ( !matchingSite.isMoleculeAttached() ) {
              var thisDistance = biomolecule.getPosition().distance( matchingSite.location );
              var thatDistance = matchingSite.attachedOrAttachingMolecule.getPosition().distance(
                matchingSite.location );
              if ( thisDistance < thatDistance ) {

                // The other molecule is not yet attached, and this one is closer, so force the other molecule to
                // abort its pending attachment.
                matchingSite.attachedOrAttachingMolecule.forceAbortPendingAttachment();

                // Add this site to the list of potential sites.
                potentialAttachmentSites.push( matchingSite );
              }
            }

          }

        } );

      }// if

      // Eliminate sites that would put the molecule out of bounds or
      // would overlap with other attached biomolecules.
      potentialAttachmentSites = this.eliminateInvalidAttachmentSites( biomolecule, potentialAttachmentSites );
      if ( potentialAttachmentSites.length === 0 ) {

        // No acceptable sites found.
        return null;
      }

      var exponent = 1;
      var attachLocation = biomolecule.getPosition();

      // Sort the collection so that the best site is at the top of the list.
      potentialAttachmentSites.sort( function( attachmentSite1, attachmentSite2 ) {

        // The comparison is based on a combination of the affinity and the
        // distance, much like gravitational attraction.  The exponent
        // effectively sets the relative weighting of one versus another.
        // An exponent value of zero means only the affinity matters, a
        // value of 100 means it is pretty much entirely distance.  A value
        // of 2 is how gravity works, so it appears kind of natural.  Tweak
        // as needed.
        var as1Factor = attachmentSite1.getAffinity() / Math.pow( attachLocation.distance( attachmentSite1.locationProperty.get() ), exponent );
        var as2Factor = attachmentSite2.getAffinity() / Math.pow( attachLocation.distance( attachmentSite2.locationProperty.get() ), exponent );

        if ( as2Factor > as1Factor ){
          return 1;
        }

        if ( as2Factor < as1Factor ){
          return -1;
        }
        return 0;
      } );

      //potentialAttachmentSites = potentialAttachmentSites.reverse();

      // Return the optimal attachment site.
      return potentialAttachmentSites[ 0 ];
    },

    /**
     * @private
     * Take a list of attachment sites and eliminate any of them that, if the
     * given molecule attaches, it would end up out of bounds or overlapping
     * with another biomolecule that is already attached to the DNA strand.
     *
     * @param  {MobileBiomolecule} biomolecule     -         The biomolecule that is potentially going to
     *                                 attach to the provided list of attachment sites.
     * @param {Array} potentialAttachmentSites -  Attachment sites where the given
     *                                 biomolecule could attach.
     */
    eliminateInvalidAttachmentSites: function( biomolecule, potentialAttachmentSites ) {
      var self = this;
      return _.filter( potentialAttachmentSites, function( attachmentSite ) {
        var translationVector = attachmentSite.location.minus( biomolecule.getPosition() );
        var transform = Matrix3.translation( translationVector.x, translationVector.y );
        var translatedShape = biomolecule.getShape().transformed( transform );
        var inBounds = biomolecule.motionBounds.inBounds( translatedShape );
        var overlapsOtherMolecules = false;
        var list = self.model.getOverlappingBiomolecules( translatedShape );
        for ( var i = 0; i < list.length; i++ ) {
          var mobileBiomolecule = list[ i ];
          if ( mobileBiomolecule.attachedToDna && mobileBiomolecule !== biomolecule ) {
            overlapsOtherMolecules = true;
            break;
          }
        }
        return inBounds && !overlapsOtherMolecules;

      } );
    },

    /**
     * @private
     * @param {MobileBiomolecule} biomolecule
     * @param {Array<AttachmentSite>} potentialAttachmentSites
     * @returns {Array<AttachmentSite>}
     */
    eliminateOverlappingAttachmentSitesNew: function( biomolecule, potentialAttachmentSites ) {
      return _.filter( potentialAttachmentSites, function( attachmentSite ) {
        var translationVector = attachmentSite.location.minus( biomolecule.getPosition() );
        var transform = Matrix3.translation( translationVector.x, translationVector.y );
        var translatedShape = biomolecule.getShape().transformed( transform );
        return biomolecule.motionBoundsProperty.get().inBounds( translatedShape );
      } );

    },

    /**
     * @private
     * @param {number} i
     * @param {TranscriptionFactorConfig} tfConfig
     * @returns {AttachmentSite}
     */
    getTranscriptionFactorAttachmentSiteForBasePairIndex: function( i, tfConfig ) {
      // See if this base pair is inside a gene.
      var gene = this.getGeneContainingBasePair( i );
      var attachmentSite = null;

      if ( gene !== null ) {
        // Base pair is in a gene, so get it from the gene.
        attachmentSite = gene.getTranscriptionFactorAttachmentSite( i, tfConfig );
      }
      else {
        // Base pair is not contained within a gene, so use the default.
        attachmentSite = this.createDefaultAffinityAttachmentSiteByInt( i );
      }

      return attachmentSite;
    },


    /**
     * @private
     * @param {number} i
     * @returns {AttachmentSite}
     */
    getRnaPolymeraseAttachmentSiteForBasePairIndex: function( i ) {
      // See if this base pair is inside a gene.
      var gene = this.getGeneContainingBasePair( i );
      if ( gene !== null ) {
        // Base pair is in a gene.  See if site is available.
        return gene.getPolymeraseAttachmentSiteByIndex( i );
      }
      else {
        // Base pair is not contained within a gene, so use the default.
        return this.createDefaultAffinityAttachmentSiteByInt( i );
      }
    },

    /**
     * Get the two base pair attachment sites that are next to the provided
     * one, i.e. the one before it on the DNA strand and the one after it.  If
     * at one end of the strand, only one site will be returned.  Occupied
     * sites are not returned.
     *
     * @param {TranscriptionFactor} transcriptionFactor
     * @param {AttachmentSite} attachmentSite
     * @returns {Array <AttachmentSite>}
     */
    getAdjacentAttachmentSitesTranscriptionFactor: function( transcriptionFactor, attachmentSite ) {
      var basePairIndex = this.getBasePairIndexFromXOffset( attachmentSite.locationProperty.get().x );
      var attachmentSites = [];
      var potentialSite;
      if ( basePairIndex !== 0 ) {
        potentialSite = this.getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex - 1,
          transcriptionFactor.getConfig() );
        if ( potentialSite.attachedOrAttachingMolecule === null ) {
          attachmentSites.push( potentialSite );
        }
      }
      if ( basePairIndex !== this.basePairs.length - 1 ) {
        potentialSite = this.getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex + 1,
          transcriptionFactor.getConfig() );
        if ( potentialSite.attachedOrAttachingMolecule === null ) {
          attachmentSites.push( potentialSite );
        }
      }

      return this.eliminateInvalidAttachmentSites( transcriptionFactor, attachmentSites );
    },

    /**
     * Get the two base pair attachment sites that are next to the provided
     * one, i.e. the one before it on the DNA strand and the one after it.  If
     * at one end of the strand, only one site will be returned.  Occupied
     * sites are not returned.
     *
     * @param {RnaPolymerase} rnaPolymerase
     * @param  {AttachmentSite} attachmentSite
     * @returns {Array <AttachmentSite>}
     */
    getAdjacentAttachmentSitesRnaPolymerase: function( rnaPolymerase, attachmentSite ) {
      var basePairIndex = this.getBasePairIndexFromXOffset( attachmentSite.locationProperty.get().x );
      var attachmentSites = [];
      var potentialSite;
      if ( basePairIndex !== 0 ) {
        potentialSite = this.getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex - 1 );
        if ( potentialSite.attachedOrAttachingMolecule === null ) {
          attachmentSites.push( potentialSite );
        }
      }
      if ( basePairIndex !== this.basePairs.length - 1 ) {
        potentialSite = this.getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex + 1 );
        if ( potentialSite.attachedOrAttachingMolecule === null ) {
          attachmentSites.push( potentialSite );
        }
      }

      // Eliminate sites that would put the molecule out of bounds or
      // would overlap with other attached biomolecules.
      return this.eliminateInvalidAttachmentSites( rnaPolymerase, attachmentSites );
    },

    /**
     * @private
     * @param {number} basePairIndex
     * @returns {Gene}
     */
    getGeneContainingBasePair: function( basePairIndex ) {
      var geneContainingBasePair = null;
      for ( var i = 0; i < this.genes.length; i++ ) {
        var gene = this.genes[ i ];
        if ( gene.containsBasePair( basePairIndex ) ) {
          geneContainingBasePair = gene;
          break;
        }
      }

      return geneContainingBasePair;
    },

    /**
     * @private
     * True, if number is integer
     *
     * @param {number} value
     * @returns {boolean}
     */
    isInteger: function( value ) {
      if ( isNaN( value ) ) {
        return false;
      }
      var x = parseFloat( value );
      return (x | 0) === x;
    },

    /**
     * Handles overloaded createDefaultAffinityAttachmentSite by Data type
     * @param value
     * @returns {*}
     */


    /**
     * Create an attachment site instance with the default affinity for all
     * DNA-attaching biomolecules at the specified x offset.
     *
     * @param {number} xOffset
     * @return
     */
    createDefaultAffinityAttachmentSiteByDouble: function( xOffset ) {
      return new AttachmentSite( new Vector2( this.getNearestBasePairXOffset( xOffset ),
        CommonConstants.DNA_MOLECULE_Y_POS ), CommonConstants.DEFAULT_AFFINITY );
    },


    /**
     * Create an attachment site instance with the default affinity for all
     * DNA-attaching biomolecules at the specified x offset.
     *
     * @param {number} xOffset
     * @return
     */
    createDefaultAffinityAttachmentSiteByInt: function( xOffset ) {

      //    console.log("this.getBasePairXOffsetByIndex( xOffset ) "+ xOffset + "   "+ this.getBasePairXOffsetByIndex( xOffset ));

      return new AttachmentSite( new Vector2( this.getBasePairXOffsetByIndex( xOffset ),
        CommonConstants.DNA_MOLECULE_Y_POS ), CommonConstants.DEFAULT_AFFINITY );
    },


    /**
     * Get a reference to the gene that contains the given location.
     *
     * @param {Vector} location
     * @return {Gene} Gene at the location, null if no gene exists.
     */
    getGeneAtLocation: function( location ) {
      if ( !( location.x >= this.leftEdgeXOffset && location.x <= this.leftEdgeXOffset + this.moleculeLength &&
              location.y >= CommonConstants.DNA_MOLECULE_Y_POS - CommonConstants.DNA_MOLECULE_DIAMETER / 2 && location.y <= CommonConstants.DNA_MOLECULE_Y_POS + CommonConstants.DNA_MOLECULE_DIAMETER / 2 ) ) {
        console.log( ' - Warning: Location for gene test is not on DNA molecule.' );
        return null;
      }
      var geneAtLocation = null;
      var basePairIndex = this.getBasePairIndexFromXOffset( location.x );
      _.forEach( this.genes, function( gene ) {
        if ( gene.containsBasePair( basePairIndex ) ) {

          // Found the corresponding gene.
          geneAtLocation = gene;
          return false; //break;
        }
      } );
      return geneAtLocation;
    },

    reset: function() {
      _.forEach( this.genes, function( gene ) {
        gene.clearAttachmentSites();
      } );

        this.separations = [];

    }

  } );

} );


// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import java.awt.Shape;
//import java.awt.geom.AffineTransform;
//import java.awt.geom.Point2D;
//import java.awt.geom.Rectangle2D;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.Comparator;
//import java.util.List;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.util.FunctionalUtils;
//import edu.colorado.phet.common.phetcommon.util.IntegerRange;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor.TranscriptionFactorConfig;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model.StubGeneExpressionModel;
//
///**
// * This class models a molecule of DNA in the model.  It includes the shape of
// * the two "backbone" strands of the DNA and the individual base pairs, defines
// * where the various genes reside, and retains other information about the DNA
// * molecule.  This is an important and central object in the model for this
// * simulation.
// * <p/>
// * A big simplifying assumption that this class makes is that molecules that
// * attach to the DNA do so to individual base pairs.  In reality, biomolecules
// * attach to groups of base pairs, the exact configuration of which dictate
// * where biomolecules attach. This was unnecessarily complicated for the needs
// * of this sim.
// *
// * @author John Blanco
// */
//public class DnaMolecule {
//
//    //-------------------------------------------------------------------------
//    // Class Data
//    //-------------------------------------------------------------------------
//
//    // Constants the define the geometry of the DNA molecule.
//    public static final double DIAMETER = 200; // In picometers.
//    private static final double LENGTH_PER_TWIST = 340; // In picometers.
//    public static final int BASE_PAIRS_PER_TWIST = 10; // In picometers.
//    public static final double DISTANCE_BETWEEN_BASE_PAIRS = LENGTH_PER_TWIST / BASE_PAIRS_PER_TWIST;
//    private static final double INTER_STRAND_OFFSET = LENGTH_PER_TWIST * 0.3;
//    public static final double Y_POS = 0; // Y position of the molecule in model space.
//
//    // Distance within which transcription factors may attach.
//    private static final double TRANSCRIPTION_FACTOR_ATTACHMENT_DISTANCE = 400;
//
//    // Distance within which RNA polymerase may attach.
//    private static final double RNA_POLYMERASE_ATTACHMENT_DISTANCE = 400;
//
//    // Default affinity for any given biomolecule.
//    public static final double DEFAULT_AFFINITY = 0.05;
//
//    //-------------------------------------------------------------------------
//    // Instance Data
//    //-------------------------------------------------------------------------
//
//    // Reference to the model in which this is contained.
//    private final GeneExpressionModel model;
//
//    private final double moleculeLength;
//    private final double numberOfTwists;
//    private final double leftEdgeXOffset;
//
//    // Points that, when connected, define the shape of the DNA strands.
//    private final List<DnaStrandPoint> strandPoints = new ArrayList<DnaStrandPoint>();
//
//    // Shadow of the points that define the strand shapes, used for rapid
//    // evaluation of any shape changes.
//    private final List<DnaStrandPoint> strandPointsShadow;
//
//    // The backbone strands that are portrayed in the view, which consist of
//    // lists of shapes.  This is done so that the shapes can be colored
//    // differently and layered in order to create a "twisted" look.
//    private final List<DnaStrandSegment> strand1Segments = new ArrayList<DnaStrandSegment>();
//    private final List<DnaStrandSegment> strand2Segments = new ArrayList<DnaStrandSegment>();
//
//    // Base pairs within the DNA strand.
//    private final ArrayList<BasePair> basePairs = new ArrayList<BasePair>();
//
//    // Genes on this strand of DNA.
//    private final ArrayList<Gene> genes = new ArrayList<Gene>();
//
//    // List of forced separations between the two strands.
//    private final List<DnaSeparation> separations = new ArrayList<DnaSeparation>();
//
//    // Flag that controls active pursual of transcription factors and polymerase.
//    private final boolean pursueAttachments;
//
//    //-------------------------------------------------------------------------
//    // Constructor(s)
//    //-------------------------------------------------------------------------
//
//    /**
//     * Constructor that doesn't specify a model, so a stub model is created.
//     * This is primarily for use in creating DNA likenesses on control panels.
//     *
//     * @param numBasePairs      - number of base pairs in the strand
//     * @param leftEdgeXOffset   - x position in model space of the left side of
//     *                          the molecule.  Y position is assumed to be zero.
//     * @param pursueAttachments - flag that controls whether the DNA strand
//     *                          actively pulls in transcription factors and polymerase, or just lets
//     *                          them drift into place.
//     */
//    public DnaMolecule( int numBasePairs, double leftEdgeXOffset, boolean pursueAttachments ) {
//        this( new StubGeneExpressionModel(), numBasePairs, leftEdgeXOffset, pursueAttachments );
//    }
//
//    /**
//     * Constructor.
//     *
//     * @param model             The gene expression model within which this DNA
//     *                          strand exists.  Needed for evaluation of
//     *                          biomolecule interaction.
//     * @param numBasePairs      The number of base pairs on the DNA strand.
//     *                          This defines the length of the strand.
//     * @param leftEdgeXOffset   Offset of the left edge of the DNA strand in
//     *                          model space.  This is needed to allow the DNA
//     *                          strand to be initially shifted such that a gene
//     *                          is visible to the user when the view is first
//     *                          shown.
//     * @param pursueAttachments Flag that controls whether the DNA strand
//     *                          should interact with other biomolecules.
//     */
//    public DnaMolecule( GeneExpressionModel model, int numBasePairs, double leftEdgeXOffset, boolean pursueAttachments ) {
//        this.model = model;
//        this.leftEdgeXOffset = leftEdgeXOffset;
//        this.pursueAttachments = pursueAttachments;
//
//        moleculeLength = (double) numBasePairs * DISTANCE_BETWEEN_BASE_PAIRS;
//        numberOfTwists = moleculeLength / LENGTH_PER_TWIST;
//
//        // Add the initial set of shape-defining points for each of the two
//        // strands.  Points are spaced the same as the base pairs.
//        for ( int i = 0; i < moleculeLength / DISTANCE_BETWEEN_BASE_PAIRS; i++ ) {
//            double xPos = leftEdgeXOffset + i * DISTANCE_BETWEEN_BASE_PAIRS;
//            strandPoints.add( new DnaStrandPoint( xPos, getDnaStrandYPosition( xPos, 0 ), getDnaStrandYPosition( xPos, INTER_STRAND_OFFSET ) ) );
//        }
//
//        // Create a shadow of the shape-defining points.  This will be used for
//        // detecting shape changes.
//        strandPointsShadow = new ArrayList<DnaStrandPoint>( strandPoints.size() );
//        for ( DnaStrandPoint strandPoint : strandPoints ) {
//            strandPointsShadow.add( new DnaStrandPoint( strandPoint ) );
//        }
//
//        // Create the sets of segments that will be observed by the view.
//        initializeStrandSegments();
//
//        // Add in the base pairs between the backbone strands.  This calculates
//        // the distance between the two strands and puts a line between them in
//        // order to look like the base pair.
//        double basePairXPos = leftEdgeXOffset;
//        while ( basePairXPos <= strandPoints.get( strandPoints.size() - 1 ).xPos ) {
//            double strand1YPos = getDnaStrandYPosition( basePairXPos, 0 );
//            double strand2YPos = getDnaStrandYPosition( basePairXPos, INTER_STRAND_OFFSET );
//            double height = Math.abs( strand1YPos - strand2YPos );
//            double basePairYPos = ( strand1YPos + strand2YPos ) / 2;
//            basePairs.add( new BasePair( new Point2D.Double( basePairXPos, basePairYPos ), height ) );
//            basePairXPos += DISTANCE_BETWEEN_BASE_PAIRS;
//        }
//    }
//
//    //-------------------------------------------------------------------------
//    // Methods
//    //-------------------------------------------------------------------------
//
//    public void stepInTime( double dt ) {
//        updateStrandSegments();
//        for ( Gene gene : genes ) {
//            gene.updateAffinities();
//        }
//    }
//
//    public double getLength() {
//        return moleculeLength;
//    }
//
//    /**
//     * Add a gene to the DNA strand.  Adding a gene essentially defines it,
//     * since in this sim, the base pairs don't actually encode anything, so
//     * adding the gene essentially delineates where it is on the strand.
//     *
//     * @param geneToAdd Gene to add to the DNA strand.
//     */
//    public void addGene( Gene geneToAdd ) {
//        genes.add( geneToAdd );
//    }
//
//    /**
//     * Get the X position of the specified base pair.  The first base pair at
//     * the left side of the DNA molecule is base pair 0, and it goes up from
//     * there.
//     */
//    public double getBasePairXOffsetByIndex( int basePairNumber ) {
//        return leftEdgeXOffset + INTER_STRAND_OFFSET + (double) basePairNumber * DISTANCE_BETWEEN_BASE_PAIRS;
//    }
//
//    public void addSeparation( DnaSeparation separation ) {
//        separations.add( separation );
//    }
//
//    public void removeSeparation( DnaSeparation separation ) {
//        if ( !separations.contains( separation ) ) {
//            System.out.println( getClass().getName() + " - Warning: Ignoring attempt to remove separation that can't be found." );
//        }
//        else {
//            separations.remove( separation );
//        }
//    }
//
//    /**
//     * Get the index of the nearest base pair given an X position in model
//     * space.
//     */
//    private int getBasePairIndexFromXOffset( double xOffset ) {
//        assert xOffset >= leftEdgeXOffset && xOffset < leftEdgeXOffset + moleculeLength;
//        xOffset = MathUtil.clamp( leftEdgeXOffset, xOffset, leftEdgeXOffset + LENGTH_PER_TWIST * numberOfTwists );
//        return (int) Math.round( ( xOffset - leftEdgeXOffset - INTER_STRAND_OFFSET ) / DISTANCE_BETWEEN_BASE_PAIRS );
//    }
//
//    /**
//     * Get the X location of the nearest base pair given an arbitrary x
//     * location.
//     */
//    private double getNearestBasePairXOffset( double xPos ) {
//        return getBasePairXOffsetByIndex( getBasePairIndexFromXOffset( xPos ) );
//    }
//
//    // Initialize the DNA stand segment lists.
//    private void initializeStrandSegments() {
//        assert strandPoints.size() > 0; // Parameter checking.
//
//        List<Point2D> strand1SegmentPoints = new ArrayList<Point2D>();
//        List<Point2D> strand2SegmentPoints = new ArrayList<Point2D>();
//        double segmentStartX = strandPoints.get( 0 ).xPos;
//        boolean strand1InFront = true;
//        for ( DnaStrandPoint dnaStrandPoint : strandPoints ) {
//            double xPos = dnaStrandPoint.xPos;
//            strand1SegmentPoints.add( new Point2D.Double( xPos, dnaStrandPoint.strand1YPos ) );
//            strand2SegmentPoints.add( new Point2D.Double( xPos, dnaStrandPoint.strand2YPos ) );
//            if ( xPos - segmentStartX >= ( LENGTH_PER_TWIST / 2 ) ) {
//                // Time to add these segments and start a new ones.
//                strand1Segments.add( new DnaStrandSegment( BioShapeUtils.createCurvyLineFromPoints( strand1SegmentPoints ), strand1InFront ) );
//                strand2Segments.add( new DnaStrandSegment( BioShapeUtils.createCurvyLineFromPoints( strand2SegmentPoints ), !strand1InFront ) );
//                Point2D firstPointOfNextSegment = strand1SegmentPoints.get( strand1SegmentPoints.size() - 1 );
//                strand1SegmentPoints.clear();
//                strand1SegmentPoints.add( firstPointOfNextSegment ); // This point must be on this segment too in order to prevent gaps.
//                firstPointOfNextSegment = strand2SegmentPoints.get( strand2SegmentPoints.size() - 1 );
//                strand2SegmentPoints.clear();
//                strand2SegmentPoints.add( firstPointOfNextSegment ); // This point must be on this segment too in order to prevent gaps.
//                segmentStartX = firstPointOfNextSegment.getX();
//                strand1InFront = !strand1InFront;
//            }
//        }
//    }
//
//    /**
//     * Get the Y position in model space for a DNA strand for the given X
//     * position and offset.  The offset acts like a "phase difference", thus
//     * allowing this method to be used to get location information for both
//     * DNA strands.
//     *
//     * @param xPos
//     * @param offset
//     * @return
//     */
//    private double getDnaStrandYPosition( double xPos, double offset ) {
//        return Math.sin( ( xPos + offset ) / LENGTH_PER_TWIST * Math.PI * 2 ) * DIAMETER / 2;
//    }
//
//    /**
//     * Update the strand segment shapes based on things that might have
//     * changed, such as biomolecules attaching and separating the strands or
//     * otherwise deforming the nominal double-helix shape.
//     */
//    private void updateStrandSegments() {
//
//        // Set the shadow points to the nominal, non-deformed positions.
//        for ( DnaStrandPoint dnaStrandPoint : strandPointsShadow ) {
//            dnaStrandPoint.strand1YPos = getDnaStrandYPosition( dnaStrandPoint.xPos, 0 );
//            dnaStrandPoint.strand2YPos = getDnaStrandYPosition( dnaStrandPoint.xPos, INTER_STRAND_OFFSET );
//        }
//
//        // Move the shadow points to account for any separations.
//        for ( DnaSeparation separation : separations ) {
//            double windowWidth = separation.getAmount() * 1.5; // Make the window wider than it is high.  This was chosen to look decent, tweak if needed.
//            IntegerRange separationWindowXIndexRange = new IntegerRange( (int) Math.floor( ( separation.getXPos() - ( windowWidth / 2 ) - leftEdgeXOffset ) / DISTANCE_BETWEEN_BASE_PAIRS ),
//                                                                         (int) Math.floor( ( separation.getXPos() + ( windowWidth / 2 ) - leftEdgeXOffset ) / DISTANCE_BETWEEN_BASE_PAIRS ) );
//            for ( int i = separationWindowXIndexRange.getMin(); i < separationWindowXIndexRange.getMax(); i++ ) {
//                double windowCenterX = ( separationWindowXIndexRange.getMin() + separationWindowXIndexRange.getMax() ) / 2;
//                if ( i >= 0 && i < strandPointsShadow.size() ) {
//
//                    // Perform a windowing algorithm that weights the separation
//                    // at 1 in the center, 0 at the edges, and linear
//                    // graduations in between.  By
//                    double separationWeight = 1 - Math.abs( 2 * ( i - windowCenterX ) / separationWindowXIndexRange.getLength() );
//                    strandPointsShadow.get( i ).strand1YPos = ( 1 - separationWeight ) * strandPointsShadow.get( i ).strand1YPos +
//                                                              separationWeight * separation.getAmount() / 2;
//                    strandPointsShadow.get( i ).strand2YPos = ( 1 - separationWeight ) * strandPointsShadow.get( i ).strand2YPos -
//                                                              separationWeight * separation.getAmount() / 2;
//                }
//            }
//        }
//
//        // See if any of the points have moved and, if so, update the
//        // corresponding shape segment.
//        int numSegments = strand1Segments.size();
//        assert numSegments == strand2Segments.size(); // Should be the same, won't work if not.
//        for ( int i = 0; i < numSegments; i++ ) {
//            boolean segmentChanged = false;
//            DnaStrandSegment strand1Segment = strand1Segments.get( i );
//            DnaStrandSegment strand2Segment = strand2Segments.get( i );
//
//            // Determine the bounds of the current segment.  Assumes that the
//            // bounds for the strand1 and strand2 segments are the same, which
//            // should be a safe assumption.
//            Rectangle2D bounds = strand1Segment.getShape().getBounds2D();
//            IntegerRange pointIndexRange = new IntegerRange( (int) Math.floor( ( bounds.getMinX() - leftEdgeXOffset ) / DISTANCE_BETWEEN_BASE_PAIRS ),
//                                                             (int) Math.floor( ( bounds.getMaxX() - leftEdgeXOffset ) / DISTANCE_BETWEEN_BASE_PAIRS ) );
//
//            // Check to see if any of the points within the identified range
//            // have changed and, if so, update the corresponding segment shape
//            // in the strands.  If the points for either strand has changed,
//            // both are updated.
//            for ( int j = pointIndexRange.getMin(); j <= pointIndexRange.getMax(); j++ ) {
//                if ( !strandPoints.get( j ).equals( strandPointsShadow.get( j ) ) ) {
//                    // The point has changed.  Update it, mark the change.
//                    strandPoints.get( j ).set( strandPointsShadow.get( j ) );
//                    segmentChanged = true;
//                }
//            }
//
//            if ( segmentChanged ) {
//                // Update the shape of this segment.
//                List<Point2D> strand1ShapePoints = new ArrayList<Point2D>();
//                List<Point2D> strand2ShapePoints = new ArrayList<Point2D>();
//                for ( int j = pointIndexRange.getMin(); j <= pointIndexRange.getMax(); j++ ) {
//                    strand1ShapePoints.add( new Point2D.Double( strandPoints.get( j ).xPos, strandPoints.get( j ).strand1YPos ) );
//                    strand2ShapePoints.add( new Point2D.Double( strandPoints.get( j ).xPos, strandPoints.get( j ).strand2YPos ) );
//                }
//                strand1Segment.setShape( BioShapeUtils.createCurvyLineFromPoints( strand1ShapePoints ) );
//                strand2Segment.setShape( BioShapeUtils.createCurvyLineFromPoints( strand2ShapePoints ) );
//            }
//        }
//    }
//
//    public List<DnaStrandSegment> getStrand1Segments() {
//        return strand1Segments;
//    }
//
//    public List<DnaStrandSegment> getStrand2Segments() {
//        return strand2Segments;
//    }
//
//    public ArrayList<Gene> getGenes() {
//        return genes;
//    }
//
//    public Gene getLastGene() {
//        return genes.get( genes.size() - 1 );
//    }
//
//    public ArrayList<BasePair> getBasePairs() {
//        return basePairs;
//    }
//
//    public void activateHints( MobileBiomolecule biomolecule ) {
//        for ( Gene gene : genes ) {
//            gene.activateHints( biomolecule );
//        }
//    }
//
//    public void deactivateAllHints() {
//        for ( Gene gene : genes ) {
//            gene.deactivateHints();
//        }
//    }
//
//    /**
//     * Get the position in model space of the leftmost edge of the DNA strand.
//     * The Y position is in the vertical center of the strand.
//     */
//    public Point2D getLeftEdgePos() {
//        return new Point2D.Double( leftEdgeXOffset, Y_POS );
//    }
//
//    /**
//     * Consider an attachment proposal from a transcription factor instance.
//     * To determine whether or not to accept or reject this proposal, the base
//     * pairs are scanned in order to determine whether there is an appropriate
//     * and available attachment site within the attachment distance.
//     *
//     * @param transcriptionFactor
//     * @return
//     */
//    public AttachmentSite considerProposalFrom( final TranscriptionFactor transcriptionFactor ) {
//        return considerProposalFromBiomolecule( transcriptionFactor,
//                                                TRANSCRIPTION_FACTOR_ATTACHMENT_DISTANCE,
//                                                new Function1<Integer, AttachmentSite>() {
//                                                    public AttachmentSite apply( Integer basePairIndex ) {
//                                                        return getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex, transcriptionFactor.getConfig() );
//                                                    }
//                                                },
//                                                new Function1<Gene, Boolean>() {
//                                                    public Boolean apply( Gene gene ) {
//                                                        return true; // TFs can always attach if a spot is available.
//                                                    }
//                                                },
//                                                new Function1<Gene, AttachmentSite>() {
//                                                    public AttachmentSite apply( Gene gene ) {
//                                                        return gene.getMatchingSite( transcriptionFactor.getConfig() );
//                                                    }
//                                                }
//        );
//    }
//
//    /**
//     * Consider an attachment proposal from an instance of RNA polymerase.
//     *
//     * @param rnaPolymerase
//     * @return
//     */
//    public AttachmentSite considerProposalFrom( RnaPolymerase rnaPolymerase ) {
//        return considerProposalFromBiomolecule( rnaPolymerase,
//                                                RNA_POLYMERASE_ATTACHMENT_DISTANCE,
//                                                new Function1<Integer, AttachmentSite>() {
//                                                    public AttachmentSite apply( Integer basePairIndex ) {
//                                                        return getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex );
//                                                    }
//                                                },
//                                                new Function1<Gene, Boolean>() {
//                                                    public Boolean apply( Gene gene ) {
//                                                        return gene.transcriptionFactorsSupportTranscription();
//                                                    }
//                                                },
//                                                new Function1<Gene, AttachmentSite>() {
//                                                    public AttachmentSite apply( Gene gene ) {
//                                                        return gene.getPolymeraseAttachmentSite();
//                                                    }
//                                                }
//        );
//    }
//
//    /*
//     * Consider a proposal from a biomolecule.  This is the generic version
//     * that avoids duplicated code.
//     */
//    private AttachmentSite considerProposalFromBiomolecule( MobileBiomolecule biomolecule, double maxAttachDistance,
//                                                            Function1<Integer, AttachmentSite> getAttachSiteForBasePair,
//                                                            Function1<Gene, Boolean> isOkayToAttach,
//                                                            Function1<Gene, AttachmentSite> getAttachmentSite ) {
//
//        List<AttachmentSite> potentialAttachmentSites = new ArrayList<AttachmentSite>();
//        for ( int i = 0; i < basePairs.size(); i++ ) {
//            // See if the base pair is within the max attachment distance.
//            Vector2D attachmentSiteLocation = new Vector2D( basePairs.get( i ).getCenterLocation().getX(), Y_POS );
//            if ( attachmentSiteLocation.distance( biomolecule.getPosition() ) <= maxAttachDistance ) {
//                // In range.  Add it to the list if it is available.
//                AttachmentSite potentialAttachmentSite = getAttachSiteForBasePair.apply( i );
//                if ( potentialAttachmentSite.attachedOrAttachingMolecule.get() == null ) {
//                    potentialAttachmentSites.add( potentialAttachmentSite );
//                }
//            }
//        }
//
//        // If there aren't any potential attachment sites in range, check for
//        // a particular set of conditions under which the DNA provides an
//        // attachment site anyways.
//        if ( potentialAttachmentSites.size() == 0 && pursueAttachments ) {
//            for ( Gene gene : genes ) {
//                if ( isOkayToAttach.apply( gene ) ) {
//                    AttachmentSite matchingSite = getAttachmentSite.apply( gene );
//                    // Found a matching site on a gene.
//                    if ( matchingSite.attachedOrAttachingMolecule.get() == null ) {
//                        // The site is unoccupied, so add it to the list of
//                        // potential sites.
//                        potentialAttachmentSites.add( matchingSite );
//                    }
//                    else if ( !matchingSite.isMoleculeAttached() ) {
//                        double thisDistance = biomolecule.getPosition().distance( matchingSite.locationProperty.get() );
//                        double thatDistance = matchingSite.attachedOrAttachingMolecule.get().getPosition().distance( matchingSite.locationProperty.get() );
//                        if ( thisDistance < thatDistance ) {
//                            // The other molecule is not yet attached, and this
//                            // one is closer, so force the other molecule to
//                            // abort its pending attachment.
//                            matchingSite.attachedOrAttachingMolecule.get().forceAbortPendingAttachment();
//                            // Add this site to the list of potential sites.
//                            potentialAttachmentSites.add( matchingSite );
//                        }
//                    }
//                }
//            }
//        }
//
//        // Eliminate sites that would put the molecule out of bounds or
//        // would overlap with other attached biomolecules.
//        potentialAttachmentSites = eliminateInvalidAttachmentSites( biomolecule, potentialAttachmentSites );
//
//        if ( potentialAttachmentSites.size() == 0 ) {
//            // No acceptable sites found.
//            return null;
//        }
//
//        // Sort the collection so that the best site is at the top of the list.
//        Collections.sort( potentialAttachmentSites, new AttachmentSiteComparator<AttachmentSite>( biomolecule.getPosition() ) );
//
//        // Return the optimal attachment site.
//        return potentialAttachmentSites.get( 0 );
//    }
//
//    /**
//     * Take a list of attachment sites and eliminate any of them that, if the
//     * given molecule attaches, it would end up out of bounds or overlapping
//     * with another biomolecule that is already attached to the DNA strand.
//     *
//     * @param biomolecule              The biomolecule that is potentially going to
//     *                                 attach to the provided list of attachment sites.
//     * @param potentialAttachmentSites Attachment sites where the given
//     *                                 biomolecule could attach.
//     */
//    private List<AttachmentSite> eliminateInvalidAttachmentSites( final MobileBiomolecule biomolecule, final List<AttachmentSite> potentialAttachmentSites ) {
//        return FunctionalUtils.filter( potentialAttachmentSites, new Function1<AttachmentSite, Boolean>() {
//            public Boolean apply( AttachmentSite attachmentSite ) {
//                Vector2D translationVector = new Vector2D( biomolecule.getPosition(), attachmentSite.locationProperty.get() );
//                AffineTransform transform = AffineTransform.getTranslateInstance( translationVector.getX(), translationVector.getY() );
//                Shape translatedShape = transform.createTransformedShape( biomolecule.getShape() );
//                boolean inBounds = biomolecule.motionBoundsProperty.get().inBounds( translatedShape );
//                boolean overlapsOtherMolecules = false;
//                for ( MobileBiomolecule mobileBiomolecule : model.getOverlappingBiomolecules( translatedShape ) ) {
//                    if ( mobileBiomolecule.attachedToDna.get() && mobileBiomolecule != biomolecule ) {
//                        overlapsOtherMolecules = true;
//                        break;
//                    }
//                }
//                return inBounds && !overlapsOtherMolecules;
//            }
//        } );
//    }
//
//    private List<AttachmentSite> eliminateOverlappingAttachmentSitesNew( final MobileBiomolecule biomolecule, final List<AttachmentSite> potentialAttachmentSites ) {
//        return FunctionalUtils.filter( potentialAttachmentSites, new Function1<AttachmentSite, Boolean>() {
//            public Boolean apply( AttachmentSite attachmentSite ) {
//                Vector2D translationVector = new Vector2D( biomolecule.getPosition(), attachmentSite.locationProperty.get() );
//                AffineTransform transform = AffineTransform.getTranslateInstance( translationVector.getX(), translationVector.getY() );
//                Shape translatedShape = transform.createTransformedShape( biomolecule.getShape() );
//                return biomolecule.motionBoundsProperty.get().inBounds( translatedShape );
//            }
//        } );
//    }
//
//
//    private AttachmentSite getTranscriptionFactorAttachmentSiteForBasePairIndex( int i, TranscriptionFactorConfig tfConfig ) {
//        // See if this base pair is inside a gene.
//        Gene gene = getGeneContainingBasePair( i );
//        if ( gene != null ) {
//            // Base pair is in a gene, so get it from the gene.
//            return gene.getTranscriptionFactorAttachmentSite( i, tfConfig );
//        }
//        else {
//            // Base pair is not contained within a gene, so use the default.
//            return createDefaultAffinityAttachmentSite( i );
//        }
//    }
//
//    private AttachmentSite getRnaPolymeraseAttachmentSiteForBasePairIndex( int i ) {
//        // See if this base pair is inside a gene.
//        Gene gene = getGeneContainingBasePair( i );
//        if ( gene != null ) {
//            // Base pair is in a gene.  See if site is available.
//            return gene.getPolymeraseAttachmentSite( i );
//        }
//        else {
//            // Base pair is not contained within a gene, so use the default.
//            return createDefaultAffinityAttachmentSite( i );
//        }
//    }
//
//    /**
//     * Get the two base pair attachment sites that are next to the provided
//     * one, i.e. the one before it on the DNA strand and the one after it.  If
//     * at one end of the strand, only one site will be returned.  Occupied
//     * sites are not returned.
//     *
//     * @param attachmentSite
//     * @return
//     */
//    public List<AttachmentSite> getAdjacentAttachmentSites( TranscriptionFactor transcriptionFactor, AttachmentSite attachmentSite ) {
//        int basePairIndex = getBasePairIndexFromXOffset( attachmentSite.locationProperty.get().getX() );
//        List<AttachmentSite> attachmentSites = new ArrayList<AttachmentSite>();
//        if ( basePairIndex != 0 ) {
//            AttachmentSite potentialSite = getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex - 1, transcriptionFactor.getConfig() );
//            if ( potentialSite.attachedOrAttachingMolecule.get() == null ) {
//                attachmentSites.add( potentialSite );
//            }
//        }
//        if ( basePairIndex != basePairs.size() - 1 ) {
//            AttachmentSite potentialSite = getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex + 1, transcriptionFactor.getConfig() );
//            if ( potentialSite.attachedOrAttachingMolecule.get() == null ) {
//                attachmentSites.add( potentialSite );
//            }
//        }
//
//        return eliminateInvalidAttachmentSites( transcriptionFactor, attachmentSites );
//    }
//
//    /**
//     * Get the two base pair attachment sites that are next to the provided
//     * one, i.e. the one before it on the DNA strand and the one after it.  If
//     * at one end of the strand, only one site will be returned.  Occupied
//     * sites are not returned.
//     *
//     * @param attachmentSite
//     * @return
//     */
//    public List<AttachmentSite> getAdjacentAttachmentSites( RnaPolymerase rnaPolymerase, AttachmentSite attachmentSite ) {
//        int basePairIndex = getBasePairIndexFromXOffset( attachmentSite.locationProperty.get().getX() );
//        List<AttachmentSite> attachmentSites = new ArrayList<AttachmentSite>();
//        if ( basePairIndex != 0 ) {
//            AttachmentSite potentialSite = getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex - 1 );
//            if ( potentialSite.attachedOrAttachingMolecule.get() == null ) {
//                attachmentSites.add( potentialSite );
//            }
//        }
//        if ( basePairIndex != basePairs.size() - 1 ) {
//            AttachmentSite potentialSite = getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex + 1 );
//            if ( potentialSite.attachedOrAttachingMolecule.get() == null ) {
//                attachmentSites.add( potentialSite );
//            }
//        }
//
//        // Eliminate sites that would put the molecule out of bounds or
//        // would overlap with other attached biomolecules.
//        return eliminateInvalidAttachmentSites( rnaPolymerase, attachmentSites );
//    }
//
//    private Gene getGeneContainingBasePair( int basePairIndex ) {
//        Gene geneContainingBasePair = null;
//        for ( Gene gene : genes ) {
//            if ( gene.containsBasePair( basePairIndex ) ) {
//                geneContainingBasePair = gene;
//                break;
//            }
//        }
//        return geneContainingBasePair;
//    }
//
//    /**
//     * Create an attachment site instance with the default affinity for all
//     * DNA-attaching biomolecules at the specified x offset.
//     *
//     * @param xOffset
//     * @return
//     */
//    public AttachmentSite createDefaultAffinityAttachmentSite( double xOffset ) {
//        return new AttachmentSite( new Vector2D( getNearestBasePairXOffset( xOffset ), Y_POS ), DEFAULT_AFFINITY );
//    }
//
//    public AttachmentSite createDefaultAffinityAttachmentSite( int basePairIndex ) {
//        return new AttachmentSite( new Vector2D( getBasePairXOffsetByIndex( basePairIndex ), Y_POS ), DEFAULT_AFFINITY );
//    }
//
//    /**
//     * Get a reference to the gene that contains the given location.
//     *
//     * @param location
//     * @return Gene at the location, null if no gene exists.
//     */
//    public Gene getGeneAtLocation( Vector2D location ) {
//        if ( !( location.getX() >= leftEdgeXOffset && location.getX() <= leftEdgeXOffset + moleculeLength &&
//                location.getY() >= Y_POS - DIAMETER / 2 && location.getY() <= Y_POS + DIAMETER / 2 ) ) {
//            System.out.println( getClass().getName() + " - Warning: Location for gene test is not on DNA molecule." );
//            return null;
//        }
//        Gene geneAtLocation = null;
//        int basePairIndex = getBasePairIndexFromXOffset( location.getX() );
//        for ( Gene gene : genes ) {
//            if ( gene.containsBasePair( basePairIndex ) ) {
//                // Found the corresponding gene.
//                geneAtLocation = gene;
//                break;
//            }
//        }
//        return geneAtLocation;
//    }
//
//    public void reset() {
//        for ( Gene gene : genes ) {
//            gene.clearAttachmentSites();
//        }
//        separations.clear();
//    }
//
//    //-------------------------------------------------------------------------
//    // Inner Classes and Interfaces
//    //-------------------------------------------------------------------------
//
//    /**
//     * This class defines a segment of the DNA strand.  It is needed because the
//     * DNA molecule needs to look like it is 3D, but we are only modeling it as
//     * 2D, so in order to create the appearance of a twist between the two
//     * strands, we need to track which segments are in front and which are in
//     * back.
//     */
//    public static class DnaStrandSegment extends ShapeChangingModelElement {
//        public final boolean inFront;
//
//        public DnaStrandSegment( Shape shape, boolean inFront ) {
//            super( shape );
//            this.inFront = inFront;
//        }
//
//        public void setShape( Shape newShape ) {
//            shapeProperty.set( newShape );
//        }
//    }
//
//    /**
//     * Class with one x position and two y positions, used for defining the
//     * two strands that comprise the backbone of one DNA molecule.
//     */
//    protected class DnaStrandPoint {
//        public double xPos = 0;
//        public double strand1YPos = 0;
//        public double strand2YPos = 0;
//
//        public DnaStrandPoint( double xPos, double strand1YPos, double strand2YPos ) {
//            this.xPos = xPos;
//            this.strand1YPos = strand1YPos;
//            this.strand2YPos = strand2YPos;
//        }
//
//        public DnaStrandPoint( DnaStrandPoint strandPoint ) {
//            xPos = strandPoint.xPos;
//            strand1YPos = strandPoint.strand1YPos;
//            strand2YPos = strandPoint.strand2YPos;
//        }
//
//        public void set( DnaStrandPoint dnaStrandPoint ) {
//            this.xPos = dnaStrandPoint.xPos;
//            this.strand1YPos = dnaStrandPoint.strand1YPos;
//            this.strand2YPos = dnaStrandPoint.strand2YPos;
//        }
//
//        @Override
//        public boolean equals( Object o ) {
//            if ( this == o ) { return true; }
//            if ( o == null || getClass() != o.getClass() ) { return false; }
//
//            DnaStrandPoint that = (DnaStrandPoint) o;
//
//            if ( Double.compare( that.strand1YPos, strand1YPos ) != 0 ) {
//                return false;
//            }
//            if ( Double.compare( that.strand2YPos, strand2YPos ) != 0 ) {
//                return false;
//            }
//            return Double.compare( that.xPos, xPos ) == 0;
//        }
//    }
//
//    // Comparator class to use when comparing two attachment sites.
//    private static class AttachmentSiteComparator<T extends AttachmentSite> implements Comparator<T> {
//        private final Vector2D attachLocation;
//
//        private AttachmentSiteComparator( Vector2D attachLocation ) {
//            this.attachLocation = attachLocation;
//        }
//
//        // Compare the two attachment sites.  The comparison is based on a
//        // combination of the affinity and the distance.
//        public int compare( T attachmentSite1, T attachmentSite2 ) {
//            // The comparison is based on a combination of the affinity and the
//            // distance, much like gravitational attraction.  The exponent
//            // effectively sets the relative weighting of one versus another.
//            // An exponent value of zero means only the affinity matters, a
//            // value of 100 means it is pretty much entirely distance.  A value
//            // of 2 is how gravity works, so it appears kind of natural.  Tweak
//            // as needed.
//            double exponent = 1;
//            double as1Factor = attachmentSite1.getAffinity() / Math.pow( attachLocation.distance( attachmentSite1.locationProperty.get() ), exponent );
//            double as2Factor = attachmentSite2.getAffinity() / Math.pow( attachLocation.distance( attachmentSite2.locationProperty.get() ), exponent );
//            return Double.compare( as2Factor, as1Factor );
//        }
//    }
//}
