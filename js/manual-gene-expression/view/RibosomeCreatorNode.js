// Copyright 2015-2018, University of Colorado Boulder

/**
 * Node that, when clicked on, will add a ribosome to the active area.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const BiomoleculeCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/BiomoleculeCreatorNode' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Ribosome = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Ribosome' );
  const StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  const Vector2 = require( 'DOT/Vector2' );

  // Scaling factor for this node when used as a creator node. May be significantly different from the size of the
  // corresponding element in the model.
  var SCALING_FACTOR = 0.07;
  var SCALING_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
    new Vector2( 0, 0 ),
    new Vector2( 0, 0 ),
    SCALING_FACTOR
  );

  /**
   * @param {BiomoleculeToolboxNode} biomoleculeBoxNode
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
      biomoleculeBoxNode.modelViewTransform,
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