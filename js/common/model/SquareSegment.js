// Copyright 2015-2020, University of Colorado Boulder

/**
 * Class that defines a square segment, which is one in which the mRNA can be (and generally is) curled up.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


//modules
import Bounds2 from '../../../../dot/js/Bounds2.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import ShapeSegment from './ShapeSegment.js';

class SquareSegment extends ShapeSegment {

  /**
   * @param {Object} owner
   * @param {Vector2} origin
   */
  constructor( owner, origin ) {

    super( owner );

    // Maintain an explicit value for the length of the mRNA contained within this segment even though the bounds
    // essentially define said length.  This helps to avoid floating point issues.
    this.containedLength = 0; // @private

    this.bounds.set( Bounds2.rect( origin.x, origin.y, 0, 0 ) );
    this.updateAttachmentSitePosition();
  }

  /**
   * @override
   * @returns {number}
   * @public
   */
  getContainedLength() {
    return this.containedLength;
  }

  /**
   * @override
   * @param {number} length
   * @param {WindingBiomolecule} windingBiomolecule
   * @param {Array.<ShapeSegment>} shapeSegmentList
   * @public
   */
  add( length, windingBiomolecule, shapeSegmentList ) {
    this.containedLength += length;

    // Grow the bounds up and to the left to accommodate the additional length.
    const sideGrowthAmount = this.calculateSideLength() - this.bounds.getWidth();
    assert && assert( length >= 0 && sideGrowthAmount >= 0 ); //
    this.bounds.set( Bounds2.rect( this.bounds.x - sideGrowthAmount,
      this.bounds.y,
      this.bounds.getWidth() + sideGrowthAmount,
      this.bounds.getHeight() + sideGrowthAmount ) );
    this.updateAttachmentSitePosition();
  }

  /**
   * @override
   * @param {number} length
   * @param {Array.<ShapeSegment>} shapeSegmentList
   * @public
   */
  remove( length, shapeSegmentList ) {
    this.containedLength -= length;

    // Shrink by moving the lower right corner up and to the left.
    const sideShrinkageAmount = this.bounds.getWidth() - this.calculateSideLength();

    this.bounds.set( Bounds2.rect( this.bounds.x,
      this.bounds.y + sideShrinkageAmount,
      this.bounds.getWidth() - sideShrinkageAmount,
      this.bounds.getHeight() - sideShrinkageAmount ) );

    // If the length has gotten to zero, remove this segment from the list.
    if ( this.getContainedLength() <= ShapeSegment.FLOATING_POINT_COMP_FACTOR ) {
      const index = shapeSegmentList.indexOf( this );
      shapeSegmentList.splice( index, 1 );
    }
    this.updateAttachmentSitePosition();
  }

  /**
   * @override
   * @param {number} length
   * @param {WindingBiomolecule} windingBiomolecule
   * @param {Array.<ShapeSegment>} shapeSegmentList
   * @public
   */
  advance( length, windingBiomolecule, shapeSegmentList ) {

    // This should never be called for square shape segments, since translation should only occur based around flat
    // segments.
    assert && assert( false,
      'This should never be called for square shape segments, since translation should only occur based around flat segments.' );

  }

  /**
   * @override
   * @param {number} length
   * @param {WindingBiomolecule} windingBiomolecule
   * @param {Array.<ShapeSegment>} shapeSegmentList
   * @public
   */
  advanceAndRemove( length, windingBiomolecule, shapeSegmentList ) {
    assert && assert( false, 'Unimplemented method called on square shape segment' );
  }

  /**
   * Determine the length of a side as a function of the contained length of mRNA.
   * @returns {number}
   * @private
   */
  calculateSideLength() {
    const desiredDiagonalLength = Math.pow( this.containedLength, 0.7 ); // Power value was empirically determined.
    return Math.sqrt( 2 * desiredDiagonalLength * desiredDiagonalLength );
  }
}

geneExpressionEssentials.register( 'SquareSegment', SquareSegment );

export default SquareSegment;