// Copyright 2015-2019, University of Colorado Boulder

/**
 * Motion strategy that tracks an attachment site and moves to wherever it is.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  //modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );

  /**
   * @param {AttachmentSite} attachmentSite
   * @constructor
   */
  function FollowAttachmentSite( attachmentSite ) {
    MotionStrategy.call( this );
    this.attachmentSite = attachmentSite; // @private
  }

  geneExpressionEssentials.register( 'FollowAttachmentSite', FollowAttachmentSite );

  return inherit( MotionStrategy, FollowAttachmentSite, {

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
} );
