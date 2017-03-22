// Copyright 2015, University of Colorado Boulder

 /*
 * Class that defines the bounds within which some shape or point is allowed to move. If the bounds are not set, they
 * are assumed to be infinite.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Bounds2} bounds
   * @constructor
   */
  function MotionBounds( bounds ) {

    if ( !bounds ) {
      // Set up bounds to be infinite, is JS world setting the max values
      //bounds = new Bounds2( Number.MIN_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, Number.MAX_VALUE );
      bounds = Bounds2.EVERYTHING;
    }

    this.bounds = bounds;
  }

  geneExpressionEssentials.register( 'MotionBounds', MotionBounds );

  return inherit( Object, MotionBounds, {

    set: function( bounds ){
      this.bounds.set( bounds );
    },

    /**
     * @param {Bounds2} bounds
     * @returns {boolean}
     */
    inBounds: function( bounds ) {
      return this.bounds === null || this.bounds.containsBounds( bounds );
    },

    /**
     * return Bounds
     */
    getBounds: function() {
      return this.bounds;
    },


    /**
     * Test whether the given shape will be in or out of the motion bounds if the given motion vector is applied for the
     * given time.
     *
     * @param {Bounds2} bounds        - bounds of entity being tested.
     * @param {Vector2 }motionVector - Motion vector of the object in distance/sec
     * @param {number} dt           - delta time, i.e. amount of time, in seconds.
     * @return
     */
    testIfInMotionBoundsWithDelta: function( bounds, motionVector, dt ) {
      return this.inBounds( bounds.shifted( motionVector.x * dt, motionVector.y * dt ) );

    },


    /**
     * Test whether the given shape will be within the motion bounds if it is translated such that its center is at the
     * given point.
     *
     * @param {Bounds2} bounds            - Test bounds.
     * @param {Vector2} proposedLocation - Proposed location of the shape's center.
     * @return - True is in bounds, false if not.
     */
    testIfInMotionBounds: function( bounds, proposedLocation ) {
      var shapeCenter = bounds.getCenter();
      var translationVector = proposedLocation.minus( shapeCenter );
      return this.inBounds( bounds.shifted( translationVector.x, translationVector.y ) );
    }


  } );


} );

