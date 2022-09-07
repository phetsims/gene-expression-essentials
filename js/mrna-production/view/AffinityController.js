// Copyright 2015-2022, University of Colorado Boulder

/**
 * User interface control that can be used to control the affinity between a transcription factor and the DNA. Presents
 * a node with the transcription factor, an arrow, and a fragment of DNA in order to create the idea that
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import ControllerNode from '../../common/view/ControllerNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';

// constants
const ARROW_LENGTH = 30;
const ARROW_HEAD_HEIGHT = 10;

const affinityString = GeneExpressionEssentialsStrings.affinity;
const highString = GeneExpressionEssentialsStrings.high;
const lowString = GeneExpressionEssentialsStrings.low;

class AffinityController extends Node {

  /**
   * @param {Node} leftNode
   * @param {Node} rightNode
   * @param {Property} affinityProperty
   */
  constructor( leftNode, rightNode, affinityProperty ) {
    super();
    const captionNode = new Text( affinityString, {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: 180
    } );
    const arrowTail = new Vector2( 0, 0 );
    const arrowTip = new Vector2( ARROW_LENGTH, 0 );
    const arrowOptions = {
      doubleHead: true,
      headHeight: ARROW_HEAD_HEIGHT / 2,
      headWidth: ARROW_HEAD_HEIGHT,
      tailWidth: ARROW_HEAD_HEIGHT / 3
    };
    const arrowNode = new ArrowNode( arrowTail.x, arrowTail.y, arrowTip.x, arrowTip.y, arrowOptions );
    const affinityKey = new HBox( {
      children: [ new Node( { children: [ leftNode ] } ), arrowNode, new Node( { children: [ rightNode ] } ) ],
      spacing: 10
    } );
    affinityKey.setPickable( false );

    const horizontalSlider = new ControllerNode(
      affinityProperty,
      0,
      1,
      lowString,
      highString,
      { trackSize: new Dimension2( 130, 5 ) }
    );
    this.addChild( new VBox( {
      children: [ captionNode, affinityKey, horizontalSlider ],
      spacing: 10
    } ) );
  }
}

geneExpressionEssentials.register( 'AffinityController', AffinityController );
export default AffinityController;