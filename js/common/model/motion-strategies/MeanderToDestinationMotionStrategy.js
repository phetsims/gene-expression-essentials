// Copyright 2015, University of Colorado Boulder

/**
 * Motion strategy that moves towards a destination, but it wanders or meanders a bit on the way to look less directed
 * and, in some cases, more natural.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MoveDirectlyToDestinationMotionStrategy' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/RandomWalkMotionStrategy' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );

  /**
   * @param  {Property} destinationProperty
   * @param {Property} motionBoundsProperty
   * @param {Vector2} destinationOffset
   * @constructor
   */
  function MeanderToDestinationMotionStrategy( destinationProperty, motionBoundsProperty, destinationOffset ) {
    MotionStrategy.call( this );
    this.randomWalkMotionStrategy = new RandomWalkMotionStrategy( motionBoundsProperty ); // @private
    this.directToDestinationMotionStrategy = new MoveDirectlyToDestinationMotionStrategy(
      destinationProperty, motionBoundsProperty, destinationOffset, 750 ); // @private
    this.destinationProperty = destinationProperty; // @private
  }

  geneExpressionEssentials.register( 'MeanderToDestinationMotionStrategy', MeanderToDestinationMotionStrategy );

  return inherit( MotionStrategy, MeanderToDestinationMotionStrategy, {

    /**
     * @override
     * @param {Vector2} currentLocation
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     * @public
     */
    getNextLocation: function( currentLocation, bounds, dt ) {
      var nextLocation3D = this.getNextLocation3D( new Vector3( currentLocation.x, currentLocation.y, 0 ), bounds, dt );
      return new Vector2( nextLocation3D.x, nextLocation3D.y );
    },

    /**
     * @override
     * @param {Vector2} currentLocation
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector3}
     * @public
     */
    getNextLocation3D: function( currentLocation, bounds, dt ) {

      // If the destination in within the shape, go straight to it.
      if ( bounds.containsPoint( this.destinationProperty.get() ) ) {

        // Move directly towards the destination with no randomness.
        return this.directToDestinationMotionStrategy.getNextLocation3D( currentLocation, bounds, dt );
      }
      else {

        // Use a combination of the random and linear motion.
        var intermediateLocation = this.randomWalkMotionStrategy.getNextLocation3D( currentLocation, bounds, dt * 0.6 );
        return this.directToDestinationMotionStrategy.getNextLocation3D( intermediateLocation, bounds, dt * 0.4 );
      }
    }
  } );
} );
