// Copyright 2015, University of Colorado Boulder
/**
 * Several utilities for making it easier to create some complex and somewhat
 * random shapes.  This was created initially to make it easier to create the
 * shapes associated with biomolecules, but may have other uses.

 * @author Sharfudeen Ashraf
 * @author Mohamed Safi
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var Random = require( 'DOT/Random' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Vector2 = require( 'DOT/Vector2' );
  var ShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeUtils' );

  /* not intended for instantiation */
  function BioShapeUtils() {

  }

  geneExpressionEssentials.register( 'BioShapeUtils', BioShapeUtils );

  return inherit( Object, BioShapeUtils, {}, {

    /**
     * Create a distorted shape from a list of points.  This is useful when
     * trying to animate some sort of deviation from a basic shape.
     * <p/>
     * Note that this works best when the points are centered around the point
     * (0, 0), and may not work at all otherwise (it has never been tested).
     *
     * @param {Array<Vector2>} points
     * @param {number} distortionFactor
     * @param {number} randomNumberSeed
     * @return
     */
    createdDistortedRoundedShapeFromPoints: function( points, distortionFactor, randomNumberSeed ) {
      // Determine the center location of the undistorted shape.
      var undistortedShape = ShapeUtils.createRoundedShapeFromPoints( points );
      var undistortedShapeBounds = undistortedShape.bounds;
      var undistortedShapeCenter = undistortedShapeBounds.getCenter();

      var rand = new Random( {
        seed: randomNumberSeed
      });
      // Alter the positions of the points that define the shape in order to
      // define a distorted version of the shape.
      var alteredPoints = [];


      for ( var i = 0; i < points.length; i++ ) {
        var pointAsVector = points[ i ].copy();
        pointAsVector.multiplyScalar( 1 + ( rand.nextDouble() - 0.5 ) * distortionFactor );
        alteredPoints.push( pointAsVector );
      }

      // Create the basis for the new shape.
      var distortedShape = ShapeUtils.createRoundedShapeFromPoints( alteredPoints );
      // Determine the center of the new shape.
      var distortedShapeCenter = distortedShape.bounds.getCenter();
      // Shift the new shape so that the center is in the same place as the old one.
      var translationMatrix = Matrix3.translation( undistortedShapeCenter.x - distortedShapeCenter.x,
        undistortedShapeCenter.y - distortedShapeCenter.y );
      distortedShape = distortedShape.transformed( translationMatrix );

      return distortedShape;

    },

    /**
     * Create a shape based on a set of points.  The points must be in an order
     * that, if connected by straight lines, would form a closed shape.  Some of
     * the segments will be straight lines and some will be curved, and which is
     * which will be based on a pseudo-random variable.
     *
     * @private
     * @param {Array<Vector2>} points
     * @param {number} seed
     * @return {Shape}
     */
    createRandomShapeFromPoints: function( points, seed ) {
      var path = new Shape();
      var rand = new Random( {
        seed: seed
      });
      path.moveToPoint( points[ 0 ] );
      for ( var i = 0; i < points.length; i++ ) {
        var segmentStartPoint = points[ i ];
        var segmentEndPoint = points[ ( i + 1 ) % points.length ];
        var previousPoint = points[ i - 1 >= 0 ? i - 1 : points.length - 1 ];
        var nextPoint = points[ ( i + 2 ) % points.length ];
        var controlPoint1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint );
        var controlPoint2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint );
        if ( rand.nextBoolean() ) {
          // Curved segment.
          path.cubicCurveTo( controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, segmentEndPoint.x, segmentEndPoint.y );
        }
        else {
          // Straight segment.
          path.lineTo( segmentEndPoint.x, segmentEndPoint.y );
        }
      }
      return path;
    },

    /**
     * @param {Dimension2D} size
     * @param {number} seed -Not Used
     * @return {Shape}
     */
    createRandomShape: function( size, seed ) {
      var pointList = [];
      var rand = new Random( {
        seed: seed
      });
      // Create a series of points that will enclose a space.
      for ( var angle = 0; angle < 1.9 * Math.PI; angle += Math.PI / 10 + rand.nextDouble() * Math.PI / 10 ) {
        pointList.push( Vector2.createPolar( 0.5 + rand.nextDouble(), angle ) );
      }

      var unscaledShape = this.createRandomShapeFromPoints( pointList, seed );
      var unscaledShapeBounds = unscaledShape.bounds;

      // Scale the shape to the specified size.
      var horizontalScale = size.width / unscaledShapeBounds.width;
      var verticalScale = size.height / unscaledShapeBounds.height;

      var scaledMatrix = Matrix3.scaling( horizontalScale, verticalScale );
      return unscaledShape.transformed( scaledMatrix );
    },

    /**
     * Create a curvy line from a list of points.  The points are assumed to be
     * in order.
     *
     * @param {Array<Vector2>} points
     * @return {Shape}
     */
    createCurvyLineFromPoints: function( points ) {
      assert && assert( points.length > 0 );

      // Control points, used throughout the code below for curving the line.
      var cp1;

      var path = new Shape();
      path.moveTo( points[ 0 ].x,  points[ 0 ].y);
      if ( points.length === 1 || points.length === 2 ) {
        // Can't really create a curve from this, so draw a straight line
        // to the end point and call it good.
        path.lineTo( points[ points.length - 1 ].x,points[ points.length - 1 ].y );
        return path;
      }
      // Create the first curved segment.
      cp1 = ShapeUtils.extrapolateControlPoint( points[ 2 ], points[ 1 ], points[ 0 ] );
      path.quadraticCurveTo( cp1.x, cp1.y, points[ 1 ].x, points[ 1 ].y );
      // Create the middle segments.
      for ( var i = 1; i < points.length - 2; i++ ) {
        var segmentStartPoint = points[ i ];
        var segmentEndPoint = points[ i + 1 ];
        var previousPoint = points[ i - 1 ];
        var nextPoint = points[ ( i + 2 ) ];
        var controlPoint1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint );
        var controlPoint2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint );
        path.cubicCurveTo( controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, segmentEndPoint.x,
          segmentEndPoint.y );
      }
      // Create the final curved segment.
      cp1 = ShapeUtils.extrapolateControlPoint( points[ points.length - 3 ], points[ points.length - 2 ],
        points[ points.length - 1 ] );

      path.quadraticCurveTo( cp1.x, cp1.y, points[ points.length - 1 ].x, points[ points.length - 1 ].y );
      return path;
    },

    /**
     *
     * @param {Array<Vector2>} points
     * @returns {Shape}
     */
    createSegmentedLineFromPoints: function( points ) {
      assert && assert( points.length > 0 );
      var path = new Shape();
      path.moveToPoint( points[ 0 ] );
      for ( var i = 0; i < points.length; i++ ) {
        path.lineToPoint( points[ i ] );
      }
      return path;
    },

    /**
     * Create a curvy shape that is pretty much within the provided bounds.
     * Full enclosure within the bounds is not guaranteed.  This was initially
     * written for the purpose of creating shapes that look like cells, but it
     * may have other uses.
     *
     * @param {Bounds2} bounds
     * @param seed
     * @return {Shape}
     */
    createCurvyEnclosedShape: function( bounds, variationFactor, seed ) {

      // Limit the variation to the allowed range.
      assert && assert( variationFactor >= 0 && variationFactor <= 1 ); // Catch incorrect uses when debugging.
      variationFactor = Util.clamp( variationFactor, 0, 1 ); // Prevent them at run time.

      var rand = new Random( {
        seed: seed
      });

      // Use variables names that are typical when working with ellipses.
      var a = bounds.getWidth() / 2;
      var b = bounds.getHeight() / 2;

      var centerOfEllipse = bounds.getCenter();
      var vectorToEdge = new Vector2();
      var pointList = [];
      var numPoints = 8;
      for ( var angle = 0; angle < 2 * Math.PI; angle += 2 * Math.PI / numPoints ) {
        var alteredAngle = angle + ( 2 * Math.PI / numPoints * ( rand.nextDouble() - 0.5 ) * variationFactor );
        vectorToEdge.setXY( a * Math.sin( alteredAngle ), b * Math.cos( alteredAngle ) );
        pointList.push( centerOfEllipse.plus( vectorToEdge ) );
      }

      return ShapeUtils.createRoundedShapeFromPoints( pointList );
    },

    /**
     * Create a shape that looks roughly like a 2D representation of E. Coli,
     * which is essentially a rectangle with round ends.  Some randomization is
     * added to the shape to make it look more like a natural object.
     *
     * @param {Vector2} center
     * @param {number} width
     * @param {number} height
     * @param {number} rotationAngle
     * @return
     */
    createEColiLikeShape: function( center, width, height, rotationAngle, seed ) {
      assert && assert( width > height ); // Param checking.  Can't create the needed shape if this isn't true.

      // Tweakable parameters that affect number of points used to define the shape.
      var numPointsPerLineSegment = 8;
      var numPointsPerCurvedSegment = 8;

      // Adjustable parameter that affects the degree to which the shape is
      // altered to make it look somewhat irregular.  Zero means no change
      // from the perfect geometric shape, 1 means a lot of variation.
      var alterationFactor = 0.025;

      // The list of points that will define the shape.
      var pointList = [];

      // Random number generator used for deviation from the perfect geometric shape.
      var rand = new Random( {
        seed: seed
      } );


      // Variables needed for the calculations.
      var curveRadius = height / 2;
      var lineLength = width - height;
      var rightCurveCenterX = width / 2 - height / 2;
      var leftCurveCenterX = -width / 2 + height / 2;
      var centerY = 0;
      var angle = 0;
      var radius = 0;
      var nextPoint = null;

      // Create a shape that is like E. Coli.  Start at the left side of the
      // line that defines the top edge and move around the shape in a
      // clockwise direction.

      // Add points for the top line.
      for ( var i = 0; i < numPointsPerLineSegment; i++ ) {
        nextPoint = new Vector2( leftCurveCenterX + i * ( lineLength / ( numPointsPerLineSegment - 1 ) ), centerY - height / 2 );
        nextPoint.setXY( nextPoint.x, nextPoint.y + ( rand.nextDouble() - 0.5 ) * height * alterationFactor );
        pointList.push( nextPoint );
      }
      // Add points that define the right curved edge.  Skip what would be
      // the first point, because it would overlap with the previous segment.
      for ( i = 1; i < numPointsPerCurvedSegment; i++ ) {
        angle = -Math.PI / 2 + i * ( Math.PI / ( numPointsPerCurvedSegment - 1 ) );
        radius = curveRadius + ( rand.nextDouble() - 0.5 ) * height * alterationFactor;
        pointList.push( new Vector2( rightCurveCenterX + radius * Math.cos( angle ), radius * Math.sin( angle ) ) );
      }
      // Add points that define the bottom line.  Skip what would be
      // the first point, because it would overlap with the previous segment.
      for ( i = 1; i < numPointsPerLineSegment; i++ ) {
        nextPoint = new Vector2( rightCurveCenterX - i * ( lineLength / ( numPointsPerLineSegment - 1 ) ), centerY + height / 2 );
        nextPoint.setXY( nextPoint.x, nextPoint.y + ( rand.nextDouble() - 0.5 ) * height * alterationFactor );
        pointList.push( nextPoint );
      }
      // Add points that define the left curved side.  Skip what would be
      // the first point and last points, because the would overlap with the
      // previous and next segment (respectively).
      for ( i = 1; i < numPointsPerCurvedSegment - 1; i++ ) {
        angle = Math.PI / 2 + i * ( Math.PI / ( numPointsPerCurvedSegment - 1 ) );
        radius = curveRadius + ( rand.nextDouble() - 0.5 ) * height * alterationFactor;
        pointList.push( new Vector2( leftCurveCenterX + radius * Math.cos( angle ), radius * Math.sin( angle ) ) );
      }

      // Create the unrotated and untranslated shape.
      var untranslatedAndUnrotatedShape = ShapeUtils.createRoundedShapeFromPoints( pointList );

      // Rotate and translate.
      var untranslatedShape = untranslatedAndUnrotatedShape.transformed( Matrix3.rotation2( rotationAngle ) );
      var finalShape = untranslatedShape.transformed( Matrix3.translation( center.x, center.x ) );

      return finalShape;
    }

  } );


} )
;


