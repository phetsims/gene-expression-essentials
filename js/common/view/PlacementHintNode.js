// Copyright 2015, University of Colorado Boulder

/**
 * Class for displaying placement hints, which let the user know where various things (e.g. biomolecules) can and should
 * be placed.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var HINT_STROKE_COLOR = new Color( 0, 0, 0, 100 ); // Somewhat transparent stroke.
  var HINT_STROKE = { lineJoin: 'bevel', lineDash: [ 5, 5 ], stroke: HINT_STROKE_COLOR };

  /**
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {PlacementHint} placementHint
   * @constructor
   */
  function PlacementHintNode( modelViewTransform, placementHint ) {

    var self = this;
    Node.call( this );

    // Create a transparent color based on the base color of the molecule.
    var transparentColor = new Color(
      placementHint.getBaseColor().getRed(),
      placementHint.getBaseColor().getGreen(),
      placementHint.getBaseColor().getBlue(),
      0.4
    );

    // create a transform that will be used to scale but not translate the placement hint's shape
    var scaleOnlyTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      modelViewTransform.getMatrix().getScaleVector().x
    );

    var pathStyleOptions = _.extend( HINT_STROKE, {
      lineWidth: 2,
      lineDash: [  5, 5 ],
      fill: transparentColor,
      boundsMethod: 'unstroked'
    } );

    var path = new Path( new Shape(), pathStyleOptions );
    this.addChild( path );

    function handlePositionChanged( position ) {
      self.setTranslation( modelViewTransform.modelToViewPosition( position ) );
    }

    placementHint.positionProperty.link( handlePositionChanged );

    // Update the shape whenever it changes.
    placementHint.shapeProperty.link( handleShapeChanged );

    function handleShapeChanged( shape ) {
      path.setShape( scaleOnlyTransform.modelToViewShape( shape ) );
    }

    // Update the shape whenever it changes.
    placementHint.shapeProperty.link( handleShapeChanged );

    function handleActiveChanged( hintActive ) {
      path.visible = hintActive;
    }

    // Listen to the property that indicates whether the hint is active and only be visible when it is.
    placementHint.activeProperty.link( handleActiveChanged );

    this.disposePlacementHintNode = function() {
      placementHint.positionProperty.unlink( handlePositionChanged );
      placementHint.shapeProperty.unlink( handleShapeChanged );
      placementHint.activeProperty.unlink( handleActiveChanged );
    };
  }

  geneExpressionEssentials.register( 'PlacementHintNode', PlacementHintNode );

  return inherit( Node, PlacementHintNode, {

    /**
     * @private
     */
    dispose: function() {
      this.disposePlacementHintNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );