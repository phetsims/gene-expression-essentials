//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Class that defines a square segment, which is one in which the mRNA
 * can be (and generally is) curled up.
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapeSegment = require( 'GENE_EXPRESSION_BASICS/common/model/ShapeSegment' );
  var Rectangle = require( 'DOT/Rectangle' );


  function SquareSegment( origin ) {
    ShapeSegment.call( this );
    this.bounds.set( new Rectangle( origin.x, origin.y, 0, 0 ) );
    this.updateAttachmentSiteLocation();

// Maintain an explicit value for the length of the mRNA contained
    // within this segment even though the bounds essentially define
    // said length.  This helps to avoid floating point issues.
    this.containedLength = 0;

  }

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

      // Grow the bounds up and to the left to accommodate the
      // additional length.
      var sideGrowthAmount = this.calculateSideLength() - this.bounds.get().getWidth();

      this.bounds.set( new Rectangle( this.bounds.get().x - sideGrowthAmount,
        this.bounds.get().y,
        this.bounds.get().getWidth() + sideGrowthAmount,
        this.bounds.get().getHeight() + sideGrowthAmount ) );
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
      this.sideShrinkageAmount = this.bounds.get().getWidth() - this.calculateSideLength();

      this.bounds.set( new Rectangle( this.bounds.get().x,
        this.bounds.get().y + this.sideShrinkageAmount,
        this.bounds.get().getWidth() - this.sideShrinkageAmount,
        this.bounds.get().getHeight() - this.sideShrinkageAmount ) );

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

      // This should never be called for square shape segments, since
      // translation should only occur based around flat segments.
      // assert false;
    },

    /**
     * @Override
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    advanceAndRemove: function( length, shapeSegmentList ) {

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
