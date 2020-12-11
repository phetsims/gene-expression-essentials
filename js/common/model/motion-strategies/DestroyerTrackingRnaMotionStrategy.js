// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class defines a very specific motion strategy used by an mRNA destroyer to follow the attachment point of a
 * strand of mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

class DestroyerTrackingRnaMotionStrategy extends MotionStrategy {

  /**
   * @param messengerRnaDestroyer {MessengerRnaDestroyer}
   */
  constructor( messengerRnaDestroyer ) {
    super();
    this.messengerRna = messengerRnaDestroyer.getMessengerRnaBeingDestroyed(); //@private
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
    const generateInitialPosition3D = this.messengerRna.getDestroyerGenerateInitialPosition3D();
    return new Vector2( generateInitialPosition3D.x, generateInitialPosition3D.y );
  }
}

geneExpressionEssentials.register( 'DestroyerTrackingRnaMotionStrategy', DestroyerTrackingRnaMotionStrategy );

export default DestroyerTrackingRnaMotionStrategy;