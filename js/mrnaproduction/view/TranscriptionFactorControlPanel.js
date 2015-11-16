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
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MessengerRnaProductionModel = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/model/MessengerRnaProductionModel' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_BASICS/common/model/TranscriptionFactor' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_BASICS/common/view/MobileBiomoleculeNode' );
  var DnaMoleculeNode = require( 'GENE_EXPRESSION_BASICS/common/view/DnaMoleculeNode' );
  var DnaMolecule = require( 'GENE_EXPRESSION_BASICS/common/model/DnaMolecule' );
  var AffinityController = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/view/AffinityController' );
  var ConcentrationController = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/view/ConcentrationController' );
  var CommonConstants = require( 'GENE_EXPRESSION_BASICS/common/model/CommonConstants' );

  // constants
  var DNA_SCALE = 0.1;
  var DNA_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), DNA_SCALE );
  var TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );

  //strings
  var positiveTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_BASICS/positiveTranscriptionFactorHtml' );
  var negativeTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_BASICS/negativeTranscriptionFactorHtml' );

  /**
   *
   * @param {MessengerRnaProductionModel} model
   * @param {TranscriptionFactorConfig} transcriptionFactorConfig
   * @param {Property} affinityProperty
   * @constructor
   */
  function TranscriptionFactorControlPanel( model, transcriptionFactorConfig, affinityProperty ) {
    var thisNode = this;

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


    var titleNode = new Text( titleText, TITLE_FONT );


    var transcriptionFactorNode = new MobileBiomoleculeNode( CommonConstants.TRANSCRIPTION_FACTOR_MVT,
      new TranscriptionFactor( null, transcriptionFactorConfig ) );
    var dnaFragmentNode = new DnaMoleculeNode( new DnaMolecule( null, CommonConstants.BASE_PAIRS_PER_TWIST + 1, 0.0, true ), DNA_MVT, 2, false );

    var concentrationController = new ConcentrationController( transcriptionFactorConfig, tfLevelProperty, 0, MessengerRnaProductionModel.MAX_TRANSCRIPTION_FACTOR_COUNT );
    var affinityController = new AffinityController( transcriptionFactorNode, dnaFragmentNode, affinityProperty );


    var contentNode = new VBox( {
      children: [ titleNode, concentrationController, affinityController ],
      spacing: 10
    } );


    Panel.call( thisNode, contentNode, {
      fill: new Color( 250, 250, 250 ),
      lineWidth: 2
    } );
  }

  return inherit( Panel, TranscriptionFactorControlPanel );

} );

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.mrnaproduction.view;
//
//import java.awt.geom.Point2D;
//
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty;
//import edu.colorado.phet.common.phetcommon.model.property.integerproperty.IntegerProperty;
//import edu.colorado.phet.common.phetcommon.simsharing.messages.UserComponent;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.colorado.phet.common.piccolophet.nodes.ControlPanelNode;
//import edu.colorado.phet.common.piccolophet.nodes.HTMLNode;
//import edu.colorado.phet.common.piccolophet.nodes.layout.VBox;
//import edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources;
//import edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsSimSharing.UserComponents;
//import edu.colorado.phet.geneexpressionbasics.common.model.DnaMolecule;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor.TranscriptionFactorConfig;
//import edu.colorado.phet.geneexpressionbasics.common.view.DnaMoleculeNode;
//import edu.colorado.phet.geneexpressionbasics.common.view.MobileBiomoleculeNode;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model.StubGeneExpressionModel;
//import edu.colorado.phet.geneexpressionbasics.mrnaproduction.model.MessengerRnaProductionModel;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PText;
//
///**
// * Control panel that controls the concentration and affinity for a control
// * panel.
// *
// * @author John Blanco
// */
//public class TranscriptionFactorControlPanel extends PNode {
//
//    private static final double TRANSCRIPTION_FACTOR_SCALE = 0.08;
//    private static final ModelViewTransform TRANSCRIPTION_FACTOR_MVT = ModelViewTransform.createSinglePointScaleInvertedYMapping( new Point2D.Double( 0, 0 ),
//                                                                                                                                  new Point2D.Double( 0, 0 ),
//                                                                                                                                  TRANSCRIPTION_FACTOR_SCALE );
//
//    private static final double DNA_SCALE = 0.1;
//    private static final ModelViewTransform DNA_MVT = ModelViewTransform.createSinglePointScaleInvertedYMapping( new Point2D.Double( 0, 0 ),
//                                                                                                                 new Point2D.Double( 0, 0 ),
//                                                                                                                 DNA_SCALE );
//
//    /**
//     * Constructor.
//     */
//    public TranscriptionFactorControlPanel( MessengerRnaProductionModel model, TranscriptionFactorConfig transcriptionFactorConfig, Property<Double> affinityProperty ) {
//
//        final String titleText;
//        final IntegerProperty tfLevelProperty;
//        if ( transcriptionFactorConfig.isPositive ) {
//            transcriptionFactorConfig = MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG;
//            titleText = GeneExpressionBasicsResources.Strings.POSITIVE_TRANSCRIPTION_FACTOR_HTML;
//            tfLevelProperty = model.positiveTranscriptionFactorCount;
//        }
//        else {
//            transcriptionFactorConfig = MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG;
//            titleText = GeneExpressionBasicsResources.Strings.NEGATIVE_TRANSCRIPTION_FACTOR_HTML;
//            tfLevelProperty = model.negativeTranscriptionFactorCount;
//        }
//
//        PNode title = new HTMLNode( titleText ) {{
//            setFont( new PhetFont( 16, true ) );
//        }};
//
//        PNode transcriptionFactorNode = new MobileBiomoleculeNode( TRANSCRIPTION_FACTOR_MVT, new TranscriptionFactor( transcriptionFactorConfig ) );
//        PNode dnaFragmentNode = new DnaMoleculeNode( new DnaMolecule( DnaMolecule.BASE_PAIRS_PER_TWIST + 1, 0.0, true ), DNA_MVT, 2, false );
//        PNode contents = new VBox(
//                20,
//                title,
//                new ConcentrationController( transcriptionFactorConfig, tfLevelProperty, 0, MessengerRnaProductionModel.MAX_TRANSCRIPTION_FACTOR_COUNT ),
//                new AffinityController( transcriptionFactorNode, dnaFragmentNode, affinityProperty )
//        );
//
//        addChild( new ControlPanelNode( contents ) );
//    }
//
//    // Class definition for slider that controls the concentration of a
//    // transcription factor.
//    private static class ConcentrationController extends PNode {
//
//        private ConcentrationController( TranscriptionFactorConfig transcriptionFactorConfig, IntegerProperty tfLevelProperty, int min, int max ) {
//            PText caption = new PText( GeneExpressionBasicsResources.Strings.CONCENTRATIONS ) {{
//                setFont( new PhetFont( 14, false ) );
//            }};
//            PNode molecule = new MobileBiomoleculeNode( TRANSCRIPTION_FACTOR_MVT, new TranscriptionFactor( new StubGeneExpressionModel(), transcriptionFactorConfig ) );
//            molecule.setPickable( false );
//            molecule.setChildrenPickable( false );
//            addChild( new VBox( 5,
//                                caption,
//                                molecule,
//                                new HorizontalSliderWithLabelsAtEnds( new UserComponent( UserComponents.transcriptionFactorLevelSlider ),
//                                                                      new IntegerToDoublePropertyWrapper( tfLevelProperty ),
//                                                                      (double) min,
//                                                                      (double) max,
//                                                                      GeneExpressionBasicsResources.Strings.NONE,
//                                                                      GeneExpressionBasicsResources.Strings.LOTS ) ) );
//        }
//    }
//
//    // Convenience class that connects an integer property to a double property.
//    private static class IntegerToDoublePropertyWrapper extends DoubleProperty {
//        private IntegerToDoublePropertyWrapper( final IntegerProperty integerProperty ) {
//            super( (double) integerProperty.get() );
//
//            // Connect from integer to double.
//            integerProperty.addObserver( new VoidFunction1<Integer>() {
//                public void apply( Integer integerValue ) {
//                    set( (double) integerValue );
//                }
//            } );
//
//            // Connect from double to integer.
//            addObserver( new VoidFunction1<Double>() {
//                public void apply( Double doubleValue ) {
//                    integerProperty.set( (int) Math.round( doubleValue ) );
//                }
//            } );
//        }
//    }
//}
