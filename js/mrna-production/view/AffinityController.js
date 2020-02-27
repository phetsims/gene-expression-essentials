// Copyright 2015-2019, University of Colorado Boulder

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
import inherit from '../../../../phet-core/js/inherit.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ControllerNode from '../../common/view/ControllerNode.js';
import geneExpressionEssentialsStrings from '../../gene-expression-essentials-strings.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants
const ARROW_LENGTH = 30;
const ARROW_HEAD_HEIGHT = 10;

const affinityString = geneExpressionEssentialsStrings.affinity;
const highString = geneExpressionEssentialsStrings.high;
const lowString = geneExpressionEssentialsStrings.low;

/**
 * @param {Node} leftNode
 * @param {Node} rightNode
 * @param {Property} affinityProperty
 * @constructor
 */
function AffinityController( leftNode, rightNode, affinityProperty ) {
  Node.call( this );
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
    children: [ leftNode, arrowNode, rightNode ],
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

geneExpressionEssentials.register( 'AffinityController', AffinityController );

export default inherit( Node, AffinityController, {} );