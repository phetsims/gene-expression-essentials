//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Class that represents the DNA molecule in the view.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Color = require( 'SCENERY/util/Color' );
  var GeneNode = require( 'GENE_EXPRESSION_BASICS/common/view/GeneNode' );

  // constants
  var STRAND_1_COLOR = new Color( 31, 163, 223 );
 // var STRAND_2_COLOR = new Color( 214, 87, 107 ); TODO

  // strings
  var GENE = require( 'string!GENE_EXPRESSION_BASICS/gene' );

  /**
   *
   * @param {DnaMolecule} dnaMolecule
   * @param {ModelViewTransform2} mvt
   * @param {number} backboneStrokeWidth
   * @param {boolean} showGeneBracketLabels
   * @constructor
   */
  function DnaMoleculeNode( dnaMolecule, mvt, backboneStrokeWidth, showGeneBracketLabels ) {
    var thisView = this;
    Node.call(thisView);

    // Layers for supporting the 3D look by allowing the "twist" to be depicted.
    this.dnaBackboneBackLayer = new Node();
    this.dnaBackboneFrontLayer = new Node();

    // Add the layers onto which the various nodes that represent parts of
    // the dna, the hints, etc. are placed.
    var geneBackgroundLayer = new Node();
    thisView.addChild( geneBackgroundLayer );
    thisView.addChild( this.dnaBackboneBackLayer );
    var basePairLayer = new Node();
    thisView.addChild( basePairLayer );
    thisView.addChild( this.dnaBackboneFrontLayer );

    // Put the gene backgrounds and labels behind everything.
    for ( var i = 0; i < dnaMolecule.getGenes().length; i++ ) {
      geneBackgroundLayer.addChild( new GeneNode( mvt, dnaMolecule.getGenes()[i], dnaMolecule,
        GENE + ( i + 1 ), showGeneBracketLabels ) );
    }

    // Add the first backbone strand.
    _.each( dnaMolecule.getStrand1Segments(), function( dnaStrandSegment ) {
      thisView.addStrand( mvt, dnaStrandSegment, backboneStrokeWidth, STRAND_1_COLOR );
    } );


  }

  return inherit( Node, DnaMoleculeNode );

} );
//package edu.colorado.phet.geneexpressionbasics.common.view;
//
//import java.awt.BasicStroke;
//import java.awt.Color;
//import java.awt.Shape;
//import java.awt.Stroke;
//
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.geneexpressionbasics.common.model.BasePair;
//import edu.colorado.phet.geneexpressionbasics.common.model.DnaMolecule;
//import edu.colorado.phet.geneexpressionbasics.common.model.DnaMolecule.DnaStrandSegment;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PPath;
//
//import static edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources.Strings.GENE;
//
///**
// * Class that represents the DNA molecule in the view.
// *
// * @author John Blanco
// */
//public class DnaMoleculeNode extends PNode {
//
//    private static final Color STRAND_1_COLOR = new Color( 31, 163, 223 );
//    private static final Color STRAND_2_COLOR = new Color( 214, 87, 107 );
//
//    // Layers for supporting the 3D look by allowing the "twist" to be depicted.
//    private final PNode dnaBackboneBackLayer = new PNode();
//    private final PNode dnaBackboneFrontLayer = new PNode();
//
//    public DnaMoleculeNode( DnaMolecule dnaMolecule, ModelViewTransform mvt, float backboneStrokeWidth, boolean showGeneBracketLabels ) {
//
//        // Add the layers onto which the various nodes that represent parts of
//        // the dna, the hints, etc. are placed.
//        PNode geneBackgroundLayer = new PNode();
//        addChild( geneBackgroundLayer );
//        addChild( dnaBackboneBackLayer );
//        PNode basePairLayer = new PNode();
//        addChild( basePairLayer );
//        addChild( dnaBackboneFrontLayer );
//
//        // Put the gene backgrounds and labels behind everything.
//        for ( int i = 0; i < dnaMolecule.getGenes().size(); i++ ) {
//            geneBackgroundLayer.addChild( new GeneNode( mvt, dnaMolecule.getGenes().get( i ), dnaMolecule, GENE + ( i + 1 ), showGeneBracketLabels ) );
//        }
//
//        // Add the first backbone strand.
//        for ( DnaStrandSegment dnaStrandSegment : dnaMolecule.getStrand1Segments() ) {
//            addStrand( mvt, dnaStrandSegment, new BasicStroke( backboneStrokeWidth ), STRAND_1_COLOR );
//        }
//
//        // Add the other backbone strand.
//        for ( DnaStrandSegment dnaStrandSegment : dnaMolecule.getStrand2Segments() ) {
//            addStrand( mvt, dnaStrandSegment, new BasicStroke( backboneStrokeWidth ), STRAND_2_COLOR );
//        }
//
//        // Add the base pairs.
//        for ( BasePair basePair : dnaMolecule.getBasePairs() ) {
//            basePairLayer.addChild( new PhetPPath( mvt.modelToView( basePair.getShape() ), Color.DARK_GRAY ) );
//        }
//    }
//
//    private void addStrand( ModelViewTransform mvt, DnaStrandSegment dnaStrandSegment, Stroke strandSegmentStroke, Color color ) {
//        PNode segmentNode = new DnaStrandSegmentNode( dnaStrandSegment, mvt, strandSegmentStroke, color );
//        if ( dnaStrandSegment.inFront ) {
//            dnaBackboneFrontLayer.addChild( segmentNode );
//        }
//        else {
//            dnaBackboneBackLayer.addChild( segmentNode );
//        }
//    }
//
//    private class DnaStrandSegmentNode extends PNode {
//        private DnaStrandSegmentNode( final DnaStrandSegment dnaStrandSegment, final ModelViewTransform mvt, Stroke strandSegmentStroke, Color color ) {
//            final PPath pathNode = new PhetPPath( strandSegmentStroke, color );
//            addChild( pathNode );
//            dnaStrandSegment.addShapeChangeObserver( new VoidFunction1<Shape>() {
//                public void apply( Shape shape ) {
//                    pathNode.setPathTo( mvt.modelToView( shape ) );
//                }
//            } );
//        }
//    }
//}
