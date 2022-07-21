// Copyright 2016-2022, University of Colorado Boulder

/**
 * Class for constructing accordion boxes containing control panels that allow users to alter some of the parameters of
 * the multi-cell protein synthesis model. This class makes sure fonts, colors, etc. are consistent across panels.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import GEEConstants from '../../common/GEEConstants.js';
import ControllerNode from '../../common/view/ControllerNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class ParameterControlAccordionBox extends AccordionBox {

  /**
   * @param {String} title
   * @param {Array.<Object>}controllers
   */
  constructor( title, controllers ) {

    const controllerNodes = [];

    for ( let i = 0; i < controllers.length; i++ ) {
      const controller = controllers[ i ];
      const label = new Text( controller.label, {
        font: new PhetFont( { size: 13 } ),
        maxWidth: 200
      } );
      const controllerNode = new ControllerNode(
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
      } );
    }

    const contentNode = new VBox( {
      spacing: 5,
      children: controllerNodes
    } );

    super( contentNode, {
      titleNode: new Text( title, {
        font: new PhetFont( { size: 16, weight: 'bold' } ),
        maxWidth: 200
      } ),
      cornerRadius: GEEConstants.CORNER_RADIUS,
      titleAlignX: 'left',
      contentAlign: 'center',
      fill: new Color( 220, 236, 255 ),
      buttonXMargin: 6,
      buttonYMargin: 6,
      contentYMargin: 8,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 8,
        touchAreaYDilation: 8
      },
      minWidth: 200
    } );
  }
}

geneExpressionEssentials.register( 'ParameterControlAccordionBox', ParameterControlAccordionBox );
export default ParameterControlAccordionBox;