// Copyright 2015-2022, University of Colorado Boulder

/**
 * Base class for displaying and interacting with mobile biomolecules. In essence, this observes the shape of the
 * biomolecule, which changes as it moves.
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
import RnaPolymerase from '../model/RnaPolymerase.js';
import GradientUtils from '../util/GradientUtils.js';
import BiomoleculeDragHandler from './BiomoleculeDragHandler.js';

class MobileBiomoleculeNode extends Node {

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {MobileBiomolecule} mobileBiomolecule
   * @param {Object} [options]
   */
  constructor( modelViewTransform, mobileBiomolecule, options ) {
    super( { cursor: 'pointer' } );
    options = merge( {
      lineWidth: 1
    }, options );

    // @protected (read-only) {ModelViewTransform2} - scale-only transform for scaling the shape without translation
    this.scaleOnlyModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      modelViewTransform.getMatrix().getScaleVector().x
    );

    // @protected {Path} - main path that represents the biomolecule
    this.shapeNode = new Path( new Shape(), {
      stroke: Color.BLACK,
      lineWidth: options.lineWidth,
      lineJoin: 'round'
    } );

    this.addChild( this.shapeNode );

    // update the shape whenever it changes
    const handleShapeChanged = shape => {

      // update the shape
      this.shapeNode.shape = null;
      const transformedShape = this.scaleOnlyModelViewTransform.modelToViewShape( shape );
      this.shapeNode.setShape( transformedShape );
      this.mouseArea = transformedShape.bounds.dilated( 2 );
      this.touchArea = transformedShape.bounds.dilated( 5 );
    };

    mobileBiomolecule.shapeProperty.link( handleShapeChanged );

    // update this node's position when the corresponding model element moves
    const handlePositionChanged = position => {
      this.setTranslation( modelViewTransform.modelToViewPosition( position ) );
    };

    mobileBiomolecule.positionProperty.link( handlePositionChanged );

    const handleColorChanged = color => {

      // see the comment above on gradientPaint
      if ( this.shapeNode.shape.bounds.isFinite() ) {
        this.shapeNode.fill = GradientUtils.createGradientPaint( this.shapeNode.shape, color );
      }
    };

    // Update the color whenever it changes.
    mobileBiomolecule.colorProperty.link( handleColorChanged );

    const handleExistenceStrengthChanged = existenceStrength => {
      assert && assert( existenceStrength >= 0 && existenceStrength <= 1 ); // Bounds checking.
      this.setOpacity( Math.min( Number( existenceStrength ), 1 + mobileBiomolecule.zPositionProperty.get() ) );
    };

    // Update its existence strength (i.e. fade level) whenever it changes.
    mobileBiomolecule.existenceStrengthProperty.link( handleExistenceStrengthChanged );

    const handleZPositionChanged = zPosition => {
      assert && assert( zPosition >= -1 && zPosition <= 0 ); // Parameter checking.

      // The further back the biomolecule is, the more transparent it is in order to make it look more distant.
      this.setOpacity( Math.min( 1 + zPosition, mobileBiomolecule.existenceStrengthProperty.get() ) );

      // Also, as it goes further back, this node is scaled down a bit, also to make it look further away.
      this.setScaleMagnitude( 1 );
      this.setScaleMagnitude( 1 + 0.15 * zPosition );
    };

    // Update the "closeness" whenever it changes.
    mobileBiomolecule.zPositionProperty.link( handleZPositionChanged );

    const handleAttachedToDnaChanged = attachedToDna => {
      if ( mobileBiomolecule instanceof RnaPolymerase && attachedToDna ) {
        this.moveToBack();
      }
    };

    // If a polymerase molecule attaches to the DNA strand, move it to the back of its current layer so that nothing can
    // go between it and the DNA molecule. Otherwise odd-looking things can happen.
    mobileBiomolecule.attachedToDnaProperty.link( handleAttachedToDnaChanged );

    // @public (read-only) {DragListener} - drag handling
    this.dragHandler = new BiomoleculeDragHandler( mobileBiomolecule, modelViewTransform );
    this.addInputListener( this.dragHandler );

    const handleMovableByUserChanged = movableByUser => {
      this.setPickable( movableByUser );
    };

    // interactivity control
    mobileBiomolecule.movableByUserProperty.link( handleMovableByUserChanged );

    const handleUserControlledChanged = userControlled => {
      this.moveToFront();
    };

    // Move this biomolecule to the top of its layer when grabbed.
    mobileBiomolecule.userControlledProperty.link( handleUserControlledChanged );

    this.disposeMobileBiomoleculeNode = () => {
      mobileBiomolecule.positionProperty.unlink( handlePositionChanged );
      mobileBiomolecule.shapeProperty.unlink( handleShapeChanged );
      mobileBiomolecule.colorProperty.unlink( handleColorChanged );
      mobileBiomolecule.existenceStrengthProperty.unlink( handleExistenceStrengthChanged );
      mobileBiomolecule.zPositionProperty.unlink( handleZPositionChanged );
      mobileBiomolecule.attachedToDnaProperty.unlink( handleAttachedToDnaChanged );
      this.removeInputListener( this.dragHandler );
      this.dragHandler.dispose();
      mobileBiomolecule.movableByUserProperty.unlink( handleMovableByUserChanged );
      mobileBiomolecule.userControlledProperty.unlink( handleUserControlledChanged );
      this.shapeNode.shape = null;
      this.shapeNode.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeMobileBiomoleculeNode();
    super.dispose();
  }
}

geneExpressionEssentials.register( 'MobileBiomoleculeNode', MobileBiomoleculeNode );

export default MobileBiomoleculeNode;