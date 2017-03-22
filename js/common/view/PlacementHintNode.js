// Copyright 2015, University of Colorado Boulder

/**
 * Class for displaying placement hints, which let the user know where various things (e.g. biomolecules) can and should
 * be placed.
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
    var self = this;
    Node.call( self );

    // Create a transparent color based on the base color of the molecule.
    var transparentColor = new Color( placementHint.getBaseColor().getRed(), placementHint.getBaseColor().getGreen(),
      placementHint.getBaseColor().getBlue(), 0.4 );

    var pathStyleOptions = _.extend( HINT_STROKE, {
      fill: transparentColor,
      boundsMethod: 'unstroked'
    } );

    var path = new Path( new Shape(), pathStyleOptions );
    self.addChild( path );

    // Update the shape whenever it changes.
    placementHint.addShapeChangeObserver( function( shape ) {
      path.setShape( mvt.modelToViewShape( shape ) );
      var offset = mvt.modelToViewPosition( placementHint.getPosition() );
      path.centerX = offset.x;
      path.centerY = offset.y;
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