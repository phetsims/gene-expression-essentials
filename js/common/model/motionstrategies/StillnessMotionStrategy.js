//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Motion strategy that has no motion, i.e. causes the user to be still.
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
   * @constructor
   */
  function StillnessMotionStrategy() {
    MotionStrategy.call( this );
  }

  return inherit( MotionStrategy, StillnessMotionStrategy, {


    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      return new Vector2( currentLocation.x, currentLocation.y );
    }

  } );


} );
//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies;
//
//import java.awt.Shape;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//
///**
// * Motion strategy that has no motion, i.e. causes the user to be still.
// *
// * @author John Blanco
// */
//public class StillnessMotionStrategy extends MotionStrategy {
//
//    @Override public Vector2D getNextLocation( Vector2D currentLocation, Shape shape, double dt ) {
//        return new Vector2D( currentLocation.x, currentLocation.y );
//    }
//}
