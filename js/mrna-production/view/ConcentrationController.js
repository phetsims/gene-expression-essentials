// Copyright 2015-2020, University of Colorado Boulder

/**
 * Class definition for slider that controls the concentration of a transcription factor.
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import GEEConstants from '../../common/GEEConstants.js';
import StubGeneExpressionModel from '../../common/model/StubGeneExpressionModel.js';
import TranscriptionFactor from '../../common/model/TranscriptionFactor.js';
import ControllerNode from '../../common/view/ControllerNode.js';
import MobileBiomoleculeNode from '../../common/view/MobileBiomoleculeNode.js';
import geneExpressionEssentialsStrings from '../../geneExpressionEssentialsStrings.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

const concentrationString = geneExpressionEssentialsStrings.concentration;
const highString = geneExpressionEssentialsStrings.high;
const noneString = geneExpressionEssentialsStrings.none;

/**
 *
 * @param {TranscriptionFactorConfig} transcriptionFactorConfig
 * @param {Property} tfLevelProperty
 * @param {number} min
 * @param {number} max
 *
 * @constructor
 */
function ConcentrationController( transcriptionFactorConfig, tfLevelProperty, min, max ) {
  Node.call( this );

  const captionNode = new Text( concentrationString, {
    font: new PhetFont( { size: 14, weight: 'bold' } ),
    maxWidth: 180
  } );

  const molecule = new MobileBiomoleculeNode( GEEConstants.TRANSCRIPTION_FACTOR_MVT,
    new TranscriptionFactor( new StubGeneExpressionModel(), transcriptionFactorConfig ) );
  molecule.setPickable( false );

  this.addChild( new VBox( {
    spacing: 5,
    children: [
      captionNode,
      molecule,
      new ControllerNode(
        tfLevelProperty,
        min,
        max,
        noneString,
        highString,
        { trackSize: new Dimension2( 130, 5 ) }
      )
    ]
  } ) );
}

geneExpressionEssentials.register( 'ConcentrationController', ConcentrationController );
inherit( Node, ConcentrationController );
export default ConcentrationController;