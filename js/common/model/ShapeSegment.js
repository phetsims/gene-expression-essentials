// Copyright 2015, University of Colorado Boulder
/**
 * This class defines a shape that encloses a segment of the mRNA. These segments, connected together, are used to define
 * the outline shape of the mRNA strand. The path of the strand within these shape segments is worked out elsewhere.
 *
 * Shape segments keep track of the length of mRNA that they contain, but the don't explicitly contain references to the
 * points that define the shape.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Property = require( 'AXON/Property' );
  var AttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/AttachmentSite' );

  // constants
  // Factor to use to avoid issues with floating point resolution.
  var FLOATING_POINT_COMP_FACTOR = 1E-7;

  /**
   *
   * @constructor
   */
  function ShapeSegment() {

    // Bounds of this shape segment.
    this.boundsProperty = new Property( new Bounds2( 0, 0, 0, 0 ) );

    // Attachment point where anything that attached to this segment would attach. Affinity is arbitrary in this case.
    this.attachmentSite = new AttachmentSite( new Vector2(0,0), 1 );

    // Max length of mRNA that this segment can contain.
    this.capacity = Number.MAX_VALUE;
  }

  geneExpressionEssentials.register( 'ShapeSegment', ShapeSegment );

  return inherit( Object, ShapeSegment, {

    set bounds( value ) {
      this.boundsProperty.set( value );
    },

    get bounds() {
      return this.boundsProperty.get();
    },

    /**
     * @param {number} capacity
     */
    setCapacity: function( capacity ) {
      this.capacity = capacity;
    },

    /**
     * @returns {number}
     */
    getRemainingCapacity: function() {
      return this.capacity - this.getContainedLength();
    },

    /**
     * @returns {Vector2}
     */
    getLowerRightCornerPos: function() {
      return new Vector2( this.bounds.getMaxX(), this.bounds.getMinY() );
    },

    /**
     * @param {Vector2} newLowerRightCornerPos
     */
    setLowerRightCornerPos: function( newLowerRightCornerPos ) {
      var currentLowerRightCornerPos =  this.getLowerRightCornerPos() ;
      var delta = newLowerRightCornerPos.minus( currentLowerRightCornerPos );
      var newBounds = this.bounds.transformed( Matrix3.translation( delta.x, delta.y ) );
      this.bounds.set( newBounds );
      this.updateAttachmentSiteLocation();
    },

    /**
     * @returns {Vector2}
     */
    getUpperLeftCornerPos: function() {
      return new Vector2( this.bounds.getMinX(), this.bounds.getMaxY() );
    },

    /**
     * @param {Vector2} upperLeftCornerPosition
     */
    setUpperLeftCornerPosition: function( upperLeftCornerPosition ) {
      this.bounds.set( Bounds2.rect( upperLeftCornerPosition.x,
        upperLeftCornerPosition.y - this.bounds.getHeight(),
        this.bounds.getWidth(),
        this.bounds.getHeight() ) );
      this.updateAttachmentSiteLocation();
    },

    /**
     *
     * @param {Vector2} translationVector
     */
    translate: function( translationVector ) {
      this.bounds.set( Bounds2.rect( this.bounds.x + translationVector.x,
        this.bounds.y + translationVector.y,
        this.bounds.getWidth(),
        this.bounds.getHeight() ) );
      this.updateAttachmentSiteLocation();
    },

    /**
     * @returns {Bounds2}
     */
    getBounds: function() {
      return this.bounds;
    },

    /**
     * @returns {boolean}
     */
    isFlat: function() {
      return this.getBounds().height === 0;
    },

    updateAttachmentSiteLocation: function() {
      this.attachmentSite.locationProperty.set( this.getUpperLeftCornerPos() );
    },

    /**
     * Get the length of the mRNA contained by this segment.
     *
     * @return {number}
     */
    getContainedLength: function() {
      assert && assert( false, 'getContainedLength should be implemented in descendant classes of ShapeSegment' );
    },

    /**
     * Add the specified length of mRNA to the segment. This will generally cause the segment to grow. By design, flat
     * segments grow to the left, square segments grow up and left. The shape segment list is also passed in so that new
     * segments can be added if needed.
     *
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    add: function( length, shapeSegmentList ) {
      assert && assert( false, 'add should be implemented in descendant classes of ShapeSegment' );
    },

    /**
     * Remove the specified amount of mRNA from the segment. This will generally cause a segment to shrink. Flat segments
     * shrink in from the right, square segments shrink from the lower right corner towards the upper left. The shape
     * segment list is also a parameter so that shape segments can be removed if necessary.
     *
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    remove: function( length, shapeSegmentList ) {
      assert && assert( false, 'remove should be implemented in descendant classes of ShapeSegment' );
    },

    /**
     * Advance the mRNA through this shape segment. This is what happens when the mRNA is being translated by a ribosome
     * into a protein. The list of shape segments is also a parameter in case segments need to be added or removed.
     *
     * @param length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    advance: function( length, shapeSegmentList ) {
      assert && assert( false, 'advance should be implemented in descendant classes of ShapeSegment' );
    },


    /**
     * Advance the mRNA through this segment but also reduce the segment contents by the given length. This is used when
     * the mRNA is being destroyed.
     *
     * @param length
     * @param  {EnhancedObservableList} shapeSegmentList
     */
    advanceAndRemove: function( length, shapeSegmentList ) {
      assert && assert( false, 'advance should be implemented in descendant classes of ShapeSegment' );
    }
  }, {
    FLOATING_POINT_COMP_FACTOR: FLOATING_POINT_COMP_FACTOR
  } );
} );