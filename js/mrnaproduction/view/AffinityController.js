//  Copyright 2002-2015, University of Colorado Boulder
/**
 * User interface control that can be used to control the affinity between a
 * transcription factor and the DNA.  Presents a node with the transcription
 * factor, an arrow, and a fragment of DNA in order to create the idea that
 *
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HorizontalSliderWithLabelsAtEnds = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/view/HorizontalSliderWithLabelsAtEnds' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  //constants
  var ARROW_LENGTH = 30;
  var ARROW_HEAD_HEIGHT = 10;

  //strings
  var affinity = require( 'string!GENE_EXPRESSION_BASICS/affinity' );
  var low = require( 'string!GENE_EXPRESSION_BASICS/low' );
  var high = require( 'string!GENE_EXPRESSION_BASICS/high' );

  /**
   * @param {Node} leftNode
   * @param {Node} rightNode
   * @param {Property} affinityProperty
   * @constructor
   */
  function AffinityController( leftNode, rightNode, affinityProperty ) {
    var thisNode = this;
    Node.call( thisNode );
    var captionNode = new Text( affinity, new PhetFont( { size: 14, weight: 'bold' } ) );
    var arrowTail = new Vector2( 0, 0 );
    var arrowTip = new Vector2( ARROW_LENGTH, 0 );
    var arrowOptions = {
      doubleHead: true,
      headHeight: ARROW_HEAD_HEIGHT / 2,
      headWidth: ARROW_HEAD_HEIGHT,
      tailWidth: ARROW_HEAD_HEIGHT / 3
    };
    var arrowNode = new ArrowNode( arrowTail.x, arrowTail.y, arrowTip.x, arrowTip.y, arrowOptions );
    var affinityKey = new HBox( {
      children: [ leftNode, arrowNode, rightNode ],
      spacing: 10
    } );
    //affinityKey.setPickable( false ); //TODO
    //affinityKey.setChildrenPickable( false );

    var horizontalSlider = new HorizontalSliderWithLabelsAtEnds(
      affinityProperty,
      0,
      1,
      low,
      high );
    thisNode.addChild( new VBox( {
      children: [ captionNode, affinityKey, horizontalSlider ],
      spacing: 10
    } ) );
  }


  return inherit( Node, AffinityController, {} );
} );


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.mrnaproduction.view;
//
//import java.awt.Color;
//import java.awt.geom.Point2D;
//
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.simsharing.messages.UserComponent;
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.colorado.phet.common.piccolophet.nodes.DoubleArrowNode;
//import edu.colorado.phet.common.piccolophet.nodes.layout.HBox;
//import edu.colorado.phet.common.piccolophet.nodes.layout.VBox;
//import edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources;
//import edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsSimSharing.UserComponents;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PText;
//
///**
// * User interface control that can be used to control the affinity between a
// * transcription factor and the DNA.  Presents a node with the transcription
// * factor, an arrow, and a fragment of DNA in order to create the idea that
// *
// * @author John Blanco
// */
//class AffinityController extends PNode {
//
//    private static final double ARROW_LENGTH = 30;
//    private static final double ARROW_HEAD_HEIGHT = 10;
//
//    AffinityController( PNode leftNode, PNode rightNode, Property<Double> affinityProperty ) {
//        PText caption = new PText( GeneExpressionBasicsResources.Strings.AFFINITY ) {{
//            setFont( new PhetFont( 14, false ) );
//        }};
//        PNode arrowNode = new DoubleArrowNode( new Point2D.Double( 0, 0 ), new Point2D.Double( ARROW_LENGTH, 0 ), ARROW_HEAD_HEIGHT / 2, ARROW_HEAD_HEIGHT, ARROW_HEAD_HEIGHT / 3 );
//        arrowNode.setPaint( Color.BLACK );
//        PNode affinityKey = new HBox( leftNode, arrowNode, rightNode );
//        affinityKey.setPickable( false );
//        affinityKey.setChildrenPickable( false );
//        addChild( new VBox( 5,
//                            caption,
//                            affinityKey,
//                            new HorizontalSliderWithLabelsAtEnds( new UserComponent( UserComponents.transcriptionFactorLevelSlider ),
//                                                                  affinityProperty,
//                                                                  0,
//                                                                  1,
//                                                                  GeneExpressionBasicsResources.Strings.LOW,
//                                                                  GeneExpressionBasicsResources.Strings.HIGH ) ) );
//    }
//}
