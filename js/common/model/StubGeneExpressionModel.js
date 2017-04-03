// Copyright 2015, University of Colorado Boulder

/**
 * Gene expression model that doesn't do anything. This is needed in cases where we want to create biomolecules without
 * needing a full blown model, such as on control panels.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
    'use strict';

    // modules
    var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
    var inherit = require( 'PHET_CORE/inherit' );

    /**
     * @constructor
     */
    function StubGeneExpressionModel() {
    }

    geneExpressionEssentials.register( 'StubGeneExpressionModel', StubGeneExpressionModel );
    return inherit( Object, StubGeneExpressionModel );
  } );