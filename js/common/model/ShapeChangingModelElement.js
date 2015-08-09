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
        var center = this.getCenter();
        this.translate( new Vector2( x - center.x,
          y - center.y ) );
      }
    },

    /**
     * The Java version of shape.bounds returns the center even if the shape has only a single point
     * the kite version gives NAN in such cases. This is a WorkAround. Needs Fixing. TODO
     */
    getCenter: function() {
      var center = this.shape.bounds.getCenter();
      if ( !_.isFinite( center.x ) ) {
        return this.shape.subpaths[ 0 ].points[ 0 ];
      }
      return center;
    },


    /**
     *
     * @returns {Vector2}
     */
    getPosition: function() {
      // Assumes that the center of the shape is the position.  Override if
      // other behavior is needed.
      return this.getCenter();
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
