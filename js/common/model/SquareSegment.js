// Copyright 2015, University of Colorado Boulder

/**
 * Class that defines a square segment, which is one in which the mRNA can be (and generally is) curled up.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  //modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapeSegment = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeSegment' );

  /**
   * @param {Object} owner
   * @param {Vector2} origin
   * @constructor
   */
  function SquareSegment( owner, origin ) {
    // Maintain an explicit value for the length of the mRNA contained within this segment even though the bounds
    // essentially define said length.  This helps to avoid floating point issues.
    this.containedLength = 0; // @private
    ShapeSegment.call( this, owner );

    this.bounds.set( Bounds2.rect( origin.x, origin.y, 0, 0 ) );
    this.updateAttachmentSiteLocation();
  }

  geneExpressionEssentials.register( 'SquareSegment', SquareSegment );

  return inherit( ShapeSegment, SquareSegment, {

    /**
     * @override
     * @returns {number}
     * @public
     */
    getContainedLength: function() {
      return this.containedLength;
    },

    /**
     * @override
     * @param {number} length
     * @param {WindingBiomolecule} windingBiomolecule
     * @param {Array.<ShapeSegment>} shapeSegmentList
     * @public
     */
    add: function( length, windingBiomolecule, shapeSegmentList ) {
      this.containedLength += length;

      // Grow the bounds up and to the left to accommodate the additional length.
      var sideGrowthAmount = this.calculateSideLength() - this.bounds.getWidth();
      assert && assert( length >= 0 && sideGrowthAmount >= 0 ); //
      this.bounds.set( Bounds2.rect( this.bounds.x - sideGrowthAmount,
        this.bounds.y,
        this.bounds.getWidth() + sideGrowthAmount,
        this.bounds.getHeight() + sideGrowthAmount ) );
      this.updateAttachmentSiteLocation();
    },

    /**
     * @override
     * @param {number} length
     * @param {Array.<ShapeSegment>} shapeSegmentList
     */
    remove: function( length, shapeSegmentList ) {
      this.containedLength -= length;

      // Shrink by moving the lower right corner up and to the left.
      var sideShrinkageAmount = this.bounds.getWidth() - this.calculateSideLength();

      this.bounds.set( Bounds2.rect( this.bounds.x,
        this.bounds.y + sideShrinkageAmount,
        this.bounds.getWidth() - sideShrinkageAmount,
        this.bounds.getHeight() - sideShrinkageAmount ) );

      // If the length has gotten to zero, remove this segment from the list.
      if ( this.getContainedLength() <= ShapeSegment.FLOATING_POINT_COMP_FACTOR ) {
        var index = shapeSegmentList.indexOf( this );
        shapeSegmentList.splice( index, 1 );
      }
      this.updateAttachmentSiteLocation();
    },

    /**
     * @override
     * @param {number} length
     * @param {WindingBiomolecule} windingBiomolecule
     * @param {Array.<ShapeSegment>} shapeSegmentList
     * @public
     */
    advance: function( length, windingBiomolecule, shapeSegmentList ) {

      // This should never be called for square shape segments, since translation should only occur based around flat
      // segments.
      assert && assert( false,
        'This should never be called for square shape segments, since translation should only occur based around flat segments.' );

    },

    /**
     * @override
     * @param {number} length
     * @param {WindingBiomolecule} windingBiomolecule
     * @param {Array.<ShapeSegment>} shapeSegmentList
     * @public
     */
    advanceAndRemove: function( length, windingBiomolecule, shapeSegmentList ) {
      assert && assert( false, 'Unimplemented method called on square shape segment' );
    },

    /**
     * Determine the length of a side as a function of the contained length of mRNA.
     * @returns {number}
     * @private
     */
    calculateSideLength: function() {
      var desiredDiagonalLength = Math.pow( this.containedLength, 0.7 ); // Power value was empirically determined.
      return Math.sqrt( 2 * desiredDiagonalLength * desiredDiagonalLength );
    }
  } );
} );