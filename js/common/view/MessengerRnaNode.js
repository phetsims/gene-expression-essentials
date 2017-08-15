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

    MobileBiomoleculeNode.call( this, mvt, messengerRna, 2 );
    var self = this;

    // To improve performance, make the mRNA strand non-pickable, since it is a complex shape.  The bounding rectangle
    // defined below will act as the pickable portion.
    this.path.pickable = false;

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

    // handler for shape changes
    function handleShapeChanged() {
      var shapeBounds = messengerRna.bounds;
      if ( _.isFinite( shapeBounds.maxX ) ) {
        label.x = mvt.modelToViewX( shapeBounds.maxX );
        label.y = mvt.modelToViewY( shapeBounds.maxY );

        // Set the mouse and touch areas to the overall bounds to make this easier for the user to move around.
        self.mouseArea = mvt.modelToViewBounds( shapeBounds );
        self.touchArea =self.mouseArea;
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
