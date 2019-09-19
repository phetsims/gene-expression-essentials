// Copyright 2015-2017, University of Colorado Boulder

/**
 * User interface control that can be used to control the affinity between a transcription factor and the DNA. Presents
 * a node with the transcription factor, an arrow, and a fragment of DNA in order to create the idea that
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/ControllerNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const ARROW_LENGTH = 30;
  const ARROW_HEAD_HEIGHT = 10;

  // strings
  const affinityString = require( 'string!GENE_EXPRESSION_ESSENTIALS/affinity' );
  const highString = require( 'string!GENE_EXPRESSION_ESSENTIALS/high' );
  const lowString = require( 'string!GENE_EXPRESSION_ESSENTIALS/low' );

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

  return inherit( Node, AffinityController, {} );
} );
