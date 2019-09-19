// Copyright 2015-2017, University of Colorado Boulder

/**
 * This class defines a very specific motion strategy used by a ribosome to follow the translation attachment point of a
 * strand of mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );

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
     * @param {Vector2} currentPosition
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     * @public
     */
    getNextPosition: function( currentPosition, bounds, dt ) {
      const ribosomeAttachmentPoint = this.messengerRna.getRibosomeGenerateInitialPosition3D( this.ribosome );
      return ribosomeAttachmentPoint.minus( this.ribosome.offsetToTranslationChannelEntrance );
    }
  } );
} );