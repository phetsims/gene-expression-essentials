// Copyright 2017, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );

  var GEEQueryParameters = QueryStringMachine.getAll( {

    // show bounding rectangle for mRNA, useful for debugging
    showMRnaBoundingRect: { type: 'flag' }

  } );

  geneExpressionEssentials.register( 'GEEQueryParameters', GEEQueryParameters );

  return GEEQueryParameters;
} );
