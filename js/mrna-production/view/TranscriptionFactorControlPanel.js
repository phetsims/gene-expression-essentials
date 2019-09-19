// Copyright 2015-2017, University of Colorado Boulder

/**
 * Control panel that controls the concentration and affinity for a control panel.
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AffinityController = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/AffinityController' );
  const Color = require( 'SCENERY/util/Color' );
  const ConcentrationController = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/ConcentrationController' );
  const DnaMolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaMolecule' );
  const DnaMoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeNode' );
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/model/MessengerRnaProductionModel' );
  const MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  var DNA_SCALE = 0.1;
  var DNA_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), DNA_SCALE );
  var TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );

  // strings
  const negativeTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/negativeTranscriptionFactorHtml' );
  const positiveTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/positiveTranscriptionFactorHtml' );

  /**
   * @param {MessengerRnaProductionModel} model
   * @param {TranscriptionFactorConfig} transcriptionFactorConfig
   * @param {Property} affinityProperty
   * @constructor
   */
  function TranscriptionFactorControlPanel( model, transcriptionFactorConfig, affinityProperty ) {
    var titleText;
    var tfLevelProperty;
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

    var titleNode = new RichText( titleText, {
      font: TITLE_FONT,
      maxWidth: 180,
      align: 'center'
    } );

    var transcriptionFactorNode = new MobileBiomoleculeNode(
      GEEConstants.TRANSCRIPTION_FACTOR_MVT,
      new TranscriptionFactor( null, transcriptionFactorConfig )
    );
    var dnaFragmentNode = new DnaMoleculeNode(
      new DnaMolecule( null, GEEConstants.BASE_PAIRS_PER_TWIST + 1, 0.0, true ),
      DNA_MVT,
      2,
      false
    ).toDataURLNodeSynchronous(); // turn into an image so as not to create a canvas layer

    var concentrationController = new ConcentrationController(
      transcriptionFactorConfig,
      tfLevelProperty,
      0,
      MessengerRnaProductionModel.MAX_TRANSCRIPTION_FACTOR_COUNT
    );
    var affinityController = new AffinityController( transcriptionFactorNode, dnaFragmentNode, affinityProperty );

    var contentNode = new VBox( {
      children: [ titleNode, concentrationController, affinityController ],
      spacing: 10
    } );

    Panel.call( this, contentNode, {
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

  geneExpressionEssentials.register( 'TranscriptionFactorControlPanel', TranscriptionFactorControlPanel );

  return inherit( Panel, TranscriptionFactorControlPanel );
} );