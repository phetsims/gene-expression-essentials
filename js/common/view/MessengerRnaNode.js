// Copyright 2015, University of Colorado Boulder

/**
 * View representation for messenger RNA. This is done differently from most if not all of the other mobile biomolecules
 * because it is represented as an unclosed shape.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var quotedMRnaString = require( 'string!GENE_EXPRESSION_ESSENTIALS/quotedMRna' );

  /**
   * @param {ModelViewTransform2} mvt
   * @param {MessengerRna} messengerRna
   * @constructor
   */
  function MessengerRnaNode( mvt, messengerRna ) {
    var self = this;
    MobileBiomoleculeNode.call( self, mvt, messengerRna, 2 );

    // Add placement hints that show where ribosomes and mRNA destroyers could be attached.
    var ribosomePlacementHintNode = new PlacementHintNode( mvt, messengerRna.ribosomePlacementHint );
    var mRnaDestroyerPlacementHintNode = new PlacementHintNode( mvt, messengerRna.mRnaDestroyerPlacementHint );
    self.addChild( ribosomePlacementHintNode );
    self.addChild( mRnaDestroyerPlacementHintNode );

    // Add the label. This fades in during synthesis, then fades out.
    var label = new FadeLabel( quotedMRnaString, false, messengerRna.existenceStrengthProperty );
    self.addChild( label );

    function handleBeingSynthesizedChanged( beingSynthesized ) {
      if ( beingSynthesized ) {
        label.startFadeIn( 3000 ); // Fade time chosen empirically.
      }
      else {
        label.startFadeOut( 1000 ); // Fade time chosen empirically.
      }
    }

    messengerRna.beingSynthesizedProperty.link( handleBeingSynthesizedChanged );

    var boundingRectangle = new Rectangle( new Bounds2( 0, 0, 0, 0 ) );
    self.addChild( boundingRectangle );

    function handleShapeChanged( shape ) {
      var shapeBounds = messengerRna.bounds;
      var upperRightCornerPos = mvt.modelToViewPosition( new Vector2( shapeBounds.maxX, shapeBounds.maxY ) );
      if ( _.isFinite( upperRightCornerPos.x ) ) {
        label.x = upperRightCornerPos.x;
        label.y = upperRightCornerPos.y;
        boundingRectangle.setRectBounds( mvt.modelToViewBounds( shapeBounds ) );
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
