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

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );

  /**
   *
   * @param messengerRnaDestroyer {MessengerRnaDestroyer}
   * @constructor
   */
  function DestroyerTrackingRnaMotionStrategy( messengerRnaDestroyer ) {
    MotionStrategy.call( this );
    this.messengerRna = messengerRnaDestroyer.getMessengerRnaBeingDestroyed();
  }

  return inherit( MotionStrategy, DestroyerTrackingRnaMotionStrategy, {

    /**
     *
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

//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies;
//
//import java.awt.Shape;
//import java.awt.geom.Point2D;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.geneexpressionbasics.common.model.MessengerRna;
//import edu.colorado.phet.geneexpressionbasics.common.model.MessengerRnaDestroyer;
//
///**
// * This class defines a very specific motion strategy used by an mRNA destroyer
// * to follow the attachment point of a strand of mRNA.
// *
// * @author John Blanco
// */
//public class DestroyerTrackingRnaMotionStrategy extends MotionStrategy {
//    private final MessengerRna messengerRna;
//
//    public DestroyerTrackingRnaMotionStrategy( MessengerRnaDestroyer messengerRnaDestroyer ) {
//        this.messengerRna = messengerRnaDestroyer.getMessengerRnaBeingDestroyed();
//    }
//
//    @Override public Vector2D getNextLocation( Vector2D currentLocation, Shape shape, double dt ) {
//        Point2D attachmentLocation = messengerRna.getDestroyerAttachmentLocation();
//        return new Vector2D( attachmentLocation.x, attachmentLocation.y );
//    }
//}