//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import java.awt.Color;
//import java.awt.Shape;
//import java.awt.geom.AffineTransform;
//import java.awt.geom.Dimension2D;
//import java.awt.geom.Point2D;
//import java.awt.geom.Rectangle2D;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Random;
//
//import javax.swing.JFrame;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.vector.MutableVector2D;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.view.util.DoubleGeneralPath;
//import edu.colorado.phet.common.phetcommon.view.util.ShapeUtils;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.umd.cs.piccolo.PCanvas;
//import edu.umd.cs.piccolo.util.PDimension;
//
///**
// * Several utilities for making it easier to create some complex and somewhat
// * random shapes.  This was created initially to make it easier to create the
// * shapes associated with biomolecules, but may have other uses.
// *
// * @author John Blanco
// */
//public class BioShapeUtils {
//
//    /* not intended for instantiation */
//    private BioShapeUtils() {
//    }
//
//    /**
//     * Create a distorted shape from a list of points.  This is useful when
//     * trying to animate some sort of deviation from a basic shape.
//     * <p/>
//     * Note that this works best when the points are centered around the point
//     * (0, 0), and may not work at all otherwise (it has never been tested).
//     *
//     * @param points
//     * @param distortionFactor
//     * @param randomNumberSeed
//     * @return
//     */
//    public static Shape createdDistortedRoundedShapeFromPoints( List<Point2D> points, double distortionFactor, long randomNumberSeed ) {
//        // Determine the center location of the undistorted shape.
//        Shape undistortedShape = ShapeUtils.createRoundedShapeFromPoints( points );
//        Point2D undistortedShapeCenter = new Point2D.Double( undistortedShape.getBounds2D().getCenterX(), undistortedShape.getBounds2D().getCenterY() );
//        // Alter the positions of the points that define the shape in order to
//        // define a distorted version of the shape.
//        Random rand = new Random( randomNumberSeed );
//        List<Point2D> alteredPoints = new ArrayList<Point2D>();
//        for ( Point2D point : points ) {
//            MutableVector2D pointAsVector = new MutableVector2D( point );
//            pointAsVector.scale( 1 + ( rand.nextDouble() - 0.5 ) * distortionFactor );
//            alteredPoints.add( pointAsVector.toPoint2D() );
//        }
//        // Create the basis for the new shape.
//        Shape distortedShape = ShapeUtils.createRoundedShapeFromPoints( alteredPoints );
//        // Determine the center of the new shape.
//        Point2D distortedShapeCenter = new Point2D.Double( distortedShape.getBounds2D().getCenterX(), distortedShape.getBounds2D().getCenterY() );
//        // Shift the new shape so that the center is in the same place as the old one.
//        distortedShape = AffineTransform.getTranslateInstance( undistortedShapeCenter.getX() - distortedShapeCenter.getX(),
//                                                               undistortedShapeCenter.getY() - distortedShapeCenter.getY() ).createTransformedShape( distortedShape );
//
//        return distortedShape;
//    }
//
//    /**
//     * Create a shape based on a set of points.  The points must be in an order
//     * that, if connected by straight lines, would form a closed shape.  Some of
//     * the segments will be straight lines and some will be curved, and which is
//     * which will be based on a pseudo-random variable.
//     *
//     * @param points
//     * @param seed
//     * @return
//     */
//    private static Shape createRandomShapeFromPoints( List<Point2D> points, int seed ) {
//        Random rand = new Random( seed );
//        DoubleGeneralPath path = new DoubleGeneralPath();
//        path.moveTo( points.get( 0 ) );
//        for ( int i = 0; i < points.size(); i++ ) {
//            Vector2D segmentStartPoint = new Vector2D( points.get( i ) );
//            Vector2D segmentEndPoint = new Vector2D( points.get( ( i + 1 ) % points.size() ) );
//            Vector2D previousPoint = new Vector2D( points.get( i - 1 >= 0 ? i - 1 : points.size() - 1 ) );
//            Vector2D nextPoint = new Vector2D( points.get( ( i + 2 ) % points.size() ) );
//            Vector2D controlPoint1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint );
//            Vector2D controlPoint2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint );
//            if ( rand.nextBoolean() ) {
//                // Curved segment.
//                path.curveTo( controlPoint1.getX(), controlPoint1.getY(), controlPoint2.getX(), controlPoint2.getY(), segmentEndPoint.getX(), segmentEndPoint.getY() );
//            }
//            else {
//                // Straight segment.
//                path.lineTo( segmentEndPoint.getX(), segmentEndPoint.getY() );
//            }
//        }
//        return path.getGeneralPath();
//    }
//
//    public static Shape createRandomShape( Dimension2D size, int seed ) {
//        Random rand = new Random( seed );
//        List<Point2D> pointList = new ArrayList<Point2D>();
//        // Create a series of points that will enclose a space.
//        for ( double angle = 0; angle < 1.9 * Math.PI; angle += Math.PI / 10 + rand.nextDouble() * Math.PI / 10 ) {
//            pointList.add( Vector2D.createPolar( 0.5 + rand.nextDouble(), angle ).toPoint2D() );
//        }
//
//        Shape unscaledShape = createRandomShapeFromPoints( pointList, seed );
//
//        // Scale the shape to the specified size.
//        double horizontalScale = size.getWidth() / unscaledShape.getBounds2D().getWidth();
//        double verticalScale = size.getHeight() / unscaledShape.getBounds2D().getHeight();
//        return AffineTransform.getScaleInstance( horizontalScale, verticalScale ).createTransformedShape( unscaledShape );
//    }
//
//    /**
//     * Create a curvy line from a list of points.  The points are assumed to be
//     * in order.
//     *
//     * @param points
//     * @return
//     */
//    public static Shape createCurvyLineFromPoints( List<Point2D> points ) {
//        assert points.size() > 0;
//
//        // Control points, used throughout the code below for curving the line.
//        Vector2D cp1;
//
//        DoubleGeneralPath path = new DoubleGeneralPath();
//        path.moveTo( points.get( 0 ) );
//        if ( points.size() == 1 || points.size() == 2 ) {
//            // Can't really create a curve from this, so draw a straight line
//            // to the end point and call it good.
//            path.lineTo( points.get( points.size() - 1 ) );
//            return path.getGeneralPath();
//        }
//        // Create the first curved segment.
//        cp1 = ShapeUtils.extrapolateControlPoint( new Vector2D( points.get( 2 ) ),
//                                                  new Vector2D( points.get( 1 ) ),
//                                                  new Vector2D( points.get( 0 ) ) );
//        path.quadTo( cp1.getX(), cp1.getY(), points.get( 1 ).getX(), points.get( 1 ).getY() );
//        // Create the middle segments.
//        for ( int i = 1; i < points.size() - 2; i++ ) {
//            Vector2D segmentStartPoint = new Vector2D( points.get( i ) );
//            Vector2D segmentEndPoint = new Vector2D( points.get( ( i + 1 ) ) );
//            Vector2D previousPoint = new Vector2D( points.get( i - 1 ) );
//            Vector2D nextPoint = new Vector2D( points.get( ( i + 2 ) ) );
//            Vector2D controlPoint1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint );
//            Vector2D controlPoint2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint );
//            path.curveTo( controlPoint1.getX(), controlPoint1.getY(), controlPoint2.getX(), controlPoint2.getY(), segmentEndPoint.getX(), segmentEndPoint.getY() );
//        }
//        // Create the final curved segment.
//        cp1 = ShapeUtils.extrapolateControlPoint( new Vector2D( points.get( points.size() - 3 ) ),
//                                                  new Vector2D( points.get( points.size() - 2 ) ),
//                                                  new Vector2D( points.get( points.size() - 1 ) ) );
//        path.quadTo( cp1.getX(), cp1.getY(), points.get( points.size() - 1 ).getX(), points.get( points.size() - 1 ).getY() );
//        return path.getGeneralPath();
//    }
//
//    public static Shape createSegmentedLineFromPoints( List<Point2D> points ) {
//        assert points.size() > 0;
//        DoubleGeneralPath path = new DoubleGeneralPath();
//        path.moveTo( points.get( 0 ) );
//        for ( Point2D point : points ) {
//            path.lineTo( point );
//        }
//        return path.getGeneralPath();
//    }
//
//    /**
//     * Create a curvy shape that is pretty much within the provided bounds.
//     * Full enclosure within the bounds is not guaranteed.  This was initially
//     * written for the purpose of creating shapes that look like cells, but it
//     * may have other uses.
//     *
//     * @param bounds
//     * @param seed
//     * @return
//     */
//    private static Shape createCurvyEnclosedShape( Rectangle2D bounds, double variationFactor, long seed ) {
//
//        // Limit the variation to the allowed range.
//        assert variationFactor >= 0 && variationFactor <= 1; // Catch incorrect uses when debugging.
//        variationFactor = MathUtil.clamp( 0, variationFactor, 1 ); // Prevent them at run time.
//
//        // Create random number generator for use in varying the shape.
//        Random rand = new Random( seed );
//
//        // Use variables names that are typical when working with ellipses.
//        double a = bounds.getWidth() / 2;
//        double b = bounds.getHeight() / 2;
//
//        Vector2D centerOfEllipse = new Vector2D( bounds.getCenterX(), bounds.getCenterY() );
//        MutableVector2D vectorToEdge = new MutableVector2D();
//        List<Point2D> pointList = new ArrayList<Point2D>();
//        int numPoints = 8;
//        for ( double angle = 0; angle < 2 * Math.PI; angle += 2 * Math.PI / numPoints ) {
//            double alteredAngle = angle + ( 2 * Math.PI / numPoints * ( rand.nextDouble() - 0.5 ) * variationFactor );
//            vectorToEdge.setComponents( a * Math.sin( alteredAngle ), b * Math.cos( alteredAngle ) );
//            pointList.add( centerOfEllipse.plus( vectorToEdge ).toPoint2D() );
//        }
//
//        return ShapeUtils.createRoundedShapeFromPoints( pointList );
//    }
//
//    /**
//     * Create a shape that looks roughly like a 2D representation of E. Coli,
//     * which is essentially a rectangle with round ends.  Some randomization is
//     * added to the shape to make it look more like a natural object.
//     *
//     * @param center
//     * @param width
//     * @param height
//     * @param rotationAngle
//     * @return
//     */
//    public static Shape createEColiLikeShape( Point2D center, double width, double height, double rotationAngle, long seed ) {
//        assert width > height; // Param checking.  Can't create the needed shape if this isn't true.
//
//        // Tweakable parameters that affect number of points used to define
//        // the shape.
//        final int numPointsPerLineSegment = 8;
//        final int numPointsPerCurvedSegment = 8;
//
//        // Adjustable parameter that affects the degree to which the shape is
//        // altered to make it look somewhat irregular.  Zero means no change
//        // from the perfect geometric shape, 1 means a lot of variation.
//        final double alterationFactor = 0.025;
//
//        // The list of points that will define the shape.
//        List<Point2D> pointList = new ArrayList<Point2D>();
//
//        // Random number generator used for deviation from the perfect
//        // geometric shape.
//        Random rand = new Random( seed );
//
//        // Variables needed for the calculations.
//        double curveRadius = height / 2;
//        double lineLength = width - height;
//        double rightCurveCenterX = width / 2 - height / 2;
//        double leftCurveCenterX = -width / 2 + height / 2;
//        double centerY = 0;
//
//        // Create a shape that is like E. Coli.  Start at the left side of the
//        // line that defines the top edge and move around the shape in a
//        // clockwise direction.
//
//        // Add points for the top line.
//        for ( int i = 0; i < numPointsPerLineSegment; i++ ) {
//            Point2D.Double nextPoint = new Point2D.Double( leftCurveCenterX + i * ( lineLength / ( numPointsPerLineSegment - 1 ) ), centerY - height / 2 );
//            nextPoint.setLocation( nextPoint.getX(), nextPoint.getY() + ( rand.nextDouble() - 0.5 ) * height * alterationFactor );
//            pointList.add( nextPoint );
//        }
//        // Add points that define the right curved edge.  Skip what would be
//        // the first point, because it would overlap with the previous segment.
//        for ( int i = 1; i < numPointsPerCurvedSegment; i++ ) {
//            double angle = -Math.PI / 2 + i * ( Math.PI / ( numPointsPerCurvedSegment - 1 ) );
//            double radius = curveRadius + ( rand.nextDouble() - 0.5 ) * height * alterationFactor;
//            pointList.add( new Point2D.Double( rightCurveCenterX + radius * Math.cos( angle ), radius * Math.sin( angle ) ) );
//        }
//        // Add points that define the bottom line.  Skip what would be
//        // the first point, because it would overlap with the previous segment.
//        for ( int i = 1; i < numPointsPerLineSegment; i++ ) {
//            Point2D.Double nextPoint = new Point2D.Double( rightCurveCenterX - i * ( lineLength / ( numPointsPerLineSegment - 1 ) ), centerY + height / 2 );
//            nextPoint.setLocation( nextPoint.getX(), nextPoint.getY() + ( rand.nextDouble() - 0.5 ) * height * alterationFactor );
//            pointList.add( nextPoint );
//        }
//        // Add points that define the left curved side.  Skip what would be
//        // the first point and last points, because the would overlap with the
//        // previous and next segment (respectively).
//        for ( int i = 1; i < numPointsPerCurvedSegment - 1; i++ ) {
//            double angle = Math.PI / 2 + i * ( Math.PI / ( numPointsPerCurvedSegment - 1 ) );
//            double radius = curveRadius + ( rand.nextDouble() - 0.5 ) * height * alterationFactor;
//            pointList.add( new Point2D.Double( leftCurveCenterX + radius * Math.cos( angle ), radius * Math.sin( angle ) ) );
//        }
//
//        // Create the unrotated and untranslated shape.
//        Shape untranslatedAndUnrotatedShape = ShapeUtils.createRoundedShapeFromPoints( pointList );
//
//        // Rotate and translate.
//        Shape untranslatedShape = AffineTransform.getRotateInstance( rotationAngle ).createTransformedShape( untranslatedAndUnrotatedShape );
//        Shape finalShape = AffineTransform.getTranslateInstance( center.getX(), center.getY() ).createTransformedShape( untranslatedShape );
//
//        return finalShape;
//    }
//
//    // Test harness.
//    public static void main( String[] args ) {
//        System.out.println( "Shape testing..." );
//        List<Point2D> vLikePointList = new ArrayList<Point2D>() {{
//            // V-like shape.
//            add( new Point2D.Double( 0, 0 ) );
//            add( new Point2D.Double( 20, -10 ) );
//            add( new Point2D.Double( 0, 40 ) );
//            add( new Point2D.Double( -20, -10 ) );
//        }};
//
//        /*
//        List<Point2D> squarePointList = new ArrayList<Point2D>() {{
//            add( new Point2D.Double( 0, 0 ) );
//            add( new Point2D.Double( 20, 0 ) );
//            add( new Point2D.Double( 20, -20 ) );
//            add( new Point2D.Double( 0, -20 ) );
//            // Unit square - useful for debug in some cases.
////            add( new Point2D.Double( 0, 0 ) );
////            add( new Point2D.Double( 1, 0 ) );
////            add( new Point2D.Double( 1, -1 ) );
////            add( new Point2D.Double( 0, -1 ) );
//        }};
//        */
//
//        // Add the shapes.  Many are translated somewhat to avoid overlap.
//        PCanvas canvas = new PCanvas();
//        Shape shape = ShapeUtils.createShapeFromPoints( vLikePointList );
//        canvas.getLayer().addChild( new PhetPPath( AffineTransform.getTranslateInstance( 50, 50 ).createTransformedShape( shape ), Color.PINK ) );
//        shape = ShapeUtils.createRoundedShapeFromPoints( vLikePointList );
//        canvas.getLayer().addChild( new PhetPPath( AffineTransform.getTranslateInstance( 100, 50 ).createTransformedShape( shape ), Color.GREEN ) );
//        shape = BioShapeUtils.createRandomShapeFromPoints( vLikePointList, 101 );
//        canvas.getLayer().addChild( new PhetPPath( AffineTransform.getTranslateInstance( 50, 100 ).createTransformedShape( shape ), Color.ORANGE ) );
//        shape = BioShapeUtils.createRandomShape( new PDimension( 40, 40 ), 100 );
//        canvas.getLayer().addChild( new PhetPPath( AffineTransform.getTranslateInstance( 100, 100 ).createTransformedShape( shape ), Color.BLUE ) );
//        shape = BioShapeUtils.createRandomShape( new PDimension( 80, 40 ), 123 );
//        canvas.getLayer().addChild( new PhetPPath( AffineTransform.getTranslateInstance( 50, 200 ).createTransformedShape( shape ), Color.MAGENTA ) );
//
//        shape = BioShapeUtils.createCurvyEnclosedShape( new Rectangle2D.Double( -100, -50, 200, 100 ), 1, 0 );
//        canvas.getLayer().addChild( new PhetPPath( AffineTransform.getTranslateInstance( 200, 200 ).createTransformedShape( shape ), Color.BLACK ) );
//
//        // Boiler plate app stuff.
//        JFrame frame = new JFrame( "Shape Util Testing" );
//        frame.setContentPane( canvas );
//        frame.setSize( 500, 500 );
//        frame.setDefaultCloseOperation( JFrame.EXIT_ON_CLOSE );
//        frame.setVisible( true );
//    }
//}
