// Copyright 2015, University of Colorado Boulder

/**
 * Class that defines a square segment, which is one in which the mRNA can be (and generally is) curled up.
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapeSegment = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeSegment' );

  /**
   *
   * @param {Vector2} origin
   * @constructor
   */
  function SquareSegment( origin ) {
    // Maintain an explicit value for the length of the mRNA contained within this segment even though the bounds
    // essentially define said length.  This helps to avoid floating point issues.
    this.containedLength = 0;
    ShapeSegment.call( this );

    this.bounds.set( Bounds2.rect( origin.x, origin.y, 0, 0 ) );
    this.updateAttachmentSiteLocation();
  }

  geneExpressionEssentials.register( 'SquareSegment', SquareSegment );

  return inherit( ShapeSegment, SquareSegment, {

    /**
     * @Override
     * @returns {number}
     */
    getContainedLength: function() {
      return this.containedLength;
    },

    /**
     * @Override
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    add: function( length, shapeSegmentList ) {
      this.addByLength( length );
    },

    /**
     * @Override
     * @param {number} length
     */
    addByLength: function( length ) {
      this.containedLength += length;

      // Grow the bounds up and to the left to accommodate the additional length.
      var sideGrowthAmount = this.calculateSideLength() - this.bounds.getWidth();
      assert && assert(length >= 0 && sideGrowthAmount >= 0); //
      this.bounds.set( Bounds2.rect( this.bounds.x - sideGrowthAmount,
        this.bounds.y,
        this.bounds.getWidth() + sideGrowthAmount,
        this.bounds.getHeight() + sideGrowthAmount ) );
      this.updateAttachmentSiteLocation();
    },

    /**
     *@Override
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    remove: function( length, shapeSegmentList ) {
      this.containedLength -= length;

      // Shrink by moving the lower right corner up and to the left.
      var sideShrinkageAmount = this.bounds.getWidth() - this.calculateSideLength();

      this.bounds.set( Bounds2.rect( this.bounds.x,
        this.bounds.y + sideShrinkageAmount,
        this.bounds.getWidth() - sideShrinkageAmount,
        this.bounds.getHeight() - sideShrinkageAmount ) );

      // If the length has gotten to zero, remove this segment from
      // the list.
      if ( this.getContainedLength() <= ShapeSegment.FLOATING_POINT_COMP_FACTOR ) {
        shapeSegmentList.remove( this );
      }
      this.updateAttachmentSiteLocation();
    },

    /**
     * @Override
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    advance: function( length, shapeSegmentList ) {

      // This should never be called for square shape segments, since translation should only occur based around flat
      // segments.
      assert && assert( false, 'This should never be called for square shape segments, since translation should only occur based around flat segments.');

    },

    /**
     * @Override
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    advanceAndRemove: function( length, shapeSegmentList ) {
      assert && assert( false, 'Unimplemented method called on square shape segment' );
    },

    /**
     * @private
     *  Determine the length of a side as a function of the contained length of mRNA.
     * @returns {number}
     */
    calculateSideLength: function() {
      var desiredDiagonalLength = Math.pow( this.containedLength, 0.7 ); // Power value was empirically determined.
      return Math.sqrt( 2 * desiredDiagonalLength * desiredDiagonalLength );
    }
  } );
} );