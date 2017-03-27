// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  //modules
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function GradientUtil() {

  }

  geneExpressionEssentials.register( 'GradientUtil', GradientUtil );

  return inherit( Object, GradientUtil, {}, {

    /**
     * Create a gradient paint in order to give a molecule a little depth. This is public so that it can be used by other
     * nodes that need to depict biomolecules.
     *
     * @param {Shape} shape;
     * @param {Color} baseColor
     */
    createGradientPaint: function( shape, baseColor ) {
      var paint;
      if ( !GEEConstants.FLORESCENT_FILL_COLOR.equals( baseColor ) ) {
        var shapeBounds = shape.bounds;
        paint = new LinearGradient( shapeBounds.getMinX(),
          shapeBounds.getCenterY(),
          shapeBounds.getMaxX(),
          shapeBounds.getCenterY() );

        paint.addColorStop( 0, baseColor.brighterColor( 0.5 ) );
        paint.addColorStop( 1, baseColor.darkerColor( 0.5 ) );

      }
      else {
        // Special case: If using the "fluorescent" color, i.e. the one
        // used to depict green fluorescent protein in the sim, don't
        // create a gradient, because it looks brighter and more distinct.
        paint = baseColor;
      }

      return paint;
    }

  } );

} );
