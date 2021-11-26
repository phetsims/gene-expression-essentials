// Copyright 2015-2021, University of Colorado Boulder

/**
 * utilities for creating gradients
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */


//modules
import { LinearGradient } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GEEConstants from '../GEEConstants.js';

const GradientUtils = {
  /**
   * Create a gradient paint in order to give a molecule a little depth. This is public so that it can be used by other
   * nodes that need to depict biomolecules.
   *
   * @param {Shape} shape;
   * @param {Color} baseColor
   */
  createGradientPaint( shape, baseColor ) {
    let paint;
    if ( !GEEConstants.FLORESCENT_FILL_COLOR.equals( baseColor ) ) {
      const shapeBounds = shape.bounds;
      paint = new LinearGradient( shapeBounds.getMinX(),
        shapeBounds.getCenterY(),
        shapeBounds.getMaxX(),
        shapeBounds.getCenterY() );

      paint.addColorStop( 0, baseColor.brighterColor( 0.5 ) );
      paint.addColorStop( 1, baseColor.darkerColor( 0.5 ) );

    }
    else {
      // Special case: If using the "fluorescent" color, i.e. the one used to depict green fluorescent protein in the
      // sim, don't create a gradient, because it looks brighter and more distinct.
      paint = baseColor;
    }
    return paint;
  }
};
geneExpressionEssentials.register( 'GradientUtils', GradientUtils );
export default GradientUtils;