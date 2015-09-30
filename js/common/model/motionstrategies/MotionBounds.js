//  Copyright 2002-2015, University of Colorado Boulder
/**
 /**
 * Class that defines the bounds within which some shape or point is allowed to
 * move.  The shape can be anything, and does not need to be rectangular.
 * <p/>
 * If the bounds are not set, they are assumed to be infinite.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );


  /**
   * @param {Shape} boundsShape
   * @constructor
   */
  function MotionBounds( boundsShape ) {

    if ( !boundsShape ) {
      boundsShape = Shape.rectangle( Number.MIN_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, Number.MAX_VALUE );
    }

    // Use a shape, rather than a rectangle, for the bounds.  This allows
    // more complex bounds to be used.
    this.boundsShape = boundsShape;
  }

  return inherit( Object, MotionBounds, {

    /**
     * @param {Shape} p
     * @returns {boolean}
     */
    inBounds: function( p ) {
      if ( p.x ) {
        return this.inBoundsByPoint( p );
      }
      return this.boundsShape === null || this.boundsShape.bounds.containsBounds( p.bounds );
    },

    /**
     * @param {Vector2} p
     * @returns {boolean}
     */
    inBoundsByPoint: function( p ) {
      return this.boundsShape === null || this.boundsShape.bounds.containsPoint( p );
    },

    /**
     * return Bounds
     */
    getBounds: function() {
      return this.boundsShape.bounds;
    },


    /**
     * Test whether the given shape will be in or out of the motion bounds if
     * the given motion vector is applied for the given time.
     *
     * @param {Shape} shape        - Shape of entity being tested.
     * @param {Vector2 }motionVector - Motion vector of the object in distance/sec
     * @param {number} dt           - delta time, i.e. amount of time, in seconds.
     * @return
     */
    testIfInMotionBoundsWithDelta: function( shape, motionVector, dt ) {
      var motionTransform = Matrix3.translation( motionVector.x * dt, motionVector.y * dt );
      return this.inBounds( shape.transformed( motionTransform ) );

    },


    /**
     * Test whether the given shape will be within the motion bounds if it is
     * translated such that its center is at the given point.
     *
     * @param {Shape} shape            - Test shape.
     * @param {Vector2} proposedLocation - Proposed location of the shape's center.
     * @return - True is in bounds, false if not.
     */
    testIfInMotionBounds: function( shape, proposedLocation ) {
      var shapeCenter = shape.bounds.getCenter();
      var translationVector = proposedLocation.minus( shapeCenter );
      var translation = Matrix3.translation( translationVector.x, translationVector.y );
      var translatedBounds = shape.transformed( translation );
      return this.inBounds( translatedBounds );
    }


  } );


} );

