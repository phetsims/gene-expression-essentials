// Copyright 2015-2021, University of Colorado Boulder

/**
 * This class models a molecule of DNA. It includes the shape of the two "backbone" strands of the DNA and the
 * individual base pairs, defines where the various genes reside, and retains other information about the DNA molecule.
 * This is an important and central object in the model for this simulation.
 *
 * A big simplifying assumption that this class makes is that molecules that attach to the DNA do so to individual base
 * pairs. In reality, biomolecules attach to groups of base pairs, the exact configuration of which dictate where
 * biomolecules attach. This was unnecessarily complicated for the needs of this sim.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GEEConstants from '../GEEConstants.js';
import AttachmentSite from './AttachmentSite.js';
import BasePair from './BasePair.js';
import DnaStrandPoint from './DnaStrandPoint.js';
import StubGeneExpressionModel from './StubGeneExpressionModel.js';

// constants

// distance within which transcription factors may attach
const TRANSCRIPTION_FACTOR_ATTACHMENT_DISTANCE = 400;

// distance within which RNA polymerase may attach
const RNA_POLYMERASE_ATTACHMENT_DISTANCE = 400;

const attachmentSitePosition = new Vector2( 0, 0 );

class DnaMolecule {

  /**
   * @param {GeneExpressionModel|null} model - the gene expression model within which this DNA strand exists, null for
   * a standalone instance
   * @param {number} numBasePairs - number of base pairs in the strand
   * @param {number} leftEdgeXOffset - x position in model space of the left side of the molecule. Y position is assumed
   * to be zero
   * @param {boolean} pursueAttachments - flag that controls whether the DNA strand actively pulls in transcription
   * factors and polymerase or just lets them drift into place
   */
  constructor( model, numBasePairs, leftEdgeXOffset, pursueAttachments ) {

    // @public (read-only) {Array.<Array.<Vector2>>} These arrays contain lists of "segments" that define the shape of
    // the DNA strand.  Each segment is comprised of a set of points that, when smoothly connected, define one half of
    // a "cycle" of the DNA.  The motivation behind having the separate segments is to make it easier to render the
    // DNA as appearing to twist.  These segments change position when the DNA strands separates, which occurs when the
    // DNA is transcribed by RNA polymerase.
    this.strand1Segments = []; // @public
    this.strand2Segments = []; // @public

    // @public (read-only) {Array.<BasePair>} - base pairs within the DNA strand
    this.basePairs = [];

    // @public (read-only) {number} - height of the tallest base pair, set during initialization below
    this.maxBasePairHeight = 0;

    // @public {boolean} - dirty bit which tells the view when to redraw DNA
    this.redraw = false;

    // @private {Array.<DnaStrandPoint>} - points that, when connected, define the shape of the DNA strands - these
    // used for internal manipulations, and their positions are copied into the layered, separated "strand segements"
    // as changes occur.
    this.strandPoints = [];

    // @private - shadow of the points that define the strand shapes, used for rapid evaluation of any shape changes
    this.strandPointsShadow = [];

    // @private - internal variable that define shape, size, and behavior
    this.model = model || new StubGeneExpressionModel(); // support creation without model for control panels and such
    this.leftEdgeXOffset = leftEdgeXOffset;
    this.pursueAttachments = pursueAttachments;
    this.moleculeLength = numBasePairs * GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS;
    this.numberOfTwists = this.moleculeLength / GEEConstants.LENGTH_PER_TWIST;

    // @private {Array.<Gene>}
    this.genes = [];

    // @private - list of forced separations between the two strands of the DNA
    this.separations = [];

    // Add the initial set of shape-defining points for each of the two strands.  Points are spaced the same as the
    // base pairs.
    for ( let i = 0; i < numBasePairs; i++ ) {
      const xPos = leftEdgeXOffset + i * GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS;
      const strand1YPos = this.getDnaStrandYPosition( xPos, 0 );
      const strand2YPos = this.getDnaStrandYPosition( xPos, GEEConstants.INTER_STRAND_OFFSET );
      const height = Math.abs( strand1YPos - strand2YPos );
      this.maxBasePairHeight = height > this.maxBasePairHeight ? height : this.maxBasePairHeight;

      // Add in the base pairs between the backbone strands.  This calculates the distance between the two strands and
      // puts a line between them in  order to look like the base pair.
      this.basePairs.push( new BasePair(
        xPos,
        Math.min( strand1YPos, strand2YPos ),
        Math.max( strand1YPos, strand2YPos )
      ) );
      this.strandPoints.push( new DnaStrandPoint( xPos, strand1YPos, strand2YPos ) );
      this.strandPointsShadow.push( new DnaStrandPoint( xPos, strand1YPos, strand2YPos ) );
    }

    // Create the sets of segments that will be observed by the view.
    this.initializeStrandSegments();
  }

  /**
   * get the index of the nearest base pair given an X position in model space
   * @param {number} xOffset
   * @returns {number}
   * @private
   */
  getBasePairIndexFromXOffset( xOffset ) {
    assert && assert( xOffset >= this.leftEdgeXOffset && xOffset < this.leftEdgeXOffset + this.moleculeLength );
    xOffset = Utils.clamp(
      xOffset,
      this.leftEdgeXOffset,
      this.leftEdgeXOffset + GEEConstants.LENGTH_PER_TWIST * this.numberOfTwists
    );
    return Math.trunc( Utils.roundSymmetric( ( xOffset - this.leftEdgeXOffset - GEEConstants.INTER_STRAND_OFFSET ) /
                                             GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS ) );
  }

  /**
   * get the X position of the nearest base pair given an arbitrary X position in model coordinates
   * @param {number} xPos
   * @returns {number}
   * @private
   */
  getNearestBasePairXOffset( xPos ) {
    return this.getBasePairXOffsetByIndex( this.getBasePairIndexFromXOffset( xPos ) );
  }

  /**
   * initialize the DNA stand segment lists
   * @private
   */
  initializeStrandSegments() {
    let strand1SegmentPoints = [];
    let strand2SegmentPoints = [];
    let segmentStartX = this.strandPoints[ 0 ].xPos;
    let strand1InFront = true;
    for ( let i = 0; i < this.strandPoints.length; i++ ) {
      const dnaStrandPoint = this.strandPoints[ i ];
      const xPos = dnaStrandPoint.xPos;
      strand1SegmentPoints.push( new Vector2( xPos, dnaStrandPoint.strand1YPos ) );
      strand2SegmentPoints.push( new Vector2( xPos, dnaStrandPoint.strand2YPos ) );
      if ( xPos - segmentStartX >= ( GEEConstants.LENGTH_PER_TWIST / 2 ) ) {

        // Time to add these segments and start a new ones.
        this.strand1Segments.push( strand1SegmentPoints );
        this.strand2Segments.push( strand2SegmentPoints );
        let firstPointOfNextSegment = strand1SegmentPoints[ strand1SegmentPoints.length - 1 ];
        strand1SegmentPoints = []; // clear;
        strand1SegmentPoints.push( firstPointOfNextSegment ); // This point must be on this segment too in order to prevent gaps.
        firstPointOfNextSegment = strand2SegmentPoints[ strand2SegmentPoints.length - 1 ];
        strand2SegmentPoints = []; //clear;
        strand2SegmentPoints.push( firstPointOfNextSegment ); // This point must be on this segment too in order to prevent gaps.
        segmentStartX = firstPointOfNextSegment.x;
        strand1InFront = !strand1InFront;
      }
    }

    // add the strand for the remaining base segments
    this.strand1Segments.push( strand1SegmentPoints );
    this.strand2Segments.push( strand2SegmentPoints );

    this.redraw = true;
  }

  /**
   * Get the Y position in model space for a DNA strand for the given X position and offset. The offset acts like a
   * "phase difference", thus allowing this method to be used to get position information for both DNA strands.
   * @param {number} xPos
   * @param {number} offset
   * @returns {number}
   * @private
   */
  getDnaStrandYPosition( xPos, offset ) {
    return Math.sin( ( xPos + offset ) / GEEConstants.LENGTH_PER_TWIST * Math.PI * 2 ) * GEEConstants.DNA_MOLECULE_DIAMETER / 2;
  }

  /**
   * Update the strand segment shapes based on things that might have changed, such as biomolecules attaching and
   * separating the strands or otherwise deforming the nominal double-helix shape.
   * @private
   */
  updateStrandSegments() {
    this.redraw = false;

    // Set the shadow points to the nominal, non-deformed positions.
    this.strandPointsShadow.forEach( ( dnaStrandPoint, i ) => {
      dnaStrandPoint.strand1YPos = this.getDnaStrandYPosition( dnaStrandPoint.xPos, 0 );
      dnaStrandPoint.strand2YPos = this.getDnaStrandYPosition( dnaStrandPoint.xPos, GEEConstants.INTER_STRAND_OFFSET );
      this.basePairs[ i ].topYPosition = Math.min( dnaStrandPoint.strand1YPos, dnaStrandPoint.strand2YPos );
      this.basePairs[ i ].bottomYPosition = Math.max( dnaStrandPoint.strand1YPos, dnaStrandPoint.strand2YPos );
    } );

    // Move the shadow points to account for any separations.
    this.separations.forEach( separation => {

      // Make the window wider than it is high.  This was chosen to look decent, tweak if needed.
      const windowWidth = separation.getAmount() * 1.5;

      const separationWindowXIndexRange = new Range(
        Math.floor(
          ( separation.getXPosition() - ( windowWidth / 2 ) - this.leftEdgeXOffset ) / GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS
        ),
        Math.floor(
          ( separation.getXPosition() + ( windowWidth / 2 ) - this.leftEdgeXOffset ) / GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS
        )
      );
      for ( let i = separationWindowXIndexRange.min; i < separationWindowXIndexRange.max; i++ ) {
        const windowCenterX = ( separationWindowXIndexRange.min + separationWindowXIndexRange.max ) / 2;
        if ( i >= 0 && i < this.strandPointsShadow.length ) {

          // Perform a windowing algorithm that weights the separation at 1 in the center, 0 at the edges, and linear
          // graduations in between.
          const separationWeight = 1 - Math.abs( 2 * ( i - windowCenterX ) / separationWindowXIndexRange.getLength() );
          this.strandPointsShadow[ i ].strand1YPos = ( 1 - separationWeight ) * this.strandPointsShadow[ i ].strand1YPos +
                                                     separationWeight * separation.getAmount() / 2;
          this.strandPointsShadow[ i ].strand2YPos = ( 1 - separationWeight ) * this.strandPointsShadow[ i ].strand2YPos -
                                                     separationWeight * separation.getAmount() / 2;
          this.basePairs[ i ].topYPosition = Math.max(
            this.strandPointsShadow[ i ].strand1YPos, this.strandPointsShadow[ i ].strand2YPos
          );
          this.basePairs[ i ].bottomYPosition = Math.min(
            this.strandPointsShadow[ i ].strand1YPos, this.strandPointsShadow[ i ].strand2YPos
          );
        }
      }
    } );

    // See if any of the points have moved and, if so, update the corresponding shape segment.
    const numSegments = this.strand1Segments.length;
    for ( let i = 0; i < numSegments; i++ ) {
      let segmentChanged = false;
      const strand1Segment = this.strand1Segments[ i ];

      // Determine the bounds of the current segment. Assumes that the bounds for the strand1 and strand2 segments are
      // the same, which should be a safe assumption.
      const minX = strand1Segment[ 0 ].x;
      const maxX = strand1Segment[ strand1Segment.length - 1 ].x;
      const pointIndexRange = new Range( Math.floor( ( minX - this.leftEdgeXOffset ) / GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS ),
        Math.floor( ( maxX - this.leftEdgeXOffset ) / GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS ) );

      // Check to see if any of the points within the identified range have changed and, if so, update the
      // corresponding segment shape in the strands. If the points for either strand has changed, both are updated.
      for ( let j = pointIndexRange.min; j < pointIndexRange.max; j++ ) {
        if ( !this.strandPoints[ j ].equals( this.strandPointsShadow[ j ] ) ) {

          // The point has changed.  Update it, mark the change.
          this.strandPoints[ j ].set( this.strandPointsShadow[ j ] );
          segmentChanged = true;
        }
      }

      if ( !this.strandPoints[ pointIndexRange.max ].equals( this.strandPointsShadow[ pointIndexRange.max ] ) ) {
        // The point has changed.  Update it, mark the change.
        segmentChanged = true;
      }

      if ( segmentChanged ) {
        this.redraw = true;
        // Update the shape of this segment.
        const strand1ShapePoints = [];
        const strand2ShapePoints = [];
        for ( let k = pointIndexRange.min; k < pointIndexRange.max; k++ ) {

          //for performance reasons using object literals instead of Vector instances
          strand1ShapePoints.push( { x: this.strandPoints[ k ].xPos, y: this.strandPoints[ k ].strand1YPos } );
          strand2ShapePoints.push( { x: this.strandPoints[ k ].xPos, y: this.strandPoints[ k ].strand2YPos } );
        }
        strand1ShapePoints.push( {
          x: this.strandPointsShadow[ pointIndexRange.max ].xPos,
          y: this.strandPointsShadow[ pointIndexRange.max ].strand1YPos
        } );
        strand2ShapePoints.push( {
          x: this.strandPointsShadow[ pointIndexRange.max ].xPos,
          y: this.strandPointsShadow[ pointIndexRange.max ].strand2YPos
        } );
        this.strand1Segments[ i ] = strand1ShapePoints;
        this.strand2Segments[ i ] = strand2ShapePoints;
      }
    }
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.updateStrandSegments();
    this.genes.forEach( gene => {
      gene.updateAffinities();
    } );
  }

  /**
   * Returns the length of the DNA molecule
   * @returns {number}
   * @public
   */
  getLength() {
    return this.moleculeLength;
  }

  /**
   * Add a gene to the DNA strand. Adding a gene essentially defines it, since in this sim, the base pairs don't
   * actually encode anything, so adding the gene essentially delineates where it is on the strand.
   *
   * @param {Gene} geneToAdd Gene to add to the DNA strand.
   * @public
   */
  addGene( geneToAdd ) {
    this.genes.push( geneToAdd );
  }

  /**
   * Get the X position of the specified base pair. The first base pair at the left side of the DNA molecule is base
   * pair 0, and it goes up from there.
   *
   * @param {number} basePairNumber
   * @returns {number}
   * @public
   */
  getBasePairXOffsetByIndex( basePairNumber ) {
    return this.leftEdgeXOffset + GEEConstants.INTER_STRAND_OFFSET +
           basePairNumber * GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS;
  }

  /**
   * @param {DnaSeparation} separation
   * @public
   */
  addSeparation( separation ) {
    this.separations.push( separation );
  }

  /**
   * @param {DnaSeparation} separation
   * @public
   */
  removeSeparation( separation ) {
    const index = this.separations.indexOf( separation );
    if ( index !== -1 ) {
      this.separations.splice( index, 1 );
    }
  }

  /**
   * @returns {Array.<Gene>}
   * @public
   */
  getGenes() {
    return this.genes;
  }

  /**
   * @returns {Gene}
   * @public
   */
  getLastGene() {
    return this.genes[ this.genes.length - 1 ];
  }

  /**
   * @param {MobileBiomolecule} biomolecule
   * @public
   */
  activateHints( biomolecule ) {
    this.genes.forEach( gene => {
      gene.activateHints( biomolecule );
    } );
  }

  /**
   * Deactivate the hints for the genes
   * @public
   */
  deactivateAllHints() {
    this.genes.forEach( gene => {
      gene.deactivateHints();
    } );
  }

  /**
   * Get the position in model space of the leftmost edge of the DNA strand. The Y position is in the vertical center
   * of the strand.
   *
   * @returns {Vector2}
   * @public
   */
  getLeftEdgePosition() {
    return new Vector2( this.leftEdgeXOffset, GEEConstants.DNA_MOLECULE_Y_POS );
  }

  /**
   * Get the x-position in model space of the leftmost edge of the DNA strand.
   * @returns {number}
   * @public
   */
  getLeftEdgeXPosition() {
    return this.leftEdgeXOffset;
  }

  /**
   * Get the x-position in model space of the rightmost edge of the DNA strand.
   * @returns {number}
   * @public
   */
  getRightEdgeXPosition() {
    return this.strandPoints[ this.strandPoints.length - 1 ].xPos;
  }

  /**
   * Get the y-position in model space of the topmost point in the edge of the DNA strand.
   * @returns {number}
   * @public
   */
  getTopEdgeYPosition() {
    const dnaStrand = this.strand1Segments[ 0 ];
    const index = Math.floor( dnaStrand.length / 2 );
    return dnaStrand[ index ].y;
  }

  /**
   * Get the y-position in model space of the topmost point in the edge of the DNA strand.
   * @returns {number}
   * @public
   */
  getBottomEdgeYPosition() {
    // assert statement here
    const dnaStrand = this.strand1Segments[ 1 ];
    const index = Math.floor( dnaStrand.length / 2 );
    return dnaStrand[ index ].y;
  }

  /**
   * Consider an attachment proposal from a transcription factor instance. To determine whether or not to accept or
   * reject this proposal, the base pairs are scanned in order to determine whether there is an appropriate and
   * available attachment site within the attachment distance.
   *
   * @param {TranscriptionFactor} transcriptionFactor
   * @returns {AttachmentSite}
   * @public
   */
  considerProposalFromTranscriptionFactor( transcriptionFactor ) {
    return this.considerProposalFromBiomolecule(
      transcriptionFactor,
      TRANSCRIPTION_FACTOR_ATTACHMENT_DISTANCE,
      basePairIndex => this.getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex, transcriptionFactor.getConfig() ),
      gene => true,
      gene => gene.getMatchingSite( transcriptionFactor.getConfig() )
    );
  }

  /**
   * Consider an attachment proposal from a rna polymerase instance. To determine whether or not to accept or
   * reject this proposal, the base pairs are scanned in order to determine whether there is an appropriate and
   * available attachment site within the attachment distance
   *
   * @param {RnaPolymerase} rnaPolymerase
   * @returns {AttachmentSite}
   * @public
   */
  considerProposalFromRnaPolymerase( rnaPolymerase ) {
    return this.considerProposalFromBiomolecule( rnaPolymerase, RNA_POLYMERASE_ATTACHMENT_DISTANCE,
      basePairIndex => this.getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex ),
      gene => gene.transcriptionFactorsSupportTranscription(),
      gene => gene.getPolymeraseAttachmentSite()
    );
  }

  /**
   * Consider a proposal from a biomolecule. This is the generic version that avoids duplicated code.
   * @param {MobileBiomolecule} biomolecule
   * @param {number} maxAttachDistance
   * @param {function(number):AttachmentSite} getAttachSiteForBasePair
   * @param {function(Gene):boolean} isOkayToAttach
   * @param {function(Gene):AttachmentSite} getAttachmentSite
   * @returns {AttachmentSite}
   * @private
   */
  considerProposalFromBiomolecule( biomolecule, maxAttachDistance, getAttachSiteForBasePair, isOkayToAttach, getAttachmentSite ) {

    let potentialAttachmentSites = [];
    for ( let i = 0; i < this.basePairs.length; i++ ) {

      // See if the base pair is within the max attachment distance.
      attachmentSitePosition.setXY( this.basePairs[ i ].getCenterPositionX(), GEEConstants.DNA_MOLECULE_Y_POS );

      if ( attachmentSitePosition.distance( biomolecule.getPosition() ) <= maxAttachDistance ) {

        // In range.  Add it to the list if it is available.
        const potentialAttachmentSite = getAttachSiteForBasePair( i );
        if ( potentialAttachmentSite.attachedOrAttachingMoleculeProperty.get() === null ) {
          potentialAttachmentSites.push( potentialAttachmentSite );
        }
      }
    }

    // If there aren't any potential attachment sites in range, check for a particular set of conditions under which
    // the DNA provides an attachment site anyways.
    if ( potentialAttachmentSites.length === 0 && this.pursueAttachments ) {
      this.genes.forEach( gene => {
        if ( isOkayToAttach( gene ) ) {
          const matchingSite = getAttachmentSite( gene );

          // Found a matching site on a gene.
          if ( matchingSite.attachedOrAttachingMoleculeProperty.get() === null ) {

            // The site is unoccupied, so add it to the list of  potential sites.
            potentialAttachmentSites.push( matchingSite );
          }
          else if ( !matchingSite.isMoleculeAttached() ) {
            const thisDistance = biomolecule.getPosition().distance( matchingSite.positionProperty.get() );
            const thatDistance = matchingSite.attachedOrAttachingMoleculeProperty.get().getPosition().distance(
              matchingSite.positionProperty.get() );
            if ( thisDistance < thatDistance ) {

              // The other molecule is not yet attached, and this one is closer, so force the other molecule to
              // abort its pending attachment.
              matchingSite.attachedOrAttachingMoleculeProperty.get().forceAbortPendingAttachment();

              // Add this site to the list of potential sites.
              potentialAttachmentSites.push( matchingSite );
            }
          }
        }
      } );
    }

    // Eliminate sites that would put the molecule out of bounds or would overlap with other attached biomolecules.
    potentialAttachmentSites = this.eliminateInvalidAttachmentSites( biomolecule, potentialAttachmentSites );
    if ( potentialAttachmentSites.length === 0 ) {

      // No acceptable sites found.
      return null;
    }

    const exponent = 1;
    const attachPosition = biomolecule.getPosition();

    // Sort the collection so that the best site is at the top of the list.
    potentialAttachmentSites.sort( ( attachmentSite1, attachmentSite2 ) => {

      // The comparison is based on a combination of the affinity and the distance, much like gravitational attraction.
      // The exponent effectively sets the relative weighting of one versus another. An exponent value of zero means
      // only the affinity matters, a value of 100 means it is pretty much entirely distance. A value of 2 is how
      // gravity works, so it appears kind of natural. Tweak as needed.
      const as1Factor = attachmentSite1.getAffinity() /
                        Math.pow( attachPosition.distance( attachmentSite1.positionProperty.get() ), exponent );
      const as2Factor = attachmentSite2.getAffinity() /
                        Math.pow( attachPosition.distance( attachmentSite2.positionProperty.get() ), exponent );

      if ( as2Factor > as1Factor ) {
        return 1;
      }

      if ( as2Factor < as1Factor ) {
        return -1;
      }
      return 0;
    } );

    // Return the optimal attachment site.
    return potentialAttachmentSites[ 0 ];
  }

  /**
   * Take a list of attachment sites and eliminate any of them that, if the given molecule attaches, it would end up
   * out of bounds or overlapping with another biomolecule that is already attached to the DNA strand.
   *
   * @param  {MobileBiomolecule} biomolecule - The biomolecule that is potentially going to attach to the provided
   * list of attachment sites.
   * @param {Array.<AttachmentSite>} potentialAttachmentSites
   * @private
   */
  eliminateInvalidAttachmentSites( biomolecule, potentialAttachmentSites ) {
    return _.filter( potentialAttachmentSites, attachmentSite => {

      // determine the bounds for the provided biomolecule when translated to the attachment site
      let translationVector = attachmentSite.positionProperty.get().minus( biomolecule.getPosition() );
      const translatedShapeBounds = biomolecule.bounds.shiftedXY( translationVector.x, translationVector.y );

      // if the biomolecule would be out of the model bounds, the site should be excluded
      if ( !biomolecule.motionBoundsProperty.get().inBounds( translatedShapeBounds ) ) {
        return false;
      }

      // make a list of the bounds where all attached or incoming biomolecules are or will be (once attached)
      const attachedOrIncomingBiomoleculeBounds = [];
      this.model.mobileBiomoleculeList.forEach( mobileBiomolecule => {

        // skip the biomolecule being tested for overlap
        if ( mobileBiomolecule === biomolecule ) {
          return;
        }

        const attachmentSite = mobileBiomolecule.attachmentStateMachine.attachmentSite;

        if ( attachmentSite && attachmentSite.owner === this ) {
          if ( mobileBiomolecule.attachedToDnaProperty.get() ) {

            // this biomolecule is attached, so add its bounds with no translation
            attachedOrIncomingBiomoleculeBounds.push( mobileBiomolecule.bounds );
          }
          else {

            // This biomolecule is moving towards attachment but not yet attached, so translate to bounds to where
            // they will be once attachment occurs.
            translationVector = attachmentSite.positionProperty.get().minus( mobileBiomolecule.getPosition() );
            attachedOrIncomingBiomoleculeBounds.push(
              mobileBiomolecule.bounds.shiftedXY( translationVector.x, translationVector.y )
            );
          }
        }
      } );

      let overlapsOtherMolecules = false;
      for ( let i = 0; i < attachedOrIncomingBiomoleculeBounds.length; i++ ) {
        const mobileBiomoleculeBounds = attachedOrIncomingBiomoleculeBounds[ i ];
        if ( mobileBiomoleculeBounds.intersectsBounds( translatedShapeBounds ) ) {
          overlapsOtherMolecules = true;
          break;
        }
      }
      return !overlapsOtherMolecules;
    } );
  }

  /**
   * @param {number} i
   * @param {TranscriptionFactorConfig} tfConfig
   * @returns {AttachmentSite}
   * @private
   */
  getTranscriptionFactorAttachmentSiteForBasePairIndex( i, tfConfig ) {
    // See if this base pair is inside a gene.
    const gene = this.getGeneContainingBasePair( i );

    if ( gene !== null ) {
      // Base pair is in a gene, so get it from the gene.
      return gene.getTranscriptionFactorAttachmentSite( i, tfConfig );
    }
    else {
      // Base pair is not contained within a gene, so use the default.
      return this.createDefaultAffinityAttachmentSite( i );
    }
  }

  /**
   * @param {number} i
   * @returns {AttachmentSite}
   * @private
   */
  getRnaPolymeraseAttachmentSiteForBasePairIndex( i ) {
    // See if this base pair is inside a gene.
    const gene = this.getGeneContainingBasePair( i );
    if ( gene !== null ) {
      // Base pair is in a gene.  See if site is available.
      return gene.getPolymeraseAttachmentSiteByIndex( i );
    }
    else {
      // Base pair is not contained within a gene, so use the default.
      return this.createDefaultAffinityAttachmentSite( i );
    }
  }

  /**
   * Get the two base pair attachment sites that are next to the provided one, i.e. the one before it on the DNA
   * strand and the one after it. If at one end of the strand, only one site will be returned. Occupied sites are not
   * returned.
   *
   * @param {TranscriptionFactor} transcriptionFactor
   * @param {AttachmentSite} attachmentSite
   * @returns {Array.<AttachmentSite>}
   * @public
   */
  getAdjacentAttachmentSitesTranscriptionFactor( transcriptionFactor, attachmentSite ) {
    const basePairIndex = this.getBasePairIndexFromXOffset( attachmentSite.positionProperty.get().x );
    const attachmentSites = [];
    let potentialSite;
    if ( basePairIndex !== 0 ) {
      potentialSite = this.getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex - 1,
        transcriptionFactor.getConfig() );
      if ( potentialSite.attachedOrAttachingMoleculeProperty.get() === null ) {
        attachmentSites.push( potentialSite );
      }
    }
    if ( basePairIndex !== this.basePairs.length - 1 ) {
      potentialSite = this.getTranscriptionFactorAttachmentSiteForBasePairIndex( basePairIndex + 1,
        transcriptionFactor.getConfig() );
      if ( potentialSite.attachedOrAttachingMoleculeProperty.get() === null ) {
        attachmentSites.push( potentialSite );
      }
    }
    return this.eliminateInvalidAttachmentSites( transcriptionFactor, attachmentSites );
  }

  /**
   * Get the two base pair attachment sites that are next to the provided one, i.e. the one before it on the DNA
   * strand and the one after it. If at one end of the strand, only one site will be returned. Occupied sites are not
   * returned.
   *
   * @param {RnaPolymerase} rnaPolymerase
   * @param  {AttachmentSite} attachmentSite
   * @returns {Array.<AttachmentSite>}
   * @public
   */
  getAdjacentAttachmentSitesRnaPolymerase( rnaPolymerase, attachmentSite ) {
    const basePairIndex = this.getBasePairIndexFromXOffset( attachmentSite.positionProperty.get().x );
    const attachmentSites = [];
    let potentialSite;
    if ( basePairIndex !== 0 ) {
      potentialSite = this.getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex - 1 );
      if ( potentialSite.attachedOrAttachingMoleculeProperty.get() === null ) {
        attachmentSites.push( potentialSite );
      }
    }
    if ( basePairIndex !== this.basePairs.length - 1 ) {
      potentialSite = this.getRnaPolymeraseAttachmentSiteForBasePairIndex( basePairIndex + 1 );
      if ( potentialSite.attachedOrAttachingMoleculeProperty.get() === null ) {
        attachmentSites.push( potentialSite );
      }
    }

    // Eliminate sites that would put the molecule out of bounds or would overlap with other attached biomolecules.
    return this.eliminateInvalidAttachmentSites( rnaPolymerase, attachmentSites );
  }

  /**
   * @param {number} basePairIndex
   * @returns {Gene}
   * @private
   */
  getGeneContainingBasePair( basePairIndex ) {
    let geneContainingBasePair = null;
    for ( let i = 0; i < this.genes.length; i++ ) {
      const gene = this.genes[ i ];
      if ( gene.containsBasePair( basePairIndex ) ) {
        geneContainingBasePair = gene;
        break;
      }
    }
    return geneContainingBasePair;
  }

  /**
   * Create an attachment site instance with the default affinity for all DNA-attaching biomolecules at the specified
   * x offset.
   *
   * @param {number} xOffset
   * @returns {AttachmentSite}
   * @public
   */
  createDefaultAffinityAttachmentSite( xOffset ) {
    return new AttachmentSite(
      this,
      new Vector2( this.getNearestBasePairXOffset( xOffset ),
        GEEConstants.DNA_MOLECULE_Y_POS ),
      GEEConstants.DEFAULT_AFFINITY
    );
  }

  /**
   * Get a reference to the gene that contains the given position.
   *
   * @param {Vector2} position
   * @returns {Gene|null} Gene at the position, null if no gene exists.
   * @public
   */
  getGeneAtPosition( position ) {

    // make sure the position is reasonable
    assert && assert(
    position.x >= this.leftEdgeXOffset && position.x <= this.leftEdgeXOffset + this.moleculeLength &&
    position.y >= GEEConstants.DNA_MOLECULE_Y_POS - GEEConstants.DNA_MOLECULE_DIAMETER / 2 &&
    position.y <= GEEConstants.DNA_MOLECULE_Y_POS + GEEConstants.DNA_MOLECULE_DIAMETER / 2,
      `requested position is not on DNA molecule: ${position}`
    );

    let geneAtPosition = null;
    const basePairIndex = this.getBasePairIndexFromXOffset( position.x );
    for ( let i = 0; i < this.genes.length && geneAtPosition === null; i++ ) {
      const gene = this.genes[ i ];
      if ( gene.containsBasePair( basePairIndex ) ) {

        // Found the corresponding gene.
        geneAtPosition = gene;
      }
    }
    return geneAtPosition;
  }

  /**
   * Resets the DNA Molecule
   * @public
   */
  reset() {
    this.genes.forEach( gene => {
      gene.clearAttachmentSites();
    } );
    this.separations = [];
  }
}

geneExpressionEssentials.register( 'DnaMolecule', DnaMolecule );

export default DnaMolecule;
