//  Copyright 2002-2014, University of Colorado Boulder
/**
 *  Node that represents a cell (as in a biological organism) that changes color
 * as the level of protein within the cell changes.  The color change is
 * meant to represent a cell that is expressing a fluorescent protein,
 * something like Green Fluorescent Protein, or GFP.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Node = require( 'SCENERY/nodes/Node' );
  // constant
  var NOMINAL_FILL_COLOR = new Color( 30, 30, 40 ); // Blue Gray
  var FLORESCENT_FILL_COLOR = new Color( 200, 255, 58 );
  // private static final Stroke STROKE = new BasicStroke( 2 );
  //  private static final Color STROKE_COLOR = Color.WHITE;

  function ColorChangingCellNode() {
    Node.call( this );

  }

  return inherit( Node, ColorChangingCellNode, {}, {

    FLORESCENT_FILL_COLOR: FLORESCENT_FILL_COLOR,
    NOMINAL_FILL_COLOR: NOMINAL_FILL_COLOR


  } );


} );
//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.multiplecells.view;
//
//import java.awt.BasicStroke;
//import java.awt.Color;
//import java.awt.Stroke;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.phetcommon.view.util.ColorUtils;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.geneexpressionbasics.multiplecells.model.Cell;
//import edu.umd.cs.piccolo.PNode;
//
///**
// * Node that represents a cell (as in a biological organism) that changes color
// * as the level of protein within the cell changes.  The color change is
// * meant to represent a cell that is expressing a fluorescent protein,
// * something like Green Fluorescent Protein, or GFP.
// *
// * @author John Blanco
// */
//public class ColorChangingCellNode extends PNode {
//
//    public static final Color NOMINAL_FILL_COLOR = new Color( 30, 30, 40 ); // Blue Gray
//    public static final Color FLORESCENT_FILL_COLOR = new Color( 200, 255, 58 );
//    private static final Stroke STROKE = new BasicStroke( 2 );
//    private static final Color STROKE_COLOR = Color.WHITE;
//
//    public ColorChangingCellNode( Cell cell, ModelViewTransform mvt ) {
//        final PhetPPath cellBody = new PhetPPath( mvt.modelToView( cell.getShape() ), NOMINAL_FILL_COLOR, STROKE, STROKE_COLOR );
//        cell.proteinCount.addObserver( new VoidFunction1<Integer>() {
//            public void apply( Integer proteinCount ) {
//                double florescenceAmount = MathUtil.clamp( 0.0, ( (double) proteinCount - Cell.PROTEIN_LEVEL_WHERE_COLOR_CHANGE_STARTS ) /
//                                                                ( Cell.PROTEIN_LEVEL_WHERE_COLOR_CHANGE_COMPLETES - Cell.PROTEIN_LEVEL_WHERE_COLOR_CHANGE_STARTS ), 1.0 );
//                Color fillColor = ColorUtils.interpolateRBGA( NOMINAL_FILL_COLOR, FLORESCENT_FILL_COLOR, florescenceAmount );
//                cellBody.setPaint( fillColor );
//            }
//        } );
//        addChild( cellBody );
//    }
//}
