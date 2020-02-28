// Copyright 2015-2020, University of Colorado Boulder

/**
 * Motion strategy that tracks an attachment site and moves to wherever it is.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


//modules
import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

/**
 * @param {AttachmentSite} attachmentSite
 * @constructor
 */
function FollowAttachmentSite( attachmentSite ) {
  MotionStrategy.call( this );
  this.attachmentSite = attachmentSite; // @private
}

geneExpressionEssentials.register( 'FollowAttachmentSite', FollowAttachmentSite );

export default inherit( MotionStrategy, FollowAttachmentSite, {

  /**
   * @override
   * @param {Vector2} currentPosition
   * @param {Bounds2} bounds
   * @param {number} dt
   * @returns {Vector2}
   * @public
   */
  getNextPosition: function( currentPosition, bounds, dt ) {
    return this.attachmentSite.positionProperty.get();
  }
} );