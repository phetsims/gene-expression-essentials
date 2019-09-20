// Copyright 2015-2019, University of Colorado Boulder

/**
 * Class that defines the bounds within which some shape or point is allowed to move. If the bounds are not set, they
 * are assumed to be infinite.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Bounds2} bounds
   * @constructor
   */
  function MotionBounds( bounds ) {

    if ( !bounds ) {
      // Set up bounds to be infinite, is JS world setting the max values
      bounds = Bounds2.EVERYTHING;
    }

    this.bounds = bounds; //@private
    this.offLimitMotionSpaces = []; //@private
  }

  geneExpressionEssentials.register( 'MotionBounds', MotionBounds );

  return inherit( Object, MotionBounds, {

    /**
     * Sets the bounds
     * @param {Bounds2} bounds
     * @public
     */
    set: function( bounds ) {
      this.bounds.set( bounds );
    },

    /**
     * Add off limit motion space. Bounds does not support subtract so this is workaround
     * @param {Bounds2} offLimitBounds
     * @public
     */
    addOffLimitMotionSpace: function( offLimitBounds ) {
      this.offLimitMotionSpaces.push( offLimitBounds );
    },

    /**
     * Check whether given bounds intersects with any off limit motion space
     * @param {Bounds2} bounds
     * @returns {boolean}
     * @private
     */
    inOffLimitMotionSpace: function( bounds ) {
      let flag = false;
      this.offLimitMotionSpaces.forEach( function( offLimitMotionSpace ) {
        if ( bounds.intersectsBounds( offLimitMotionSpace ) ) {
          flag = true;
        }
      } );
      return flag;
    },

    /**
     * Check whether given bounds are in the bounds or not
     * @param {Bounds2} bounds
     * @returns {boolean}
     * @public
     */
    inBounds: function( bounds ) {
      return this.bounds === null || ( this.bounds.containsBounds( bounds ) && !this.inOffLimitMotionSpace( bounds ) );
    },

    /**
     * returns bounds
     * @returns {Bounds2}
     * @public
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
     * @returns {boolean}
     * @public
     */
    testIfInMotionBoundsWithDelta: function( bounds, motionVector, dt ) {
      return this.inBounds( bounds.shifted( motionVector.x * dt, motionVector.y * dt ) );
    },

    /**
     * Test whether the given shape will be within the motion bounds if it is translated such that its center is at the
     * given point.
     *
     * @param {Bounds2} bounds            - Test bounds.
     * @param {Vector2} proposedPosition - Proposed position of the shape's center.
     * @returns {boolean}
     * @public
     */
    testIfInMotionBounds: function( bounds, proposedPosition ) {
      const shapeCenter = bounds.getCenter();
      const translationVector = proposedPosition.minus( shapeCenter );
      return this.inBounds( bounds.shifted( translationVector.x, translationVector.y ) );
    }
  } );
} );

