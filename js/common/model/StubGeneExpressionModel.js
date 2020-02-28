// Copyright 2015-2020, University of Colorado Boulder

/**
 * Gene expression model that doesn't do anything. This is needed in cases where we want to create biomolecules without
 * needing a full blown model, such as on control panels.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import inherit from '../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

/**
 * @constructor
 */
function StubGeneExpressionModel() {
}

geneExpressionEssentials.register( 'StubGeneExpressionModel', StubGeneExpressionModel );
inherit( Object, StubGeneExpressionModel );
export default StubGeneExpressionModel;