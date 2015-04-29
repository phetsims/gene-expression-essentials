//  Copyright 2002-2014, University of Colorado Boulder
/**
 * This class defines a very specific motion strategy used by an mRNA destroyer
 * to follow the attachment point of a strand of mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );

  /**
   * @param messengerRnaDestroyer {MessengerRnaDestroyer}
   * @constructor
   */
  function DestroyerTrackingRnaMotionStrategy( messengerRnaDestroyer ) {
    MotionStrategy.call( this );
    this.messengerRna = messengerRnaDestroyer.getMessengerRnaBeingDestroyed();
  }

  return inherit( MotionStrategy, DestroyerTrackingRnaMotionStrategy, {

    /**
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      var attachmentLocation = this.messengerRna.getDestroyerAttachmentLocation();
      return new Vector2( attachmentLocation.x, attachmentLocation.y );
    }

  } );


} );

