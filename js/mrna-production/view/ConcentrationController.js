// Copyright 2015-2022, University of Colorado Boulder

/**
 * Class definition for slider that controls the concentration of a transcription factor.
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import GEEConstants from '../../common/GEEConstants.js';
import StubGeneExpressionModel from '../../common/model/StubGeneExpressionModel.js';
import TranscriptionFactor from '../../common/model/TranscriptionFactor.js';
import ControllerNode from '../../common/view/ControllerNode.js';
import MobileBiomoleculeNode from '../../common/view/MobileBiomoleculeNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';

const concentrationString = GeneExpressionEssentialsStrings.concentration;
const highString = GeneExpressionEssentialsStrings.high;
const noneString = GeneExpressionEssentialsStrings.none;

class ConcentrationController extends Node {

  /**
   * @param {TranscriptionFactorConfig} transcriptionFactorConfig
   * @param {Property} tfLevelProperty
   * @param {number} min
   * @param {number} max
   *
   */
  constructor( transcriptionFactorConfig, tfLevelProperty, min, max ) {
    super();

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
}

geneExpressionEssentials.register( 'ConcentrationController', ConcentrationController );
export default ConcentrationController;