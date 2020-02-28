// Copyright 2015-2020, University of Colorado Boulder

/**
 * View representation for messenger RNA. This is done differently from most if not all of the other mobile biomolecules
 * because it is represented as an unclosed shape.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import geneExpressionEssentialsStrings from '../../gene-expression-essentials-strings.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GEEQueryParameters from '../GEEQueryParameters.js';
import FadeLabel from './FadeLabel.js';
import MobileBiomoleculeNode from './MobileBiomoleculeNode.js';
import PlacementHintNode from './PlacementHintNode.js';

const quotedMRnaString = geneExpressionEssentialsStrings.quotedMRna;

/**
 * @param {ModelViewTransform2} modelViewTransform
 * @param {MessengerRna} messengerRna
 * @constructor
 */
function MessengerRnaNode( modelViewTransform, messengerRna ) {

  MobileBiomoleculeNode.call( this, modelViewTransform, messengerRna, { lineWidth: 2 } );
  const self = this;

  // Add placement hints that show where ribosomes and mRNA destroyers can be attached.  Placement hint node, like
  // other mobile biomolecule nodes, are designed to position themselves, but we don't want that to happen here since
  // they are child nodes, so a compensated model-view transform is needed.
  const scaleOnlyTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
    Vector2.ZERO,
    Vector2.ZERO,
    modelViewTransform.getMatrix().getScaleVector().x
  );
  const ribosomePlacementHintNode = new PlacementHintNode( scaleOnlyTransform, messengerRna.ribosomePlacementHint );
  const mRnaDestroyerPlacementHintNode = new PlacementHintNode(
    scaleOnlyTransform,
    messengerRna.mRnaDestroyerPlacementHint
  );
  this.addChild( ribosomePlacementHintNode );
  this.addChild( mRnaDestroyerPlacementHintNode );

  // Add the label. This fades in during synthesis, then fades out.
  const label = new FadeLabel( quotedMRnaString, false, messengerRna.existenceStrengthProperty );
  this.addChild( label );

  // handler function for changes to the "being synthesized" state
  function handleBeingSynthesizedChanged( beingSynthesized ) {
    if ( beingSynthesized ) {
      label.startFadeIn( 3000 ); // Fade time chosen empirically.
    }
    else {
      label.startFadeOut( 1000 ); // Fade time chosen empirically.
    }
  }

  messengerRna.beingSynthesizedProperty.link( handleBeingSynthesizedChanged );

  // To improve performance, the bounds method for the main path is set to 'none' here so that the bounds aren't
  // computed on changes, and the local bounds are explicitly set below when the model shape changes.
  this.shapeNode.boundsMethod = 'none';
  this.shapeNode.localBounds = new Bounds2( 0, 0, 0.1, 0.1 ); // add some initial arbitrary bounds to avoid positioning issues
  if ( GEEQueryParameters.showMRnaBoundingRect ) {
    var rect = new Rectangle( 0, 0, 0.1, 0.1, { fill: 'rgba( 256, 256, 0, 0.5 )' } );
    this.addChild( rect );
  }

  // handler for shape changes
  function handleShapeChanged( shape ) {
    const shapeBounds = shape.bounds;
    if ( shapeBounds.isFinite() ) {
      const scaledShapeBounds = self.scaleOnlyModelViewTransform.modelToViewShape( shapeBounds );
      rect && rect.setRectBounds( scaledShapeBounds );

      // position the label
      label.left = scaledShapeBounds.maxX;
      label.y = scaledShapeBounds.minY;

      // set the mouse and touch areas to the overall bounds to make this easier for the user to move around
      self.mouseArea = scaledShapeBounds;
      self.touchArea = scaledShapeBounds;

      // explicitly set the local bounds of the main shape path - improves performance
      self.shapeNode.localBounds = scaledShapeBounds;
    }
  }

  // Update the label position as the shape changes.
  messengerRna.shapeProperty.lazyLink( handleShapeChanged );

  this.disposeMessengerRnaNode = function() {
    messengerRna.beingSynthesizedProperty.unlink( handleBeingSynthesizedChanged );
    messengerRna.shapeProperty.unlink( handleShapeChanged );
    ribosomePlacementHintNode.dispose();
    mRnaDestroyerPlacementHintNode.dispose();
  };
}

geneExpressionEssentials.register( 'MessengerRnaNode', MessengerRnaNode );

export default inherit( MobileBiomoleculeNode, MessengerRnaNode, {

  /**
   * @public
   */
  dispose: function() {
    this.disposeMessengerRnaNode();
    MobileBiomoleculeNode.prototype.dispose.call( this );
  }
} );