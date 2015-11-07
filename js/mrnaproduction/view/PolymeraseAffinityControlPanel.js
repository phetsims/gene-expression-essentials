// Copyright 2015, University of Colorado Boulder

/**
 * Control panel that present a user interface for controlling the affinity
 * of RNA polymerase to DNA plus a transcription factor.
 *
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_BASICS/common/model/TranscriptionFactor' );
  var DnaMoleculeNode = require( 'GENE_EXPRESSION_BASICS/common/view/DnaMoleculeNode' );
  var DnaMolecule = require( 'GENE_EXPRESSION_BASICS/common/model/DnaMolecule' );
  var AffinityController = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/view/AffinityController' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_BASICS/common/model/RnaPolymerase' );
  var CommonConstants = require( 'GENE_EXPRESSION_BASICS/common/model/CommonConstants' );
  var SpacerNode = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/view/SpacerNode' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_BASICS/common/view/MobileBiomoleculeNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  var POLYMERASE_SCALE = 0.08;
  var POLYMERASE_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
    new Vector2( 0, 0 ), POLYMERASE_SCALE );
  var DNA_AND_TF_SCALE = 0.08;
  var DNA_AND_TF_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
    new Vector2( 0, 0 ), DNA_AND_TF_SCALE );

  //strings
  var rnaPolymeraseText = require( 'string!GENE_EXPRESSION_BASICS/rnaPolymerase' );


  /**
   *
   * @param {TranscriptionFactorConfig} tfConfig
   * @param {Number} minHeight
   * @param {Property} affinityProperty
   * @constructor
   */
  function PolymeraseAffinityControlPanel( tfConfig, minHeight, polymeraseAffinityProperty ) {
    var thisNode = this;


    var titleNode = new Text( rnaPolymeraseText, TITLE_FONT );


    // Create the affinity control node.
    // REVIEW: why do we need to pass a MVT into biomolecule nodes in general? I've found it simpler to apply the transformation to the PNode
    // itself, and then place mouse-interaction code at a location like this in a double-brace block if it needs to know the transform information.
    // This way, not every node has to be passed a transform. Are there specific exceptions in this case that prevent that from being useful?
    var polymeraseNode = new MobileBiomoleculeNode( POLYMERASE_MVT, new RnaPolymerase() );
    var dnaFragmentNode = new DnaMoleculeNode( new DnaMolecule( null, CommonConstants.BASE_PAIRS_PER_TWIST * 2 + 1, 0.0, true ), DNA_AND_TF_MVT, 2, false );
    var transcriptionFactorNode = new MobileBiomoleculeNode( DNA_AND_TF_MVT, new TranscriptionFactor( null, tfConfig ) );
    transcriptionFactorNode.x = 25;
    transcriptionFactorNode.y = 0; // Set position to be on top of the dna, values empirically determined.
    dnaFragmentNode.addChild( transcriptionFactorNode );

    // Create the spacers used to make the panel meet the min size.
    var topSpacer = new SpacerNode();
    var bottomSpacer = new SpacerNode();

    // In order to size the control panel correctly, make one first, see
    // how far off it is, and then make one of the correct size.
    //var dummyContents = new VBox( { TODO
    //    children: [ titleNode, topSpacer,
    //      new AffinityController( polymeraseNode, dnaFragmentNode, new Property( 0 ) ),
    //      bottomSpacer
    //    ],
    //    spacing: 20
    //  }
    //);


    // var dummyControlPanel =  Panel.call( thisNode, dummyContents ); TODO
    //
    //
    //
    //var  growthAmount = minHeight - dummyControlPanel.bounds.height;
    //
    //  topSpacer.setSize(SpacerNode.MIN_DIMENSION, growthAmount * 0.25);
    //  bottomSpacer.setSize(SpacerNode.MIN_DIMENSION, growthAmount * 0.75);

    var contents = new VBox( {
        children: [ titleNode, topSpacer,
          new AffinityController( polymeraseNode, dnaFragmentNode, polymeraseAffinityProperty ),
          bottomSpacer
        ],
        spacing: 20
      }
    );

    Panel.call( thisNode, contents, {
      fill: new Color( 250, 250, 250 ),
      lineWidth: 2
    } );

  }

  return inherit( Panel, PolymeraseAffinityControlPanel );

} );


// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.mrnaproduction.view;
//
//import java.awt.Color;
//import java.awt.geom.Point2D;
//import java.awt.geom.Rectangle2D;
//
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.colorado.phet.common.piccolophet.nodes.ControlPanelNode;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.common.piccolophet.nodes.layout.VBox;
//import edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources;
//import edu.colorado.phet.geneexpressionbasics.common.model.DnaMolecule;
//import edu.colorado.phet.geneexpressionbasics.common.model.RnaPolymerase;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor.TranscriptionFactorConfig;
//import edu.colorado.phet.geneexpressionbasics.common.view.DnaMoleculeNode;
//import edu.colorado.phet.geneexpressionbasics.common.view.MobileBiomoleculeNode;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PPath;
//import edu.umd.cs.piccolo.nodes.PText;
//
///**
// * Control panel that present a user interface for controlling the affinity
// * of RNA polymerase to DNA plus a transcription factor.
// *
// * @author John Blanco
// */
//public class PolymeraseAffinityControlPanel extends PNode {
//
//    //-------------------------------------------------------------------------
//    // Class Data
//    //-------------------------------------------------------------------------
//
//    private static final double POLYMERASE_SCALE = 0.08;
//    private static final ModelViewTransform POLYMERASE_MVT = ModelViewTransform.createSinglePointScaleInvertedYMapping( new Point2D.Double( 0, 0 ),
//                                                                                                                        new Point2D.Double( 0, 0 ),
//                                                                                                                        POLYMERASE_SCALE );
//    private static final double DNA_AND_TF_SCALE = 0.08;
//    private static final ModelViewTransform DNA_AND_TF_MVT = ModelViewTransform.createSinglePointScaleInvertedYMapping( new Point2D.Double( 0, 0 ),
//                                                                                                                        new Point2D.Double( 0, 0 ),
//                                                                                                                        DNA_AND_TF_SCALE );
//    //-------------------------------------------------------------------------
//    // Constructor(s)
//    //-------------------------------------------------------------------------
//
//    public PolymeraseAffinityControlPanel( TranscriptionFactorConfig tfConfig, double minHeight, Property<Double> polymeraseAffinityProperty ) {
//
//        // Create the title.
//        PNode title = new PText( GeneExpressionBasicsResources.Strings.RNA_POLYMERASE ) {{
//            setFont( new PhetFont( 16, true ) );
//        }};
//
//        // Create the affinity control node.
//        // REVIEW: why do we need to pass a MVT into biomolecule nodes in general? I've found it simpler to apply the transformation to the PNode
//        // itself, and then place mouse-interaction code at a location like this in a double-brace block if it needs to know the transform information.
//        // This way, not every node has to be passed a transform. Are there specific exceptions in this case that prevent that from being useful?
//        PNode polymeraseNode = new MobileBiomoleculeNode( POLYMERASE_MVT, new RnaPolymerase() );
//        PNode dnaFragmentNode = new DnaMoleculeNode( new DnaMolecule( DnaMolecule.BASE_PAIRS_PER_TWIST * 2 + 1, 0.0, true ), DNA_AND_TF_MVT, 2, false );
//        PNode transcriptionFactorNode = new MobileBiomoleculeNode( DNA_AND_TF_MVT, new TranscriptionFactor( tfConfig ) );
//        transcriptionFactorNode.setOffset( 25, 0 ); // Set position to be on top of the dna, values empirically determined.
//        dnaFragmentNode.addChild( transcriptionFactorNode );
//
//        // Create the spacers used to make the panel meet the min size.
//        SpacerNode topSpacer = new SpacerNode();
//        SpacerNode bottomSpacer = new SpacerNode();
//
//        // In order to size the control panel correctly, make one first, see
//        // how far off it is, and then make one of the correct size.
//        PNode dummyContents = new VBox(
//                20,
//                title,
//                topSpacer,
//                new AffinityController( polymeraseNode, dnaFragmentNode, new Property<Double>( 0.0 ) ),
//                bottomSpacer
//        );
//
//        ControlPanelNode dummyControlPanel = new ControlPanelNode( dummyContents );
//
//        double growthAmount = minHeight - dummyControlPanel.getFullBoundsReference().height;
//
//        topSpacer.setSize( SpacerNode.MIN_DIMENSION, growthAmount * 0.25 );
//        bottomSpacer.setSize( SpacerNode.MIN_DIMENSION, growthAmount * 0.75 );
//
//        PNode contents = new VBox(
//                20,
//                title,
//                topSpacer,
//                new AffinityController( polymeraseNode, dnaFragmentNode, polymeraseAffinityProperty ),
//                bottomSpacer
//        );
//
//        ControlPanelNode controlPanel = new ControlPanelNode( contents );
//
//        addChild( controlPanel );
//    }
//
//    //-------------------------------------------------------------------------
//    // Inner Classes and Interfaces
//    //-------------------------------------------------------------------------
//
//    private static class SpacerNode extends PNode {
//
//        private static final double MIN_DIMENSION = 1E-7;
//
//        private final PPath spacer;
//
//        public SpacerNode() {
//            this( MIN_DIMENSION, MIN_DIMENSION );
//        }
//
//        public SpacerNode( double width, double height ) {
//            spacer = new PhetPPath( new Rectangle2D.Double( 0, 0, width, height ), new Color( 0, 0, 0, 0 ) );
//            addChild( spacer );
//        }
//
//        public void setSize( double width, double height ) {
//            spacer.setPathTo( new Rectangle2D.Double( 0, 0, width, height ) );
//        }
//    }
//}
