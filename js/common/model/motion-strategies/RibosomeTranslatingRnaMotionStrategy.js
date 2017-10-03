// Copyright 2015-2017, University of Colorado Boulder

/**
 * This class defines a very specific motion strategy used by a ribosome to follow the translation attachment point of a
 * strand of mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );

  /**
   * @param ribosome {Ribosome}
   * @constructor
   */
  function RibosomeTranslatingRnaMotionStrategy( ribosome ) {
    MotionStrategy.call( this );
    this.ribosome = ribosome; // @private
    this.messengerRna = ribosome.getMessengerRnaBeingTranslated(); // @private
  }

  geneExpressionEssentials.register( 'RibosomeTranslatingRnaMotionStrategy', RibosomeTranslatingRnaMotionStrategy );

  return inherit( MotionStrategy, RibosomeTranslatingRnaMotionStrategy, {

    /**
     * @override
     * @param {Vector2} currentLocation
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     * @public
     */
    getNextLocation: function( currentLocation, bounds, dt ) {
      var ribosomeAttachmentPoint = this.messengerRna.getRibosomeAttachmentLocation( this.ribosome );
      return ribosomeAttachmentPoint.minus( this.ribosome.offsetToTranslationChannelEntrance );
    }
  } );
} );