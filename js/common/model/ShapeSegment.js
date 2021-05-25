// Copyright 2015-2021, University of Colorado Boulder

/**
 * This type defines a rectangular shape that encloses a segment of the mRNA. These segments, connected together, are
 * used to define the outer bounds of the mRNA strand. The path of the strand within these shape segments is worked out
 * elsewhere.
 *
 * Shape segments keep track of the length of mRNA that they contain, but they don't explicitly contain references to
 * the points that define the shape.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import AttachmentSite from './AttachmentSite.js';

// constants
const FLOATING_POINT_COMP_FACTOR = 1E-7; // Factor to use to avoid issues with floating point resolution.

class ShapeSegment {

  /**
   * @param {Object} owner - the model object that this shape segment is a portion of
   */
  constructor( owner ) {

    // @public (read-only) {Bounds2} - Bounds of this shape segment
    this.bounds = new Bounds2( 0, 0, 0, 0 );

    // Attachment point where anything that attached to this segment would attach. Affinity is arbitrary in this case.
    this.attachmentSite = new AttachmentSite( owner, new Vector2( 0, 0 ), 1 ); // @private

    // Max length of mRNA that this segment can contain.
    this.capacity = Number.MAX_VALUE; // @protected
  }

  /**
   * Sets the capacity
   * @param {number} capacity
   * @public
   */
  setCapacity( capacity ) {
    this.capacity = capacity;
  }

  /**
   * Returns the remaining capacity
   * @returns {number}
   * @public
   */
  getRemainingCapacity() {
    return this.capacity - this.getContainedLength();
  }

  /**
   * Returns the lower right position of the segment
   * @returns {Vector2}
   * @public
   */
  getLowerRightCornerPosition() {
    return new Vector2( this.bounds.getMaxX(), this.bounds.getMinY() );
  }

  /**
   * Sets the lower right position of the segment
   * @param {number} x
   * @param {number} y
   * @public
   */
  setLowerRightCornerPositionXY( x, y ) {
    this.bounds.setMinMax( x - this.bounds.width, y, x, y + this.bounds.height );
    this.updateAttachmentSitePosition();
  }

  /**
   * @param {Vector2} p
   * @public
   */
  setLowerRightCornerPosition( p ) {
    this.setLowerRightCornerPositionXY( p.x, p.y );
  }

  /**
   * Returns the upper left position of the segment
   * @returns {Vector2}
   * @public
   */
  getUpperLeftCornerPosition() {
    return new Vector2( this.bounds.getMinX(), this.bounds.getMaxY() );
  }

  /**
   * Sets the upper left position of the segment
   * @param {number} x
   * @param {number} y
   * @public
   */
  setUpperLeftCornerPositionXY( x, y ) {
    this.bounds.setMinMax( x, y - this.bounds.height, x + this.bounds.width, y );
    this.updateAttachmentSitePosition();
  }

  /**
   * Translates the segment
   * @param {number} x
   * @param {number} y
   * @public
   */
  translate( x, y ) {
    this.bounds.shiftXY( x, y );
    this.updateAttachmentSitePosition();
  }

  /**
   * Returns the bounds
   * @returns {Bounds2}
   * @public
   */
  getBounds() {
    return this.bounds;
  }

  /**
   * Returns whether the shape segment is flat or not. A shape segment is flat if the height is zero.
   * @returns {boolean}
   * @public
   */
  isFlat() {
    return this.getBounds().height === 0;
  }

  /**
   * Updates the Attachment Site Position which is the upper left corner of the segment
   * @public
   */
  updateAttachmentSitePosition() {
    this.attachmentSite.positionProperty.set( this.getUpperLeftCornerPosition() );
  }

  /**
   * Get the length of the mRNA contained by this segment.
   * @returns {number}
   * @public
   */
  getContainedLength() {
    throw new Error( 'getContainedLength should be implemented in descendant classes of ShapeSegment' );
  }

  /**
   * Add the specified length of mRNA to the segment. This will generally cause the segment to grow. By design, flat
   * segments grow to the left, square segments grow up and left. The shape segment list is also passed in so that new
   * segments can be added if needed.
   *
   * @param {number} length
   * @param {WindingBiomolecule} windingBiomolecule
   * @param {Array.<ShapeSegment>} shapeSegmentList
   * @public
   */
  add( length, windingBiomolecule, shapeSegmentList ) {
    throw new Error( 'add should be implemented in descendant classes of ShapeSegment' );
  }

  /**
   * Remove the specified amount of mRNA from the segment. This will generally cause a segment to shrink. Flat segments
   * shrink in from the right, square segments shrink from the lower right corner towards the upper left. The shape
   * segment list is also a parameter so that shape segments can be removed if necessary.
   *
   * @param {number} length
   * @param {Array.<ShapeSegment>} shapeSegmentList
   * @public
   */
  remove( length, shapeSegmentList ) {
    throw new Error( 'remove should be implemented in descendant classes of ShapeSegment' );
  }

  /**
   * Advance the mRNA through this shape segment. This is what happens when the mRNA is being translated by a ribosome
   * into a protein. The list of shape segments is also a parameter in case segments need to be added or removed.
   *
   * @param {number} length
   * @param {WindingBiomolecule} windingBiomolecule
   * @param {Array.<ShapeSegment>} shapeSegmentList
   * @public
   */
  advance( length, windingBiomolecule, shapeSegmentList ) {
    throw new Error( 'advance should be implemented in descendant classes of ShapeSegment' );
  }

  /**
   * Advance the mRNA through this segment but also reduce the segment contents by the given length. This is used when
   * the mRNA is being destroyed.
   *
   * @param {number} length
   * @param {WindingBiomolecule} windingBiomolecule
   * @param {Array.<ShapeSegment>} shapeSegmentList
   * @public
   */
  advanceAndRemove( length, windingBiomolecule, shapeSegmentList ) {
    throw new Error( 'advance should be implemented in descendant classes of ShapeSegment' );
  }

}

ShapeSegment.FLOATING_POINT_COMP_FACTOR = FLOATING_POINT_COMP_FACTOR;

geneExpressionEssentials.register( 'ShapeSegment', ShapeSegment );

export default ShapeSegment;
