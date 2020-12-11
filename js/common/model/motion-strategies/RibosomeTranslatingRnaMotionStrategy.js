// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class defines a very specific motion strategy used by a ribosome to follow the translation attachment point of a
 * strand of mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

class RibosomeTranslatingRnaMotionStrategy extends MotionStrategy {

  /**
   * @param ribosome {Ribosome}
   */
  constructor( ribosome ) {
    super();
    this.ribosome = ribosome; // @private
    this.messengerRna = ribosome.getMessengerRnaBeingTranslated(); // @private
  }

  /**
   * @override
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector2}
   * @public
   */
  getNextPosition( currentPosition, bounds, dt ) {
    const ribosomeAttachmentPoint = this.messengerRna.getRibosomeGenerateInitialPosition3D( this.ribosome );
    return ribosomeAttachmentPoint.minus( this.ribosome.offsetToTranslationChannelEntrance );
  }
}

geneExpressionEssentials.register( 'RibosomeTranslatingRnaMotionStrategy', RibosomeTranslatingRnaMotionStrategy );

export default RibosomeTranslatingRnaMotionStrategy;