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

    // @public {Property.<Shape>} - can be read or listened to by anyone, should only be written by descendent types
    this.shapeProperty = new Property( initialShape );

    // @public {Bounds2} - TODO: Is this really needed?
    this.bounds = this.shapeProperty.get().bounds.copy();

    // @public (read-only)
    this.center;
    this.setCenter();
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
      this.bounds.shift( x, y );
      this.centerPosition.addXY( x, y );
      this.shapeProperty.notifyListenersStatic();
    },

    /**
     * @param {Vector2} newPos
     * @public
     */
    setPosition: function( newPos ) {
      this.setPositionByXY( newPos.x, newPos.y );
    },

    /**
     * @param {number} x
     * @param  {number} y
     * @public
     */
    setPositionByXY: function( x, y ) {
      if ( x !== this.getPosition().x || y !== this.getPosition().y ) {

        // This default implementation assumes that the position indicator is defined by the center of the shape's bounds.
        // Override if some other behavior is required.
        var center = this.getCenter();
        this.translate( x - center.x, y - center.y );
      }
    },

    /**
     * @public
     */
    getCenter: function() {
      return this.centerPosition;
    },

    /**
     * @public
     */
    setCenter: function() {
      var center = this.bounds.getCenter();
      if ( !_.isFinite( center.x ) ) {
        center = this.shapeProperty.get().subpaths[ 0 ].points[ 0 ];
      }
      this.centerPosition = center;
    },

    /**
     * @returns {Vector2}
     * @public
     */
    getPosition: function() {
      // Assumes that the center of the shape is the position.  Override if other behavior is needed.
      return this.getCenter();
    }
  } );
} );
