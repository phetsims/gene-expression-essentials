// Copyright 2015, University of Colorado Boulder

/**
 * Base class for elements in the model that change shape and/or move around.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @abstract
   * @param {Shape} initialShape
   * @constructor
   */
  function ShapeChangingModelElement( initialShape ) {

    var self = this;

    // @public {Property.<Shape>} - can be read or listened to by anyone, should only be written by descendant types
    this.shapeProperty = new Property( initialShape );

    // @public (read-only) {Property.<Vector2>} - The position of this model element in model space.  Generally this
    // will be the center of the model element, since it has width and height.
    this.positionProperty = new Property( Vector2.ZERO, { useDeepEquality: true } );

    // @public (read-only) {Bounds2} - This model element's bounds in model space.  This could be derived from the
    // combination of the shape and position, but doing so every time it is needed is inefficient, so it is explicitly
    // maintained.
    this.bounds = new Bounds2( 0, 0, 1, 1 ); // initial value is arbitrary, will be updated immediately

    // update the bounds whenever the shape or the position changes
    Property.multilink( [ this.shapeProperty, this.positionProperty ], function( shape, position ){
      var shapeBounds = shape.bounds;
      self.bounds.setMinMax(
        position.x + shapeBounds.minX,
        position.y + shapeBounds.minY,
        position.x + shapeBounds.maxX,
        position.y + shapeBounds.maxY
      );
    } );
  }

  geneExpressionEssentials.register( 'ShapeChangingModelElement', ShapeChangingModelElement );

  return inherit( Object, ShapeChangingModelElement, {

    /**
     * @public
     */
    dispose: function() {
      this.shapeProperty.set( null );
      this.shapeProperty.dispose();
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

      // in order to reduce allocations of vectors, set the value in the property and then force notifications
      this.positionProperty.set( this.positionProperty.get().plusXY( x, y ) );
    },

    /**
     * @param {Vector2} newPos
     * @public
     */
    setPosition: function( newPos ) {
      this.setPositionByXY( newPos.x, newPos.y );
    },

    /**
     * Set the position using x and y values.
     * @param {number} x
     * @param  {number} y
     * @public
     */
    setPositionByXY: function( x, y ) {

      // in order to reduce allocations of vectors, set the value in the property and then force notifications
      this.positionProperty.set( new Vector2( x, y ) );
    },

    /**
     * @returns {Vector2}
     * @public
     */
    getPosition: function() {
      // Assumes that the center of the shape is the position.  Override if other behavior is needed.
      return this.positionProperty.get();
    }
  } );
} );
