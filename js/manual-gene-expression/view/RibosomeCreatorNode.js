// Copyright 2015, University of Colorado Boulder

/**
 * Node that, when clicked on, will add a ribosome to the active area.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var BiomoleculeCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/BiomoleculeCreatorNode' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Ribosome = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Ribosome' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  var Vector2 = require( 'DOT/Vector2' );

  // Scaling factor for this node when used as a creator node. May be significantly different from the size of the
  // corresponding element in the model.
  var SCALING_FACTOR = 0.07;
  var SCALING_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
    new Vector2( 0, 0 ),
    new Vector2( 0, 0 ),
    SCALING_FACTOR
  );

  /**
   * @param {BiomoleculeToolBoxNode} biomoleculeBoxNode
   * @constructor
   */
  function RibosomeCreatorNode( biomoleculeBoxNode ) {
    BiomoleculeCreatorNode.call(
      this,
      new MobileBiomoleculeNode(
        SCALING_MVT,
        new Ribosome( new StubGeneExpressionModel() )
      ),
      biomoleculeBoxNode.canvas,
      biomoleculeBoxNode.mvt,
      function( pos ) {
        var srs = new Ribosome( biomoleculeBoxNode.model, pos );
        biomoleculeBoxNode.model.addMobileBiomolecule( srs );
        return srs;
      },
      function( mobileBiomolecule ) {
        biomoleculeBoxNode.model.removeMobileBiomolecule( mobileBiomolecule );
      },
      biomoleculeBoxNode
    );
  }

  geneExpressionEssentials.register( 'RibosomeCreatorNode', RibosomeCreatorNode );

  return inherit( BiomoleculeCreatorNode, RibosomeCreatorNode );
} );