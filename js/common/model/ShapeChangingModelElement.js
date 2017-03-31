// Copyright 2015, University of Colorado Boulder

/**
 * Base class for elements in the model that change shape and/or move around.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */

define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @abstract
   * @param {Shape} initialShape
   * @constructor
   */
  function ShapeChangingModelElement( initialShape ) {
    // Shape property, which is not public because it should only be changed by descendants of the class.
    this.shapeProperty = new Property( initialShape );
    this.bounds = this.shapeProperty.get().bounds.copy();
    this.setCenter();
  }

  geneExpressionEssentials.register( 'ShapeChangingModelElement', ShapeChangingModelElement );

  return inherit( Object, ShapeChangingModelElement, {

    /**
     *
     * @returns {Shape}
     */
    getShape: function() {
      return this.shapeProperty.get();
    },

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    translate: function( x, y ) {
      this.bounds.shift( x, y );
      this.centerPosition.addXY( x, y );
      this.shapeProperty.notifyObserversStatic();
    },

    /**
     *
     * @param {Vector2} newPos
     */
    setPosition: function( newPos ) {
      this.setPositionByXY( newPos.x, newPos.y );
    },

    /**
     *
     * @param {number} x
     * @param  {number} y
     */
    setPositionByXY: function( x, y ) {
      if ( x !== this.getPosition().x || y !== this.getPosition().y ) {

        // This default implementation assumes that the position indicator is defined by the center of the shape's bounds.
        // Override if some other behavior is required.
        var center = this.getCenter();
        this.translate( x - center.x, y - center.y  );
      }
    },

    /**
     * The Java version of shape.bounds returns the center even if the shape has only a single point the kite version
     * gives NAN in such cases. This is a WorkAround. Needs Fixing. TODO
     */
    getCenter: function() {
      return this.centerPosition;
    },

    setCenter: function() {
      var center = this.bounds.getCenter();
      if ( !_.isFinite( center.x ) ) {
        center = this.shapeProperty.get().subpaths[ 0 ].points[ 0 ];
      }
      this.centerPosition = center;
    },

    /**
     *
     * @returns {Vector2}
     */
    getPosition: function() {
      // Assumes that the center of the shape is the position.  Override if other behavior is needed.
      return this.getCenter();
    }
  } );
} );
