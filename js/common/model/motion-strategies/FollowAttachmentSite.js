// Copyright 2015, University of Colorado Boulder
/**
 * Motion strategy that tracks an attachment site and moves to wherever it is.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );

  /**
   * @param {AttachmentSite} attachmentSite
   * @constructor
   */
  function FollowAttachmentSite( attachmentSite ) {
    MotionStrategy.call( this );
    this.attachmentSite = attachmentSite;
  }

  geneExpressionEssentials.register( 'FollowAttachmentSite', FollowAttachmentSite );

  return inherit( MotionStrategy, FollowAttachmentSite, {

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, bounds, dt ) {
      return this.attachmentSite.locationProperty.get();
    }

  } );

} );
