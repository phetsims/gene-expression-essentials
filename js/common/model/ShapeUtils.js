//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Contains utility  methods for creating different shapes

 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );

  /* not intended for instantiation */
  function ShapeUtils() {

  }

  return inherit( Object, ShapeUtils, {}, {

    /**
     * Creates a rounded shape from a set of points.  The points must be in an
     * order that, if connected by straight lines, would form a closed shape.
     *
     * @param {Array} points Set of points to connect.
     * @return Shape that the provided points define.
     */
    createRoundedShapeFromPoints: function( points ) {
      var shape = new Shape();
      shape.moveToPoint( points[ 0 ] );
      for ( var i = 0; i < points.length; i++ ) {
        var segmentStartPoint = points[ i ];
        var segmentEndPoint = points[ ( i + 1 ) % points.length ];
        var previousPoint = points[ i - 1 >= 0 ? i - 1 : points.length - 1 ];
        var nextPoint = points[ ( i + 2 ) % points.length ];
        var controlPoint1 = this.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint );
        var controlPoint2 = this.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint );
        shape.cubicCurveTo( controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, segmentEndPoint.x, segmentEndPoint.y );
      }
      return shape;
    },


    /**
     * Extrapolates a control point given three input points.  The resulting
     * control point is for the segment from point y to point z, and the
     * resulting curve would reasonably connect to point x.
     *
     * @param {Vector2} x Location where the line is "coming from".
     * @param {Vector2} y Beginning of line segment.
     * @param {Vector2} z End of line segment.
     * @return Control point for segment from y to z.
     */
    extrapolateControlPoint: function( x, y, z ) {
      var xy = y.minus( x );
      var yz = z.minus( y );
      return y.plus( xy.timesScalar( 0.25 ).plus( yz.timesScalar( 0.25 ) ) );
    }

  } );

} );
