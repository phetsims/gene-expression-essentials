// Copyright 2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Color = require( 'SCENERY/util/Color' );
  var ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/ControllerNode' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  function ControlPanelNode( title, controllers ) {

    var controllerNodes = [];

    for( var i = 0; i < controllers.length; i++ ){
      var controller = controllers[ i ];
      var label = new Text( controller.label, {
        font: new PhetFont( { size: 13 } ),
        maxWidth: 200
      } );
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
      });
    }

    var contentNode = new VBox( {
      spacing: 5,
      children: controllerNodes
    } );


    this.expandedProperty = new Property( false );
    AccordionBox.call( this, contentNode, {
      titleNode: new Text( title, {
        font: new PhetFont( { size: 16, weight: 'bold' }),
        maxWidth: 200
      } ),
      titleAlignX: 'left',
      contentAlign: 'center',
      fill: new Color( 220, 236, 255 ),
      buttonXMargin: 10,
      buttonYMargin: 10,
      //contentXMargin: 10,
      contentYMargin: 10,
      expandedProperty: this.expandedProperty,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      minWidth: 200
    } );
  }

  geneExpressionEssentials.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( AccordionBox, ControlPanelNode, {} );
} );
