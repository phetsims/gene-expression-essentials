// Copyright 2015, University of Colorado Boulder
/**
 * User interface control that can be used to control the affinity between a transcription factor and the DNA. Presents
 * a node with the transcription factor, an arrow, and a fragment of DNA in order to create the idea that
 *
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/ControllerNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  //constants
  var ARROW_LENGTH = 30;
  var ARROW_HEAD_HEIGHT = 10;

  //strings
  var affinityString = require( 'string!GENE_EXPRESSION_ESSENTIALS/affinity' );
  var lowString = require( 'string!GENE_EXPRESSION_ESSENTIALS/low' );
  var highString = require( 'string!GENE_EXPRESSION_ESSENTIALS/high' );

  /**
   * @param {Node} leftNode
   * @param {Node} rightNode
   * @param {Property} affinityProperty
   * @constructor
   */
  function AffinityController( leftNode, rightNode, affinityProperty ) {
    var self = this;
    Node.call( self );
    var captionNode = new Text( affinityString, {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: 180
    } );
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
    affinityKey.setPickable( false );

    var horizontalSlider = new ControllerNode(
      affinityProperty,
      0,
      1,
      lowString,
      highString,{
        trackSize: new Dimension2( 130, 5 )
      } );
    self.addChild( new VBox( {
      children: [ captionNode, affinityKey, horizontalSlider ],
      spacing: 10
    } ) );
  }

  geneExpressionEssentials.register( 'AffinityController', AffinityController );

  return inherit( Node, AffinityController, {} );
} );
