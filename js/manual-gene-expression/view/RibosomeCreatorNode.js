// Copyright 2015-2020, University of Colorado Boulder

/**
 * Node that, when clicked on, will add a ribosome to the active area.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Ribosome from '../../common/model/Ribosome.js';
import StubGeneExpressionModel from '../../common/model/StubGeneExpressionModel.js';
import MobileBiomoleculeNode from '../../common/view/MobileBiomoleculeNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import BiomoleculeCreatorNode from './BiomoleculeCreatorNode.js';

// Scaling factor for this node when used as a creator node. May be significantly different from the size of the
// corresponding element in the model.
const SCALING_FACTOR = 0.07;
const SCALING_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
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
      const srs = new Ribosome( biomoleculeBoxNode.model, pos );
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

inherit( BiomoleculeCreatorNode, RibosomeCreatorNode );
export default RibosomeCreatorNode;