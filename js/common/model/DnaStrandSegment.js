//  Copyright 2002-2015, University of Colorado Boulder
/**
 /**
 * This class defines a segment of the DNA strand.  It is needed because the
 * DNA molecule needs to look like it is 3D, but we are only modeling it as
 * 2D, so in order to create the appearance of a twist between the two
 * strands, we need to track which segments are in front and which are in
 * back.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapeChangingModelElement = require( 'GENE_EXPRESSION_BASICS/common/model/ShapeChangingModelElement' );

  /**
   * @param {Shape} shape
   * @param {boolean} inFront
   * @constructor
   */
  function DnaStrandSegment( shape, inFront ) {
    ShapeChangingModelElement.call( this, shape );
    this.inFront = inFront;
  }

  return inherit( ShapeChangingModelElement, DnaStrandSegment,
    {
      setShape: function( newShape ) {
        this.shapeProperty.set( newShape );
      }

    } );

} );
