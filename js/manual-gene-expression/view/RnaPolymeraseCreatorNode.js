// Copyright 2015-2021, University of Colorado Boulder

/**
 * Node that, when clicked on, will add an RNA polymerase to the model.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import RnaPolymerase from '../../common/model/RnaPolymerase.js';
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

class RnaPolymeraseCreatorNode extends BiomoleculeCreatorNode {

  /**
   * @param {BiomoleculeToolboxNode} biomoleculeBoxNode - Biomolecule box, which is a sort of toolbox, in which
   * this creator node exists.
   *
   */
  constructor( biomoleculeBoxNode ) {
    super( new MobileBiomoleculeNode( SCALING_MVT, new RnaPolymerase() ),
      biomoleculeBoxNode.screenView,
      biomoleculeBoxNode.modelViewTransform,

      pos => { // Molecule creator function.
        const rnaPolymerase = new RnaPolymerase( biomoleculeBoxNode.model, pos );
        biomoleculeBoxNode.model.addMobileBiomolecule( rnaPolymerase );
        return rnaPolymerase;
      },

      mobileBiomolecule => {
        biomoleculeBoxNode.model.removeMobileBiomolecule( mobileBiomolecule );
      },

      biomoleculeBoxNode
    );
  }
}

geneExpressionEssentials.register( 'RnaPolymeraseCreatorNode', RnaPolymeraseCreatorNode );

export default RnaPolymeraseCreatorNode;