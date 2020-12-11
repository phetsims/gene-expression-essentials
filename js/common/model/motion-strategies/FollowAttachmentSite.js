// Copyright 2015-2020, University of Colorado Boulder

/**
 * Motion strategy that tracks an attachment site and moves to wherever it is.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


//modules
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import MotionStrategy from './MotionStrategy.js';

class FollowAttachmentSite extends MotionStrategy {

  /**
   * @param {AttachmentSite} attachmentSite
   */
  constructor( attachmentSite ) {
    super();
    this.attachmentSite = attachmentSite; // @private
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
    return this.attachmentSite.positionProperty.get();
  }
}

geneExpressionEssentials.register( 'FollowAttachmentSite', FollowAttachmentSite );

export default FollowAttachmentSite;