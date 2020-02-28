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
import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

/**
 * @param messengerRnaDestroyer {MessengerRnaDestroyer}
 * @constructor
 */
function DestroyerTrackingRnaMotionStrategy( messengerRnaDestroyer ) {
  MotionStrategy.call( this );
  this.messengerRna = messengerRnaDestroyer.getMessengerRnaBeingDestroyed(); //@private
}

geneExpressionEssentials.register( 'DestroyerTrackingRnaMotionStrategy', DestroyerTrackingRnaMotionStrategy );

export default inherit( MotionStrategy, DestroyerTrackingRnaMotionStrategy, {

  /**
   * @override
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector2}
   * @public
   */
  getNextPosition: function( currentPosition, bounds, dt ) {
    const generateInitialPosition3D = this.messengerRna.getDestroyerGenerateInitialPosition3D();
    return new Vector2( generateInitialPosition3D.x, generateInitialPosition3D.y );
  }
} );