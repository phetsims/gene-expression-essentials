// Copyright 2015, University of Colorado Boulder

/**
 * Control panel that controls the concentration and affinity for a control panel.
 *
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/model/MessengerRnaProductionModel' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var DnaMoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeNode' );
  var DnaMolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaMolecule' );
  var AffinityController = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/view/AffinityController' );
  var ConcentrationController = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/view/ConcentrationController' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );

  // constants
  var DNA_SCALE = 0.1;
  var DNA_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), DNA_SCALE );
  var TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );

  //strings
  var positiveTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/positiveTranscriptionFactorHtml' );
  var negativeTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/negativeTranscriptionFactorHtml' );

  /**
   *
   * @param {MessengerRnaProductionModel} model
   * @param {TranscriptionFactorConfig} transcriptionFactorConfig
   * @param {Property} affinityProperty
   * @constructor
   */
  function TranscriptionFactorControlPanel( model, transcriptionFactorConfig, affinityProperty ) {
    var self = this;

    var titleText;
    var tfLevelProperty;
    if ( transcriptionFactorConfig.isPositive ) {
      transcriptionFactorConfig = MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG;
      titleText = positiveTranscriptionFactorHtmlString;
      tfLevelProperty = model.positiveTranscriptionFactorCount;
    }
    else {
      transcriptionFactorConfig = MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG;
      titleText = negativeTranscriptionFactorHtmlString;
      tfLevelProperty = model.negativeTranscriptionFactorCount;
    }


    var titleNode = new MultiLineText( titleText, {
      font: TITLE_FONT,
      maxWidth: 180
    } );


    var transcriptionFactorNode = new MobileBiomoleculeNode( CommonConstants.TRANSCRIPTION_FACTOR_MVT,
      new TranscriptionFactor( null, transcriptionFactorConfig ) );
    var dnaFragmentNode = new DnaMoleculeNode( new DnaMolecule( null, CommonConstants.BASE_PAIRS_PER_TWIST + 1, 0.0, true ), DNA_MVT, 2, false );

    var concentrationController = new ConcentrationController( transcriptionFactorConfig, tfLevelProperty, 0, MessengerRnaProductionModel.MAX_TRANSCRIPTION_FACTOR_COUNT );
    var affinityController = new AffinityController( transcriptionFactorNode, dnaFragmentNode, affinityProperty );


    var contentNode = new VBox( {
      children: [ titleNode, concentrationController, affinityController ],
      spacing: 10
    } );


    Panel.call( self, contentNode, {
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