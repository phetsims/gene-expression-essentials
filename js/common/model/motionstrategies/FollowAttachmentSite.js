//  Copyright 2002-2014, University of Colorado Boulder
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
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );

  /**
   *
   * @param {AttachmentSite} attachmentSite
   * @constructor
   */
  function FollowAttachmentSite( attachmentSite ) {
    MotionStrategy.call( this );
    this.attachmentSite = attachmentSite;
  }

  return inherit( MotionStrategy, FollowAttachmentSite, {

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      return this.attachmentSite.locationProperty.get();
    }


  } );


} );

//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies;
//
//import java.awt.Shape;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.geneexpressionbasics.common.model.AttachmentSite;
//
///**
// * Motion strategy that tracks an attachment site and moves to wherever it is.
// *
// * @author John Blanco
// */
//public class FollowAttachmentSite extends MotionStrategy {
//    private final AttachmentSite attachmentSite;
//
//    public FollowAttachmentSite( AttachmentSite attachmentSite ) {
//        this.attachmentSite = attachmentSite;
//    }
//
//    @Override public Vector2D getNextLocation( Vector2D currentLocation, Shape shape, double dt ) {
//        return attachmentSite.locationProperty.get();
//    }
//}
