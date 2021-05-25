// Copyright 2015-2021, University of Colorado Boulder

/**
 * Node that, when clicked on, will add a transcription factor to the active area.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import StubGeneExpressionModel from '../../common/model/StubGeneExpressionModel.js';
import TranscriptionFactor from '../../common/model/TranscriptionFactor.js';
import MobileBiomoleculeNode from '../../common/view/MobileBiomoleculeNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import BiomoleculeCreatorNode from './BiomoleculeCreatorNode.js';

// constants
// Scaling factor for this node when used as a creator node. May be significantly different from the size of the
// corresponding element in the model.
const SCALING_FACTOR = 0.07;
const SCALING_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
  new Vector2( 0, 0 ),
  new Vector2( 0, 0 ),
  SCALING_FACTOR
);

class TranscriptionFactorCreatorNode extends BiomoleculeCreatorNode {

  /**
   * @param {BiomoleculeToolboxNode} biomoleculeBoxNode
   * @param {TranscriptionFactorConfig} tfConfig
   */
  constructor( biomoleculeBoxNode, tfConfig ) {
    super( new MobileBiomoleculeNode( SCALING_MVT,
      new TranscriptionFactor( new StubGeneExpressionModel(), tfConfig, new Vector2( 0, 0 ) ) ),
      biomoleculeBoxNode.screenView,
      biomoleculeBoxNode.modelViewTransform,
      pos => {
        const transcriptionFactor = new TranscriptionFactor( biomoleculeBoxNode.model, tfConfig, pos );
        biomoleculeBoxNode.model.addMobileBiomolecule( transcriptionFactor );
        return transcriptionFactor;
      },
      mobileBiomolecule => {
        biomoleculeBoxNode.model.removeMobileBiomolecule( mobileBiomolecule );
      },
      biomoleculeBoxNode
    );
  }
}

geneExpressionEssentials.register( 'TranscriptionFactorCreatorNode', TranscriptionFactorCreatorNode );

export default TranscriptionFactorCreatorNode;