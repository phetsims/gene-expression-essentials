//  Copyright 2002-2014, University of Colorado Boulder
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

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Vector2 = require( 'DOT/Vector2' );
  var MotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionStrategy' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/RandomWalkMotionStrategy' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MoveDirectlyToDestinationMotionStrategy' );

  /**
   *
   * @param  {Property} destinationProperty
   * @param {Property} motionBoundsProperty
   * @param {Vector2} destinationOffset
   * @constructor
   */
  function MeanderToDestinationMotionStrategy( destinationProperty, motionBoundsProperty, destinationOffset ) {
    MotionStrategy.call( this );
    this.randomWalkMotionStrategy = new RandomWalkMotionStrategy( motionBoundsProperty );
    this.directToDestinationMotionStrategy = new MoveDirectlyToDestinationMotionStrategy( destinationProperty, motionBoundsProperty, destinationOffset, 750 );
    this.destinationProperty = destinationProperty;
  }

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
      if ( shape.bounds.contains( this.destinationProperty.get().toPoint2D() ) ) {

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

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies;
//
//import java.awt.Shape;
//
//import edu.colorado.phet.common.phetcommon.math.Point3D;
//import edu.colorado.phet.common.phetcommon.math.vector.AbstractVector2D;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//
///**
// * Motion strategy that moves towards a destination, but it wanders or meanders
// * a bit on the way to look less directed and, in some cases, more natural.
// *
// * @author John Blanco
// */
//public class MeanderToDestinationMotionStrategy extends MotionStrategy {
//    private final MotionStrategy randomWalkMotionStrategy;
//    private final MotionStrategy directToDestinationMotionStrategy;
//
//    // Destination property.  It is only in two dimensions because the
//    // destination must always have a Z value of zero.
//    private final Property<Vector2D> destinationProperty;
//
//    /**
//     * Constructor.
//     *
//     * @param destinationProperty
//     * @param motionBoundsProperty
//     * @param destinationOffset
//     */
//    public MeanderToDestinationMotionStrategy( Property<Vector2D> destinationProperty, Property<MotionBounds> motionBoundsProperty, AbstractVector2D destinationOffset ) {
//        randomWalkMotionStrategy = new RandomWalkMotionStrategy( motionBoundsProperty );
//        directToDestinationMotionStrategy = new MoveDirectlyToDestinationMotionStrategy( destinationProperty, motionBoundsProperty, destinationOffset, 750 );
//        this.destinationProperty = destinationProperty;
//    }
//
//    @Override public Vector2D getNextLocation( Vector2D currentLocation, Shape shape, double dt ) {
//        Point3D nextLocation3D = getNextLocation3D( new Point3D.Double( currentLocation.x, currentLocation.y, 0 ), shape, dt );
//        return new Vector2D( nextLocation3D.x, nextLocation3D.y );
//    }
//
//    @Override public Point3D getNextLocation3D( Point3D currentLocation, Shape shape, double dt ) {
//        // If the destination in within the shape, go straight to it.
//        if ( shape.getBounds2D().contains( destinationProperty.get().toPoint2D() ) ) {
//            // Move directly towards the destination with no randomness.
//            return directToDestinationMotionStrategy.getNextLocation3D( currentLocation, shape, dt );
//        }
//        else {
//            // Use a combination of the random and linear motion.
//            Point3D intermediateLocation = randomWalkMotionStrategy.getNextLocation3D( currentLocation, shape, dt * 0.6 );
//            return directToDestinationMotionStrategy.getNextLocation3D( intermediateLocation, shape, dt * 0.4 );
//        }
//    }
//}
