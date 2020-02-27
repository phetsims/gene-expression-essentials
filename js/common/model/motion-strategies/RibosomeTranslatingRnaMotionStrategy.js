// Copyright 2015-2019, University of Colorado Boulder

/**
 * This class defines a very specific motion strategy used by a ribosome to follow the translation attachment point of a
 * strand of mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

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

export default inherit( MotionStrategy, RibosomeTranslatingRnaMotionStrategy, {

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