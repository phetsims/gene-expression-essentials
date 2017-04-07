// Copyright 2015, University of Colorado Boulder

/**
 * Class the defines the shape, color, polarity, etc. of a transcription factor.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

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

  return inherit( Object, TranscriptionFactorConfig, {} );
} );