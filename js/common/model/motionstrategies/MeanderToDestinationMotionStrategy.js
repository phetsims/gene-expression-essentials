// Copyright 2015, University of Colorado Boulder
/**
 * Motion strategy that moves towards a destination, but it wanders or meanders
 * a bit on the way to look less directed and, in some cases, more natural.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Vector2 = require( 'DOT/Vector2' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/MotionStrategy' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/RandomWalkMotionStrategy' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/MoveDirectlyToDestinationMotionStrategy' );

  /**
   * @param  {Property} destinationProperty
   * @param {Property} motionBoundsProperty
   * @param {Vector2} destinationOffset
   * @constructor
   */
  function MeanderToDestinationMotionStrategy( destinationProperty, motionBoundsProperty, destinationOffset ) {
    MotionStrategy.call( this );
    this.randomWalkMotionStrategy = new RandomWalkMotionStrategy( motionBoundsProperty );
    this.directToDestinationMotionStrategy = new MoveDirectlyToDestinationMotionStrategy(
      destinationProperty, motionBoundsProperty, destinationOffset, 750 );
    this.destinationProperty = destinationProperty;
  }

  geneExpressionEssentials.register( 'MeanderToDestinationMotionStrategy', MeanderToDestinationMotionStrategy );

  return inherit( MotionStrategy, MeanderToDestinationMotionStrategy, {

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, shape, dt ) {
      var nextLocation3D = this.getNextLocation3D( new Vector3( currentLocation.x, currentLocation.y, 0 ), shape, dt );
      return new Vector2( nextLocation3D.x, nextLocation3D.y );
    },

    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Shape} shape
     * @param {number} dt
     * @returns {Vector3}
     */
    getNextLocation3D: function( currentLocation, shape, dt ) {

      // If the destination in within the shape, go straight to it.
      if ( shape.bounds.containsPoint( this.destinationProperty.get() ) ) {

        // Move directly towards the destination with no randomness.
        return this.directToDestinationMotionStrategy.getNextLocation3D( currentLocation, shape, dt );
      }
      else {

        // Use a combination of the random and linear motion.
        var intermediateLocation = this.randomWalkMotionStrategy.getNextLocation3D( currentLocation, shape, dt * 0.6 );
        return this.directToDestinationMotionStrategy.getNextLocation3D( intermediateLocation, shape, dt * 0.4 );
      }
    }

  } );


} );
