// Copyright 2015-2019, University of Colorado Boulder

/**
 * This class defines a point in model space that can be used to define a complex, winding shape.  In this simulation,
 * it is used to define the shape of the messenger RNA strand.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

/**
 *
 * @param {Vector2} initialPosition
 * @param {number} targetDistanceToPreviousPoint
 * @constructor
 */
function ShapeDefiningPoint( initialPosition, targetDistanceToPreviousPoint ) {

  // @private
  this.position = new Vector2( 0, 0 );
  this.previousPoint = null;
  this.nextPoint = null;
  this.targetDistanceToPreviousPoint = targetDistanceToPreviousPoint; // in picometers

  this.setPosition( initialPosition );
}

geneExpressionEssentials.register( 'ShapeDefiningPoint', ShapeDefiningPoint );

export default inherit( Object, ShapeDefiningPoint, {

  /**
   * @param {number} x
   * @param {number} y
   * @public
   */
  setPositionXY: function( x, y ) {
    assert && assert( arguments.length === 2, 'incorrect number of arguments: ' + arguments.length );
    this.position.setXY( x, y );
  },

  /**
   * @param {Vector2} position
   * @public
   */
  setPosition: function( position ) {
    this.setPositionXY( position.x, position.y );
  },

  /**
   * @returns {Vector2}
   * @public
   */
  getPosition: function() {
    return this.position;
  },

  /**
   * @returns {ShapeDefiningPoint}
   * @public
   */
  getPreviousPoint: function() {
    return this.previousPoint;
  },

  /**
   * @param {ShapeDefiningPoint} previousPoint
   * @public
   */
  setPreviousPoint: function( previousPoint ) {
    this.previousPoint = previousPoint;
  },

  /**
   * @returns {ShapeDefiningPoint}
   * @public
   */
  getNextPoint: function() {
    return this.nextPoint;
  },

  /**
   * @param {ShapeDefiningPoint} nextPoint
   * @public
   */
  setNextPoint: function( nextPoint ) {
    this.nextPoint = nextPoint;
  },

  /**
   * @returns {number}
   * @public
   */
  getTargetDistanceToPreviousPoint: function() {
    return this.targetDistanceToPreviousPoint;
  },

  /**
   * @param {ShapeDefiningPoint} p
   * @returns {number}
   * @public
   */
  distance: function( p ) {
    return this.getPosition().distance( p.getPosition() );
  },

  /**
   * @param {number} x
   * @param {number} y
   * @public
   */
  translate: function( x, y ) {
    this.setPositionXY( this.position.x + x, this.position.y + y );
  },

  /**
   * @param {number} targetDistance
   * @public
   */
  setTargetDistanceToPreviousPoint: function( targetDistance ) {
    this.targetDistanceToPreviousPoint = targetDistance;
  }

} );