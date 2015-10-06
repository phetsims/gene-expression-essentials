// Copyright 2002-2015, University of Colorado Boulder
/**
 * Motion strategy that has no motion, i.e. causes the user to be still.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );

  /**
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
      return currentLocation;
    }

  } );

} );