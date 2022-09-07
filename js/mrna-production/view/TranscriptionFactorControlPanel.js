// Copyright 2015-2022, University of Colorado Boulder

/**
 * Control panel that controls the concentration and affinity for a control panel.
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, RichText, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import GEEConstants from '../../common/GEEConstants.js';
import DnaMolecule from '../../common/model/DnaMolecule.js';
import TranscriptionFactor from '../../common/model/TranscriptionFactor.js';
import DnaMoleculeNode from '../../common/view/DnaMoleculeNode.js';
import MobileBiomoleculeNode from '../../common/view/MobileBiomoleculeNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import MessengerRnaProductionModel from '../model/MessengerRnaProductionModel.js';
import AffinityController from './AffinityController.js';
import ConcentrationController from './ConcentrationController.js';

// constants
const DNA_SCALE = 0.1;
const DNA_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), DNA_SCALE );
const TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );

const negativeTranscriptionFactorHtmlString = GeneExpressionEssentialsStrings.negativeTranscriptionFactorHtml;
const positiveTranscriptionFactorHtmlString = GeneExpressionEssentialsStrings.positiveTranscriptionFactorHtml;

class TranscriptionFactorControlPanel extends Panel {

  /**
   * @param {MessengerRnaProductionModel} model
   * @param {TranscriptionFactorConfig} transcriptionFactorConfig
   * @param {Property} affinityProperty
   */
  constructor( model, transcriptionFactorConfig, affinityProperty ) {
    let titleText;
    let tfLevelProperty;
    if ( transcriptionFactorConfig.isPositive ) {
      transcriptionFactorConfig = MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG;
      titleText = positiveTranscriptionFactorHtmlString;
      tfLevelProperty = model.positiveTranscriptionFactorCountProperty;
    }
    else {
      transcriptionFactorConfig = MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG;
      titleText = negativeTranscriptionFactorHtmlString;
      tfLevelProperty = model.negativeTranscriptionFactorCountProperty;
    }

    const titleNode = new RichText( titleText, {
      font: TITLE_FONT,
      maxWidth: 180,
      align: 'center'
    } );

    const transcriptionFactorNode = new MobileBiomoleculeNode(
      GEEConstants.TRANSCRIPTION_FACTOR_MVT,
      new TranscriptionFactor( null, transcriptionFactorConfig )
    );
    const dnaFragmentNode = new DnaMoleculeNode(
      new DnaMolecule( null, GEEConstants.BASE_PAIRS_PER_TWIST + 1, 0.0, true ),
      DNA_MVT,
      2,
      false
    ).toDataURLNodeSynchronous(); // turn into an image so as not to create a canvas layer

    const concentrationController = new ConcentrationController(
      transcriptionFactorConfig,
      tfLevelProperty,
      0,
      MessengerRnaProductionModel.MAX_TRANSCRIPTION_FACTOR_COUNT
    );
    const affinityController = new AffinityController( transcriptionFactorNode, dnaFragmentNode, affinityProperty );

    const contentNode = new VBox( {
      children: [ titleNode, concentrationController, affinityController ],
      spacing: 10
    } );

    super( contentNode, {
      cornerRadius: GEEConstants.CORNER_RADIUS,
      fill: new Color( 250, 250, 250 ),
      lineWidth: 2,
      xMargin: 10,
      yMargin: 10,
      minWidth: 200,
      align: 'center',
      resize: false
    } );
  }
}

geneExpressionEssentials.register( 'TranscriptionFactorControlPanel', TranscriptionFactorControlPanel );
export default TranscriptionFactorControlPanel;