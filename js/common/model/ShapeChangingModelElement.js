//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Base class for elements in the model that change shape and/or move around.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Vector2 = require( 'DOT/Vector2' );
  var PropertySet = require( 'AXON/PropertySet' );


  /**
   * @abstract
   * @param {Shape} initialShape
   * @constructor
   */
  function ShapeChangingModelElement( initialShape, props ) {

    PropertySet.call( this, _.extend( {
      // Shape property, which is not public because it should only be changed by descendants of the class.
      shape: initialShape
    }, props || {} ) );

    //cache the bounds, instead of calculating it every time
    this.shapeBounds = initialShape.computeBounds();
  }

  return inherit( PropertySet, ShapeChangingModelElement, {

    /**
     *
     * @returns {Shape}
     */
    getShape: function() {
      return this.shapeProperty.get();
    },

    /**
     *
     * @param {Function} shapeChangeObserver
     */
    addShapeChangeObserver: function( shapeChangeObserver ) {
      this.shapeProperty.link( shapeChangeObserver );
    },

    /**
     *
     * @param {Function} shapeChangeObserver
     */
    removeShapeChangeObserver: function( shapeChangeObserver ) {
      this.shapeProperty.unlink( shapeChangeObserver );
    },

    /**
     *
     * @param {Vector2} translationVector
     */
    translate: function( translationVector ) {
      var translationTransform = Matrix3.translation( translationVector.x, translationVector.y );
      this.shapeProperty.set( this.shapeProperty.get().transformed( translationTransform ) );
      this.shapeBounds = this.shapeProperty.get().computeBounds();
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

        // This default implementation assumes that the position indicator
        // is defined by the center of the shape's bounds.  Override if
        // some other behavior is required.
        this.translate( new Vector2( x - this.shapeBounds.getCenterX(),
          y - this.shapeBounds.getCenterY() ) );

      }
    },

    /**
     *
     * @returns {Vector2}
     */
    getPosition: function() {
      // Assumes that the center of the shape is the position.  Override if
      // other behavior is needed.
      return this.shapeBounds.getCenter();
    }

  } );

} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import java.awt.Shape;
//import java.awt.geom.AffineTransform;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//
///**
// * Base class for elements in the model that change shape and/or move around.
// *
// * @author John Blanco
// */
//public abstract class ShapeChangingModelElement {
//
//    // Shape property, which is not public because it should only be changed
//    // by descendants of the class.
//    protected final Property<Shape> shapeProperty;
//
//    public ShapeChangingModelElement( Shape initialShape ) {
//        this.shapeProperty = new Property<Shape>( initialShape );
//    }
//
//    public Shape getShape() {
//        return shapeProperty.get();
//    }
//
//    public void addShapeChangeObserver( VoidFunction1<Shape> shapeChangeObserver ) {
//        shapeProperty.addObserver( shapeChangeObserver );
//    }
//
//    public void removeShapeChangeObserver( VoidFunction1<Shape> shapeChangeObserver ) {
//        shapeProperty.removeObserver( shapeChangeObserver );
//    }
//
//    public void translate( Vector2D translationVector ) {
//        AffineTransform translationTransform = AffineTransform.getTranslateInstance( translationVector.getX(), translationVector.getY() );
//        shapeProperty.set( translationTransform.createTransformedShape( shapeProperty.get() ) );
//    }
//
//    public void setPosition( Vector2D newPos ) {
//        setPosition( newPos.getX(), newPos.getY() );
//    }
//
//    public void setPosition( double x, double y ) {
//        if ( x != getPosition().getX() || y != getPosition().getY() ) {
//            // This default implementation assumes that the position indicator
//            // is defined by the center of the shape's bounds.  Override if
//            // some other behavior is required.
//            translate( new Vector2D( x - shapeProperty.get().getBounds2D().getCenterX(),
//                                     y - shapeProperty.get().getBounds2D().getCenterY() ) );
//        }
//    }
//
//    public Vector2D getPosition() {
//        // Assumes that the center of the shape is the position.  Override if
//        // other behavior is needed.
//        return new Vector2D( shapeProperty.get().getBounds2D().getCenterX(), shapeProperty.get().getBounds2D().getCenterY() );
//    }
//}
