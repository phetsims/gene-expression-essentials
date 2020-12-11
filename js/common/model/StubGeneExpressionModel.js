// Copyright 2015-2020, University of Colorado Boulder

/**
 * Gene expression model that doesn't do anything. This is needed in cases where we want to create biomolecules without
 * needing a full blown model, such as on control panels.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class StubGeneExpressionModel {

  /**
   */
  constructor() {
  }
}

geneExpressionEssentials.register( 'StubGeneExpressionModel', StubGeneExpressionModel );
export default StubGeneExpressionModel;