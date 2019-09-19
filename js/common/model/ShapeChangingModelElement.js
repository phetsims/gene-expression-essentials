// Copyright 2015-2019, University of Colorado Boulder

/**
 * Base class for elements in the model that change shape and/or move around.
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
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @abstract
   * @param {Shape} initialShape
   * @constructor
   */
  function ShapeChangingModelElement( initialShape ) {

    var self = this;

    // @public {Property.<Shape>} - can be read or listened to by anyone, should only be written by descendant types
    this.shapeProperty = new Property( initialShape );

    // @public (read-only) - The position of this model element in model space.  Generally this
    // will be the center of the model element, since it has width and height.
    this.positionProperty = new Vector2Property( Vector2.ZERO, { useDeepEquality: true } );

    // @public (read-only) {Bounds2} - This model element's bounds in model space.  This could be derived from the
    // combination of the shape and position, but doing so every time it is needed is inefficient, so it is explicitly
    // maintained.
    this.bounds = new Bounds2( 0, 0, 1, 1 ); // initial value is arbitrary, will be updated immediately

    // update the bounds whenever the shape or the position changes
    var boundsUpdateMultilink = Property.multilink(
      [ this.shapeProperty, this.positionProperty ],
      function( shape, position ) {
        var shapeBounds = shape.bounds;
        self.bounds.setMinMax(
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

  geneExpressionEssentials.register( 'ShapeChangingModelElement', ShapeChangingModelElement );

  return inherit( Object, ShapeChangingModelElement, {

    /**
     * @public
     */
    dispose: function() {
      this.disposeShapeChangingModelElement();
    },

    /**
     * @returns {Shape}
     * @public
     */
    getShape: function() {
      return this.shapeProperty.get();
    },

    /**
     * @param {number} x
     * @param {number} y
     * @public
     */
    translate: function( x, y ) {

      // in order to reduce allocations of vectors, pull them from our local pool
      var currentPosition = this.positionProperty.get();
      var newPosition = this.getFreeReusablePositionVector();
      newPosition.setXY( currentPosition.x + x, currentPosition.y + y );
      this.positionProperty.set( newPosition );
    },

    /**
     * @param {Vector2} newPos
     * @public
     */
    setPosition: function( newPos ) {
      this.positionProperty.set( newPos );
    },

    /**
     * Set the position using x and y values.
     * @param {number} x
     * @param  {number} y
     * @public
     */
    setPositionXY: function( x, y ) {

      // in order to reduce allocations of vectors, use vectors from the local vector pool
      var newPosition = this.getFreeReusablePositionVector();
      newPosition.setXY( x, y );
      this.positionProperty.set( newPosition );
    },

    /**
     * @returns {Vector2}
     * @public
     */
    getPosition: function() {
      // Assumes that the center of the shape is the position.  Override if other behavior is needed.
      return this.positionProperty.get();
    },

    getFreeReusablePositionVector: function(){
      return this.positionProperty.get() === this.reusablePositionVector1 ?
             this.reusablePositionVector2 :
             this.reusablePositionVector1;
    }
  } );
} );
