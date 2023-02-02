// Copyright 2015-2023, University of Colorado Boulder

/**
 * Base class for elements in the model that change shape and/or move around.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class ShapeChangingModelElement {

  /**
   * @abstract
   * @param {Shape} initialShape
   */
  constructor( initialShape ) {


    // @public {Property.<Shape>} - can be read or listened to by anyone, should only be written by descendant types
    this.shapeProperty = new Property( initialShape );

    // @public (read-only) - The position of this model element in model space.  Generally this
    // will be the center of the model element, since it has width and height.
    this.positionProperty = new Vector2Property( Vector2.ZERO, { valueComparisonStrategy: 'equalsFunction' } );

    // @public (read-only) {Bounds2} - This model element's bounds in model space.  This could be derived from the
    // combination of the shape and position, but doing so every time it is needed is inefficient, so it is explicitly
    // maintained.
    this.bounds = new Bounds2( 0, 0, 1, 1 ); // initial value is arbitrary, will be updated immediately

    // update the bounds whenever the shape or the position changes
    const boundsUpdateMultilink = Multilink.multilink(
      [ this.shapeProperty, this.positionProperty ],
      ( shape, position ) => {
        const shapeBounds = shape.bounds;
        this.bounds.setMinMax(
          position.x + shapeBounds.minX,
          position.y + shapeBounds.minY,
          position.x + shapeBounds.maxX,
          position.y + shapeBounds.maxY
        );
      }
    );

    this.disposeShapeChangingModelElement = function() {
      boundsUpdateMultilink.dispose();
      this.positionProperty.dispose();
      this.shapeProperty.set( null );
      this.shapeProperty.dispose();
    };

    // reusable position vectors, used to prevent allocations of new vectors and thus improve performance
    this.reusablePositionVector1 = new Vector2( 0, 0 );
    this.reusablePositionVector2 = new Vector2( 0, 0 );
  }

  /**
   * @public
   */
  dispose() {
    this.disposeShapeChangingModelElement();
  }

  /**
   * @returns {Shape}
   * @public
   */
  getShape() {
    return this.shapeProperty.get();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @public
   */
  translate( x, y ) {

    // in order to reduce allocations of vectors, pull them from our local pool
    const currentPosition = this.positionProperty.get();
    const newPosition = this.getFreeReusablePositionVector();
    newPosition.setXY( currentPosition.x + x, currentPosition.y + y );
    this.positionProperty.set( newPosition );
  }

  /**
   * @param {Vector2} newPos
   * @public
   */
  setPosition( newPos ) {
    this.positionProperty.set( newPos );
  }

  /**
   * Set the position using x and y values.
   * @param {number} x
   * @param  {number} y
   * @public
   */
  setPositionXY( x, y ) {

    // in order to reduce allocations of vectors, use vectors from the local vector pool
    const newPosition = this.getFreeReusablePositionVector();
    newPosition.setXY( x, y );
    this.positionProperty.set( newPosition );
  }

  /**
   * @returns {Vector2}
   * @public
   */
  getPosition() {
    // Assumes that the center of the shape is the position.  Override if other behavior is needed.
    return this.positionProperty.get();
  }

  /**
   * Get whichever reusable vector isn't currently in use.  This is used to reduce memory allocations.
   * @returns {Vector2}
   * @private
   */
  getFreeReusablePositionVector() {
    return this.positionProperty.get() === this.reusablePositionVector1 ?
           this.reusablePositionVector2 :
           this.reusablePositionVector1;
  }
}

geneExpressionEssentials.register( 'ShapeChangingModelElement', ShapeChangingModelElement );

export default ShapeChangingModelElement;