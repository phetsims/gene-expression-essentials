// Copyright 2017-2019, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );

  const GEEQueryParameters = QueryStringMachine.getAll( {

    // show bounding rectangle for mRNA, useful for debugging
    showMRnaBoundingRect: { type: 'flag' }

  } );

  geneExpressionEssentials.register( 'GEEQueryParameters', GEEQueryParameters );

  return GEEQueryParameters;
} );
