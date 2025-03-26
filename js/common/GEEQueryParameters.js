// Copyright 2017-2025, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import geneExpressionEssentials from '../geneExpressionEssentials.js';

const GEEQueryParameters = QueryStringMachine.getAll( {

  // show bounding rectangle for mRNA, useful for debugging
  showMRnaBoundingRect: { type: 'flag' }

} );

geneExpressionEssentials.register( 'GEEQueryParameters', GEEQueryParameters );

export default GEEQueryParameters;