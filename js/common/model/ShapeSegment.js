// Copyright 2015, University of Colorado Boulder

/**
 * This class defines a shape that encloses a segment of the mRNA. These segments, connected together, are used to
 * define the outline shape of the mRNA strand. The path of the strand within these shape segments is worked out
 * elsewhere.
 *
 * Shape segments keep track of the length of mRNA that they contain, but the don't explicitly contain references to the
 * points that define the shape.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  //modules
  var AttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/AttachmentSite' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var FLOATING_POINT_COMP_FACTOR = 1E-7; // Factor to use to avoid issues with floating point resolution.

  /**
   * @param {Object} owner - the model object that this shape segment is a portion of
   * @constructor
   */
  function ShapeSegment( owner ) {

    // Bounds of this shape segment.
    this.boundsProperty = new Property( new Bounds2( 0, 0, 0, 0 ) ); // @private

    // Attachment point where anything that attached to this segment would attach. Affinity is arbitrary in this case.
    this.attachmentSite = new AttachmentSite( owner, new Vector2( 0, 0 ), 1 ); // @private

    // Max length of mRNA that this segment can contain.
    this.capacity = Number.MAX_VALUE; // @protected
  }

  geneExpressionEssentials.register( 'ShapeSegment', ShapeSegment );

  return inherit( Object, ShapeSegment, {

    /**
     * Set the bounds
     * @param {Bounds2} bounds
     * @public
     */
    set bounds( bounds ) {
      this.boundsProperty.set( bounds );
    },

    /**
     * Return the bounds
     * @returns {Bounds2}
     * @public
     */
    get bounds() {
      return this.boundsProperty.get();
    },

    /**
     * Sets the capacity
     * @param {number} capacity
     * @public
     */
    setCapacity: function( capacity ) {
      this.capacity = capacity;
    },

    /**
     * Returns the remaining capacity
     * @returns {number}
     * @public
     */
    getRemainingCapacity: function() {
      return this.capacity - this.getContainedLength();
    },

    /**
     * Returns the lower right position of the segment
     * @returns {Vector2}
     * @public
     */
    getLowerRightCornerPos: function() {
      return new Vector2( this.bounds.getMaxX(), this.bounds.getMinY() );
    },

    /**
     * Sets the lower right position of the segment
     * @param {Vector2} newLowerRightCornerPos
     * @public
     */
    setLowerRightCornerPos: function( newLowerRightCornerPos ) {
      var currentLowerRightCornerPos = this.getLowerRightCornerPos();
      var delta = newLowerRightCornerPos.minus( currentLowerRightCornerPos );
      var newBounds = this.bounds.transformed( Matrix3.translation( delta.x, delta.y ) );
      this.bounds.set( newBounds );
      this.updateAttachmentSiteLocation();
    },

    /**
     * Returns the upper left position of the segment
     * @returns {Vector2}
     * @public
     */
    getUpperLeftCornerPos: function() {
      return new Vector2( this.bounds.getMinX(), this.bounds.getMaxY() );
    },

    /**
     * Sets the upper left position of the segment
     * @param {Vector2} upperLeftCornerPosition
     * @public
     */
    setUpperLeftCornerPosition: function( upperLeftCornerPosition ) {
      this.bounds.set( Bounds2.rect( upperLeftCornerPosition.x,
        upperLeftCornerPosition.y - this.bounds.getHeight(),
        this.bounds.getWidth(),
        this.bounds.getHeight() ) );
      this.updateAttachmentSiteLocation();
    },

    /**
     * Translates the segment
     * @param {number} x
     * @param {number} y
     * @public
     */
    translate: function( x, y ) {
      this.bounds.set( this.bounds.shifted( x, y ) );
      this.updateAttachmentSiteLocation();
    },

    /**
     * Returns the bounds
     * @returns {Bounds2}
     * @public
     */
    getBounds: function() {
      return this.bounds;
    },

    /**
     * Returns wether the shape segment is flat or not. Shape segment is flat if the height is zero
     * @returns {boolean}
     * @public
     */
    isFlat: function() {
      return this.getBounds().height === 0;
    },

    /**
     * Updates the Attachment Site Location which is the upper left corner of the segment
     * @public
     */
    updateAttachmentSiteLocation: function() {
      this.attachmentSite.locationProperty.set( this.getUpperLeftCornerPos() );
    },

    /**
     * Get the length of the mRNA contained by this segment.
     * @returns {number}
     * @public
     */
    getContainedLength: function() {
      throw new Error( 'getContainedLength should be implemented in descendant classes of ShapeSegment' );
    },

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
    add: function( length, windingBiomolecule, shapeSegmentList ) {
      throw new Error( 'add should be implemented in descendant classes of ShapeSegment' );
    },

    /**
     * Remove the specified amount of mRNA from the segment. This will generally cause a segment to shrink. Flat segments
     * shrink in from the right, square segments shrink from the lower right corner towards the upper left. The shape
     * segment list is also a parameter so that shape segments can be removed if necessary.
     *
     * @param {number} length
     * @param {Array.<ShapeSegment>} shapeSegmentList
     * @public
     */
    remove: function( length, shapeSegmentList ) {
      throw new Error( 'remove should be implemented in descendant classes of ShapeSegment' );
    },

    /**
     * Advance the mRNA through this shape segment. This is what happens when the mRNA is being translated by a ribosome
     * into a protein. The list of shape segments is also a parameter in case segments need to be added or removed.
     *
     * @param {number} length
     * @param {WindingBiomolecule} windingBiomolecule
     * @param {Array.<ShapeSegment>} shapeSegmentList
     * @public
     */
    advance: function( length, windingBiomolecule, shapeSegmentList ) {
      throw new Error( 'advance should be implemented in descendant classes of ShapeSegment' );
    },


    /**
     * Advance the mRNA through this segment but also reduce the segment contents by the given length. This is used when
     * the mRNA is being destroyed.
     *
     * @param {number} length
     * @param {WindingBiomolecule} windingBiomolecule
     * @param {Array.<ShapeSegment>} shapeSegmentList
     * @public
     */
    advanceAndRemove: function( length, windingBiomolecule, shapeSegmentList ) {
      throw new Error( 'advance should be implemented in descendant classes of ShapeSegment' );
    }
  }, {
    FLOATING_POINT_COMP_FACTOR: FLOATING_POINT_COMP_FACTOR
  } );
} );