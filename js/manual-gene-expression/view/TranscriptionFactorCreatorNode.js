// Copyright 2015-2018, University of Colorado Boulder

/**
 * Node that, when clicked on, will add a transcription factor to the active area.
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
  const StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  const TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
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
   * @param {TranscriptionFactorConfig} tfConfig
   * @constructor
   */
  function TranscriptionFactorCreatorNode( biomoleculeBoxNode, tfConfig ) {
    BiomoleculeCreatorNode.call( this, new MobileBiomoleculeNode( SCALING_MVT,
      new TranscriptionFactor( new StubGeneExpressionModel(), tfConfig, new Vector2( 0, 0 ) ) ),
      biomoleculeBoxNode.canvas,
      biomoleculeBoxNode.modelViewTransform,
      function( pos ) {
        var transcriptionFactor = new TranscriptionFactor( biomoleculeBoxNode.model, tfConfig, pos );
        biomoleculeBoxNode.model.addMobileBiomolecule( transcriptionFactor );
        return transcriptionFactor;
      },
      function( mobileBiomolecule ) {
        biomoleculeBoxNode.model.removeMobileBiomolecule( mobileBiomolecule );
      },
      biomoleculeBoxNode
    );
  }

  geneExpressionEssentials.register( 'TranscriptionFactorCreatorNode', TranscriptionFactorCreatorNode );

  return inherit( BiomoleculeCreatorNode, TranscriptionFactorCreatorNode );
} );