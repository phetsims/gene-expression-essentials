// Copyright 2015, University of Colorado Boulder

/**
 * Class for displaying placement hints, which let the user know where various
 * things (e.g. biomolecules) can and should be placed.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var HINT_STROKE_COLOR = new Color( 0, 0, 0, 100 ); // Somewhat transparent stroke.
  var HINT_STROKE = { lineWidth: 2, lineJoin: 'bevel', lineDash: [ 5, 5 ], stroke: HINT_STROKE_COLOR };


  /**
   *
   * @param {ModelViewTransform2} mvt
   * @param {PlacementHint} placementHint
   * @constructor
   */
  function PlacementHintNode( mvt, placementHint ) {
    var thisNode = this;
    Node.call( thisNode );

    // Create a transparent color based on the base color of the molecule.
    var transparentColor = new Color( placementHint.getBaseColor().getRed(), placementHint.getBaseColor().getGreen(),
      placementHint.getBaseColor().getBlue(), 0.4 );

    var pathStyleOptions = _.extend( HINT_STROKE, {
      fill: transparentColor,
      boundsMethod: 'none'
    } );

    var path = new Path( new Shape(), pathStyleOptions );
    thisNode.addChild( path );

    // Update the shape whenever it changes.
    placementHint.addShapeChangeObserver( function( shape ) {
      path.setShape( mvt.modelToViewShape( shape ) );
    } );

    // Listen to the property that indicates whether the hint is active and
    // only be visible when it is.
    placementHint.activeProperty.link( function( hintActive ) {
      path.visible = hintActive;
    } );

  }

  geneExpressionEssentials.register( 'PlacementHintNode', PlacementHintNode );

  return inherit( Node, PlacementHintNode );
} );

// Copyright 2002-2014, University of Colorado Boulder
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
//import edu.colorado.phet.geneexpressionbasics.common.model.PlacementHint;
//import edu.umd.cs.piccolo.PNode;
//
///**

// */
//public class PlacementHintNode extends PNode {
//
//    private static final Stroke HINT_STROKE = new BasicStroke( 2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 5.0f, new float[] { 5f, 5f }, 0f );
//    private static final Color HINT_STROKE_COLOR = new Color( 0, 0, 0, 100 ); // Somewhat transparent stroke.
//
//    /**
//     * Constructor.
//     *
//     * @param mvt
//     * @param placementHint
//     */
//    public PlacementHintNode( final ModelViewTransform mvt, final PlacementHint placementHint ) {
//
//        // Create a transparent color based on the base color of the molecule.
//        Color transparentColor = new Color( placementHint.getBaseColor().getRed(), placementHint.getBaseColor().getGreen(),
//                                            placementHint.getBaseColor().getBlue(), 150 );
//
//        addChild( new PhetPPath( transparentColor, HINT_STROKE, HINT_STROKE_COLOR ) {{
//            // Update the shape whenever it changes.
//            placementHint.addShapeChangeObserver( new VoidFunction1<Shape>() {
//                public void apply( Shape shape ) {
//                    setPathTo( mvt.modelToView( shape ) );
//                }
//            } );
//        }} );
//
//        // Listen to the property that indicates whether the hint is active and
//        // only be visible when it is.
//        placementHint.active.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean hintActive ) {
//                setVisible( hintActive );
//            }
//        } );
//    }
//}
