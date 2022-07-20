// Copyright 2015-2022, University of Colorado Boulder

/**
 * Class for displaying placement hints, which let the user know where various things (e.g. biomolecules) can and should
 * be placed.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Color, Node, Path } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants
const HINT_STROKE_COLOR = new Color( 0, 0, 0, 100 ); // Somewhat transparent stroke.
const HINT_STROKE = { lineJoin: 'bevel', lineDash: [ 5, 5 ], stroke: HINT_STROKE_COLOR };

class PlacementHintNode extends Node {

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {PlacementHint} placementHint
   */
  constructor( modelViewTransform, placementHint ) {

    super();

    // Create a transparent color based on the base color of the molecule.
    const transparentColor = new Color(
      placementHint.getBaseColor().getRed(),
      placementHint.getBaseColor().getGreen(),
      placementHint.getBaseColor().getBlue(),
      0.4
    );

    // create a transform that will be used to scale but not translate the placement hint's shape
    const scaleOnlyTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      modelViewTransform.getMatrix().getScaleVector().x
    );

    const pathStyleOptions = merge( HINT_STROKE, {
      lineWidth: 2,
      lineDash: [ 5, 5 ],
      fill: transparentColor,
      boundsMethod: 'unstroked'
    } );

    const path = new Path( new Shape(), pathStyleOptions );
    this.addChild( path );

    const handlePositionChanged = position => {
      this.setTranslation( modelViewTransform.modelToViewPosition( position ) );
    };

    placementHint.positionProperty.link( handlePositionChanged );

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

    this.disposePlacementHintNode = () => {
      placementHint.positionProperty.unlink( handlePositionChanged );
      placementHint.shapeProperty.unlink( handleShapeChanged );
      placementHint.activeProperty.unlink( handleActiveChanged );
    };
  }

  /**
   * @private
   */
  dispose() {
    this.disposePlacementHintNode();
    super.dispose();
  }
}

geneExpressionEssentials.register( 'PlacementHintNode', PlacementHintNode );

export default PlacementHintNode;