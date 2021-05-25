// Copyright 2015-2021, University of Colorado Boulder

/**
 * Node that, when clicked on, will add an mRNA destroyer to the active area.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MessengerRnaDestroyer from '../../common/model/MessengerRnaDestroyer.js';
import StubGeneExpressionModel from '../../common/model/StubGeneExpressionModel.js';
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

class MessengerRnaDestroyerCreatorNode extends BiomoleculeCreatorNode {

  /**
   * @param {BiomoleculeToolboxNode} biomoleculeBoxNode
   */
  constructor( biomoleculeBoxNode ) {
    super(
      new MobileBiomoleculeNode( SCALING_MVT, new MessengerRnaDestroyer( new StubGeneExpressionModel() ) ),
      biomoleculeBoxNode.screenView,
      biomoleculeBoxNode.modelViewTransform,
      pos => {
        const mRnaDestroyer = new MessengerRnaDestroyer( biomoleculeBoxNode.model, pos );
        biomoleculeBoxNode.model.addMobileBiomolecule( mRnaDestroyer );
        return mRnaDestroyer;

      },
      mobileBiomolecule => {
        biomoleculeBoxNode.model.removeMobileBiomolecule( mobileBiomolecule );
      },
      biomoleculeBoxNode
    );
  }
}

geneExpressionEssentials.register( 'MessengerRnaDestroyerCreatorNode', MessengerRnaDestroyerCreatorNode );

export default MessengerRnaDestroyerCreatorNode;