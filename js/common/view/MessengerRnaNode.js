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
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var PlacementHintNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/PlacementHintNode' );
  var FadeLabel = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/FadeLabel' );

  // constants
  // For debug - turn on to show the enclosing shape segments.
  //  var SHOW_SHAPE_SEGMENTS = false; TODO
  var quotedMRnaString = require( 'string!GENE_EXPRESSION_ESSENTIALS/quotedMRna' );

  /**
   *
   * @param {ModelViewTransform2} mvt
   * @param {MessengerRna} messengerRna
   * @constructor
   */
  function MessengerRnaNode( mvt, messengerRna ) {
    var self = this;
    MobileBiomoleculeNode.call( self, mvt, messengerRna, 2 );

    // Add placement hints that show where ribosomes and mRNA destroyers could be attached.
    self.addChild( new PlacementHintNode( mvt, messengerRna.ribosomePlacementHint ) );
    self.addChild( new PlacementHintNode( mvt, messengerRna.mRnaDestroyerPlacementHint ) );

    // Add the label. This fades in during synthesis, then fades out.
    var label = new FadeLabel( quotedMRnaString, false, messengerRna.existenceStrengthProperty );
    self.addChild( label );
    messengerRna.beingSynthesizedProperty.link( function( beingSynthesized ) {
      if ( beingSynthesized ) {
        label.startFadeIn( 3000 ); // Fade time chosen empirically.
      }
      else {
        label.startFadeOut( 1000 ); // Fade time chosen empirically.
      }
    } );

    // Update the label position as the shape changes.
    messengerRna.shapeProperty.lazyLink( function( shape ) {
      var shapeBounds = shape.bounds;
      var upperRightCornerPos = mvt.modelToViewPosition( new Vector2( shapeBounds.maxX, shapeBounds.maxY ) );
      label.x = upperRightCornerPos.x;
      label.y = upperRightCornerPos.y;
    } );

  }

  geneExpressionEssentials.register( 'MessengerRnaNode', MessengerRnaNode );

  return inherit( MobileBiomoleculeNode, MessengerRnaNode, {} );

} );
