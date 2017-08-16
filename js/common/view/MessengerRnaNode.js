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
  var PlacementHintNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/PlacementHintNode' );

  // strings
  var quotedMRnaString = require( 'string!GENE_EXPRESSION_ESSENTIALS/quotedMRna' );

  /**
   * @param {ModelViewTransform2} mvt
   * @param {MessengerRna} messengerRna
   * @constructor
   */
  function MessengerRnaNode( mvt, messengerRna ) {

    MobileBiomoleculeNode.call( this, mvt, messengerRna, { lineWidth: 2 } );
    var self = this;

    // Add placement hints that show where ribosomes and mRNA destroyers can be attached.
    var ribosomePlacementHintNode = new PlacementHintNode( mvt, messengerRna.ribosomePlacementHint );
    var mRnaDestroyerPlacementHintNode = new PlacementHintNode( mvt, messengerRna.mRnaDestroyerPlacementHint );
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

    // handler for shape changes
    function handleShapeChanged( shape ) {
      var shapeBounds = messengerRna.bounds;
      if ( shapeBounds.isFinite() ) {
        var actualTransformedShapeBounds = mvt.modelToViewBounds( shape.bounds );
        var transformedShapeBounds = mvt.modelToViewBounds( shapeBounds );

        // position the label
        label.left = transformedShapeBounds.maxX;
        label.y = transformedShapeBounds.minY;

        // set the mouse and touch areas to the overall bounds to make this easier for the user to move around
        self.mouseArea = transformedShapeBounds;
        self.touchArea = transformedShapeBounds;

        // explicitly set the local bounds of the main shape path - improves performance
        self.shapeNode.localBounds = actualTransformedShapeBounds;
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
