// Copyright 2015-2017, University of Colorado Boulder

/**
 * Gene expression model that doesn't do anything. This is needed in cases where we want to create biomolecules without
 * needing a full blown model, such as on control panels.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function StubGeneExpressionModel() {
  }

  geneExpressionEssentials.register( 'StubGeneExpressionModel', StubGeneExpressionModel );
  return inherit( Object, StubGeneExpressionModel );
} );