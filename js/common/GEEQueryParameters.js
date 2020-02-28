// Copyright 2017-2020, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */

import geneExpressionEssentials from '../geneExpressionEssentials.js';

const GEEQueryParameters = QueryStringMachine.getAll( {

  // show bounding rectangle for mRNA, useful for debugging
  showMRnaBoundingRect: { type: 'flag' }

} );

geneExpressionEssentials.register( 'GEEQueryParameters', GEEQueryParameters );

export default GEEQueryParameters;