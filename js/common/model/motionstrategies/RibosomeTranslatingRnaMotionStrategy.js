// Copyright 2015, University of Colorado Boulder
/**
 /**
 * This class defines a very specific motion strategy used by a ribosome to
 * follow the translation attachment point of a strand of mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/MotionStrategy' );
  var GeneExpressionRibosomeConstant = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GeneExpressionRibosomeConstant' );

  /**
   * @param ribosome {Ribosome}
   * @constructor
   */
  function RibosomeTranslatingRnaMotionStrategy( ribosome ) {
    MotionStrategy.call( this );
    this.ribosome = ribosome;
    this.messengerRna = ribosome.getMessengerRnaBeingTranslated();
  }

  geneExpressionEssentials.register( 'RibosomeTranslatingRnaMotionStrategy', RibosomeTranslatingRnaMotionStrategy );

  return inherit( MotionStrategy, RibosomeTranslatingRnaMotionStrategy, {

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      var ribosomeAttachmentPoint = this.messengerRna.getRibosomeAttachmentLocation( this.ribosome );
      return ribosomeAttachmentPoint.minus( GeneExpressionRibosomeConstant.OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE );
    }

  } );

} );

