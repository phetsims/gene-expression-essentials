// Copyright 2015, University of Colorado Boulder

/**
 * View representation for messenger RNA. This is done differently from most if not all of the other mobile biomolecules
 * because it is represented as an unclosed shape.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var FadeLabel = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/FadeLabel' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PlacementHintNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/PlacementHintNode' );
  // TODO: Decide whether to completely remove the bounding rect or use a query param to aid in debugging
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var quotedMRnaString = require( 'string!GENE_EXPRESSION_ESSENTIALS/quotedMRna' );

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {MessengerRna} messengerRna
   * @constructor
   */
  function MessengerRnaNode( modelViewTransform, messengerRna ) {

    MobileBiomoleculeNode.call( this, modelViewTransform, messengerRna, { lineWidth: 2 } );
    var self = this;

    // Add placement hints that show where ribosomes and mRNA destroyers can be attached.  Placement hint node, like
    // other mobile biomolecule nodes, are designed to position themselves, but we don't want that to happen here since
    // they are child nodes, so a compensated model-view transform is needed.
    var scaleOnlyTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      modelViewTransform.getMatrix().getScaleVector().x
    );
    var ribosomePlacementHintNode = new PlacementHintNode( scaleOnlyTransform, messengerRna.ribosomePlacementHint );
    var mRnaDestroyerPlacementHintNode = new PlacementHintNode( scaleOnlyTransform, messengerRna.mRnaDestroyerPlacementHint );
    this.addChild( ribosomePlacementHintNode );
    this.addChild( mRnaDestroyerPlacementHintNode );

    // Add the label. This fades in during synthesis, then fades out.
    var label = new FadeLabel( quotedMRnaString, false, messengerRna.existenceStrengthProperty );
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
    // var rect = new Rectangle( 0, 0, 0.1, 0.1, { fill: 'rgba( 256, 256, 0, 0.5 )' } );
    // this.addChild( rect );

    // handler for shape changes
    function handleShapeChanged( shape ) {
      var shapeBounds = shape.bounds;
      if ( shapeBounds.isFinite() ) {
        var scaledShapeBounds = self.scaleOnlyModelViewTransform.modelToViewShape( shapeBounds );
        // rect.setRectBounds( scaledShapeBounds );

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

  return inherit( MobileBiomoleculeNode, MessengerRnaNode, {

    /**
     * @public
     */
    dispose: function() {
      this.disposeMessengerRnaNode();
      MobileBiomoleculeNode.prototype.dispose.call( this );
    }
  } );
} );
