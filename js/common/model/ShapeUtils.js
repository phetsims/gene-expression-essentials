// Copyright 2015-2017, University of Colorado Boulder

/**
 * Contains utility  methods for creating different shapes
 *
 * @author John Blanco
 * @author Sharfudeen Ashraf
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  var ShapeUtils = {

    /**
     * Creates a rounded shape from a set of points. The points must be in an order that, if connected by straight lines,
     * would form a closed shape.
     *
     * @param {Array} points Set of points to connect.
     * @param {Shape} [existingShape]
     * @returns Shape that the provided points define.
     * @public
     */
    createRoundedShapeFromPoints: function( points, existingShape ) {
      var shape = existingShape || new Shape();
      shape.moveToPoint( points[ 0 ] );
      var cp1 = Vector2.dirtyFromPool();
      var cp2 = Vector2.dirtyFromPool();
      for ( var i = 0; i < points.length; i++ ) {
        var segmentStartPoint = points[ i ];
        var segmentEndPoint = points[ ( i + 1 ) % points.length ];
        var previousPoint = points[ i - 1 >= 0 ? i - 1 : points.length - 1 ];
        var nextPoint = points[ ( i + 2 ) % points.length ];
        cp1 = this.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint, cp1 );
        cp2 = this.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint, cp2 );
        shape.cubicCurveTo( cp1.x, cp1.y, cp2.x, cp2.y, segmentEndPoint.x, segmentEndPoint.y );
      }
      cp1.freeToPool();
      cp2.freeToPool();
      return shape.makeImmutable();
    },

    /**
     * Extrapolates a control point given three input points. The resulting control point is for the segment from point y
     * to point z, and the resulting curve would reasonably connect to point x.
     *
     * @param {Object} x - Location where the line is "coming from".
     * @param {Object} y - Beginning of line segment.
     * @param {Object} z - End of line segment.
     * @param {Vector2} cp - control point to be set and returned
     * @returns {Object}
     * @public
     */
    extrapolateControlPoint: function( x, y, z, cp ) {
      var xz_x = 0.25 * ( z.x - x.x );
      var xz_y = 0.25 * ( z.y - x.y );
      return( cp.setXY( y.x + xz_x, y.y + xz_y ) );
    }
  };
  geneExpressionEssentials.register( 'ShapeUtils', ShapeUtils );
  return ShapeUtils;
} );
