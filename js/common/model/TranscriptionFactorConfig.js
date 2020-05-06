// Copyright 2015-2020, University of Colorado Boulder

/**
 * Class the defines the shape, color, polarity, etc. of a transcription factor.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../geneExpressionEssentials.js';

/**
 * @param {Shape} shape
 * @param {Vector2} positive
 * @param {Color} baseColor
 * @constructor
 */
function TranscriptionFactorConfig( shape, positive, baseColor ) {
  this.shape = shape; // @public
  this.baseColor = baseColor; // @public
  this.isPositive = positive; // @public
}

geneExpressionEssentials.register( 'TranscriptionFactorConfig', TranscriptionFactorConfig );

export default TranscriptionFactorConfig;