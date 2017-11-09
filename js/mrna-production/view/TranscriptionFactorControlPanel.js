// Copyright 2015-2017, University of Colorado Boulder

/**
 * Control panel that controls the concentration and affinity for a control panel.
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var AffinityController = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/AffinityController' );
  var Color = require( 'SCENERY/util/Color' );
  var ConcentrationController = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/ConcentrationController' );
  var DnaMolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaMolecule' );
  var DnaMoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeNode' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/model/MessengerRnaProductionModel' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DNA_SCALE = 0.1;
  var DNA_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), DNA_SCALE );
  var TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );

  // strings
  var negativeTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/negativeTranscriptionFactorHtml' );
  var positiveTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/positiveTranscriptionFactorHtml' );

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

    var titleNode = new MultiLineText( titleText, {
      font: TITLE_FONT,
      maxWidth: 180
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