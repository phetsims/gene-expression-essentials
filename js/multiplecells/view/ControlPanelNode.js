// Copyright 2015, University of Colorado Boulder
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Color = require( 'SCENERY/util/Color' );
  var ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/ControllerNode' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  function ControlPanelNode( title, controllers ) {

    var controllerNodes = [];

    for( var i = 0; i < controllers.length; i++ ){
      var controller = controllers[ i ];
      var label = new Text( controller.label );
      var controllerNode = new ControllerNode(
        controller.controlProperty,
        controller.minValue,
        controller.maxValue,
        controller.minLabel,
        controller.maxLabel,
        {
          logScale: controller.logScale
        }
      );
      controllerNodes[ i ] = new VBox( {
        spacing: 5,
        children: [
          label,
          controllerNode
        ]
      })
    }

    var contentNode = new VBox( {
      spacing: 5,
      children: controllerNodes
    } );


    this.expandedProperty = new Property( true );
    AccordionBox.call( this, contentNode, {
      titleNode: new Text( title ),
      titleAlignX: 'left',
      contentAlign: 'center',
      fill: new Color( 220, 236, 255 ),
      //contentXMargin: 8,
      //contentYMargin: 4,
      expandedProperty: this.expandedProperty,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5
    } );
  }

  geneExpressionEssentials.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( AccordionBox, ControlPanelNode, {
    //TODO prototypes
  } );
} );
//package edu.colorado.phet.geneexpressionbasics.multiplecells.view;
//
//import java.awt.Color;
//import java.awt.Font;
//
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.umd.cs.piccolo.PNode;
//
///**
// * Convenience class for constructing control panels that allow users to alter
// * some of the parameters of the multi-cell protein synthesis model.  This
// * exists to make the fonts, colors, etc. consistent across panels.
// *
// * @author John Blanco
// */
//class CellParameterControlPanel extends CollapsibleControlPanel {
//
//    private static final Font TITLE_LABEL_FONT = new PhetFont( 16, true );
//    private static final Color BACKGROUND_COLOR = new Color( 220, 236, 255 );
//
//    CellParameterControlPanel( String title, PNode controls ) {
//        super( BACKGROUND_COLOR, title, TITLE_LABEL_FONT, controls );
//    }
//}
