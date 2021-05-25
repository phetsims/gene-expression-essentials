// Copyright 2015-2021, University of Colorado Boulder

/**
 * This class defines a point in model space that can be used to define a complex, winding shape.  In this simulation,
 * it is used to define the shape of the messenger RNA strand.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class ShapeDefiningPoint {

  /**
   * @param {Vector2} initialPosition
   * @param {number} targetDistanceToPreviousPoint
   */
  constructor( initialPosition, targetDistanceToPreviousPoint ) {

    // @private
    this.position = new Vector2( 0, 0 );
    this.previousPoint = null;
    this.nextPoint = null;
    this.targetDistanceToPreviousPoint = targetDistanceToPreviousPoint; // in picometers

    this.setPosition( initialPosition );
  }

  /**
   * @param {number} x
   * @param {number} y
   * @public
   */
  setPositionXY( x, y ) {
    assert && assert( arguments.length === 2, `incorrect number of arguments: ${arguments.length}` );
    this.position.setXY( x, y );
  }

  /**
   * @param {Vector2} position
   * @public
   */
  setPosition( position ) {
    this.setPositionXY( position.x, position.y );
  }

  /**
   * @returns {Vector2}
   * @public
   */
  getPosition() {
    return this.position;
  }

  /**
   * @returns {ShapeDefiningPoint}
   * @public
   */
  getPreviousPoint() {
    return this.previousPoint;
  }

  /**
   * @param {ShapeDefiningPoint} previousPoint
   * @public
   */
  setPreviousPoint( previousPoint ) {
    this.previousPoint = previousPoint;
  }

  /**
   * @returns {ShapeDefiningPoint}
   * @public
   */
  getNextPoint() {
    return this.nextPoint;
  }

  /**
   * @param {ShapeDefiningPoint} nextPoint
   * @public
   */
  setNextPoint( nextPoint ) {
    this.nextPoint = nextPoint;
  }

  /**
   * @returns {number}
   * @public
   */
  getTargetDistanceToPreviousPoint() {
    return this.targetDistanceToPreviousPoint;
  }

  /**
   * @param {ShapeDefiningPoint} p
   * @returns {number}
   * @public
   */
  distance( p ) {
    return this.getPosition().distance( p.getPosition() );
  }

  /**
   * @param {number} x
   * @param {number} y
   * @public
   */
  translate( x, y ) {
    this.setPositionXY( this.position.x + x, this.position.y + y );
  }

  /**
   * @param {number} targetDistance
   * @public
   */
  setTargetDistanceToPreviousPoint( targetDistance ) {
    this.targetDistanceToPreviousPoint = targetDistance;
  }
}

geneExpressionEssentials.register( 'ShapeDefiningPoint', ShapeDefiningPoint );

export default ShapeDefiningPoint;