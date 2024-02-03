// Copyright 2015-2022, University of Colorado Boulder

/**
 * Several utilities for making it easier to create some complex and somewhat random shapes. This was created initially
 * to make it easier to create the shapes associated with biomolecules, but may have other uses.
 *
 * @author Sharfudeen Ashraf
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Random from '../../../../dot/js/Random.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import ShapeUtils from './ShapeUtils.js';

const BioShapeUtils = {
  /**
   * Create a distorted shape from a list of points.  This is useful when trying to animate some sort of deviation
   * from a basic shape.
   * Note that this works best when the points are centered around the point (0, 0), and may not work at all otherwise
   * (it has never been tested).
   *
   * @param {Array.<Vector2>} points
   * @param {number} distortionFactor
   * @param {number} randomNumberSeed
   * @returns {Shape}
   * @public
   */
  createdDistortedRoundedShapeFromPoints( points, distortionFactor, randomNumberSeed ) {
    const rand = new Random( {
      seed: randomNumberSeed
    } );

    // Alter the positions of the points that define the shape in order to define a distorted version of the shape.
    const alteredPoints = [];

    for ( let i = 0; i < points.length; i++ ) {
      const pointAsVector = points[ i ].copy();
      pointAsVector.multiplyScalar( 1 + ( rand.nextDouble() - 0.5 ) * distortionFactor );
      alteredPoints.push( pointAsVector );
    }

    // Create the basis for the new shape.
    const distortedShape = ShapeUtils.createRoundedShapeFromPoints( alteredPoints );

    return distortedShape;
  },

  /**
   * Create a shape based on a set of points. The points must be in an order that, if connected by straight lines,
   * would form a closed shape. Some of the segments will be straight lines and some will be curved, and which is
   * which will be based on a pseudo-random variable.
   *
   * @param {Array.<Vector2>} points
   * @param {number} seed
   * @returns {Shape}
   * @private
   */
  createRandomShapeFromPoints( points, seed ) {

    const shape = new Shape();
    const rand = new Random( {
      seed: seed
    } );
    let cp1 = Vector2.pool.fetch();
    let cp2 = Vector2.pool.fetch();

    shape.moveToPoint( points[ 0 ] );
    for ( let i = 0; i < points.length; i++ ) {
      const segmentStartPoint = points[ i ];
      const segmentEndPoint = points[ ( i + 1 ) % points.length ];
      const previousPoint = points[ i - 1 >= 0 ? i - 1 : points.length - 1 ];
      const nextPoint = points[ ( i + 2 ) % points.length ];
      cp1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint, cp1 );
      cp2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint, cp2 );
      if ( rand.nextBoolean() ) {
        // Curved segment.
        shape.cubicCurveTo( cp1.x, cp1.y, cp2.x, cp2.y, segmentEndPoint.x, segmentEndPoint.y );
      }
      else {
        // Straight segment.
        shape.lineTo( segmentEndPoint.x, segmentEndPoint.y );
      }
    }
    cp1.freeToPool();
    cp2.freeToPool();
    return shape;
  },

  /**
   * Calls createRandomShapeFromPoints to create random shape
   * @param {Dimension2} size
   * @param {number} seed
   * @returns {Shape}
   * @public
   */
  createRandomShape( size, seed ) {
    const pointList = [];
    const rand = new Random( {
      seed: seed
    } );
    // Create a series of points that will enclose a space.
    for ( let angle = 0; angle < 1.9 * Math.PI; angle += Math.PI / 10 + rand.nextDouble() * Math.PI / 10 ) {
      pointList.push( Vector2.createPolar( 0.5 + rand.nextDouble(), angle ) );
    }

    const unscaledShape = this.createRandomShapeFromPoints( pointList, seed );
    const unscaledShapeBounds = unscaledShape.bounds;

    // Scale the shape to the specified size.
    const horizontalScale = size.width / unscaledShapeBounds.width;
    const verticalScale = size.height / unscaledShapeBounds.height;

    const scaledMatrix = Matrix3.scaling( horizontalScale, verticalScale );
    return unscaledShape.transformed( scaledMatrix );
  },

  /**
   * Create a curvy line from a list of points. The points are assumed to be in order.
   *
   * @param {Array.<Vector2>} points
   * @returns {Shape}
   * @public
   */
  createCurvyLineFromPoints( points ) {
    assert && assert( points.length > 0 );

    // Control points, used throughout the code below for curving the line.
    let cp1 = Vector2.pool.fetch();
    let cp2 = Vector2.pool.fetch();

    const path = new Shape();
    path.moveTo( points[ 0 ].x, points[ 0 ].y );
    if ( points.length === 1 || points.length === 2 ) {

      // can't really create a curve from this, so draw a straight line to the end point and call it good
      path.lineTo( points[ points.length - 1 ].x, points[ points.length - 1 ].y );
      return path;
    }

    // create the first curved segment
    cp1 = ShapeUtils.extrapolateControlPoint( points[ 2 ], points[ 1 ], points[ 0 ], cp1 );
    path.quadraticCurveTo( cp1.x, cp1.y, points[ 1 ].x, points[ 1 ].y );

    // create the middle segments
    for ( let i = 1; i < points.length - 2; i++ ) {
      const segmentStartPoint = points[ i ];
      const segmentEndPoint = points[ i + 1 ];
      const previousPoint = points[ i - 1 ];
      const nextPoint = points[ ( i + 2 ) ];
      cp1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint, cp1 );
      cp2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint, cp2 );
      path.cubicCurveTo( cp1.x, cp1.y, cp2.x, cp2.y, segmentEndPoint.x, segmentEndPoint.y );
    }

    // create the final curved segment
    cp1 = ShapeUtils.extrapolateControlPoint(
      points[ points.length - 3 ],
      points[ points.length - 2 ],
      points[ points.length - 1 ],
      cp1
    );
    path.quadraticCurveTo( cp1.x, cp1.y, points[ points.length - 1 ].x, points[ points.length - 1 ].y );

    // free up the pre-allocated vectors
    cp1.freeToPool();
    cp2.freeToPool();

    return path;
  },

  /**
   * Create a shape that looks roughly like a 2D representation of E. Coli, which is essentially a rectangle with
   * round ends. Some randomization is added to the shape to make it look more like a natural object.
   *
   * @param {number} width
   * @param {number} height
   * @returns {Shape}
   * @public
   */
  createEColiLikeShape( width, height ) {
    assert && assert( width > height ); // Param checking.  Can't create the needed shape if this isn't true.

    // Tweakable parameters that affect number of points used to define the shape.
    const numPointsPerLineSegment = 8;
    const numPointsPerCurvedSegment = 8;

    // Adjustable parameter that affects the degree to which the shape is altered to make it look somewhat irregular.
    // Zero means no change from the perfect geometric shape, 1 means a lot of variation.
    const alterationFactor = 0.025;

    // The list of points that will define the shape.
    const pointList = [];

    // Random number generator used for deviation from the perfect geometric shape.
    const rand = new Random( {
      seed: 45 // empirically determined to make shape look distorted
    } );


    // Variables needed for the calculations.
    const curveRadius = height / 2;
    const lineLength = width - height;
    const rightCurveCenterX = width / 2 - height / 2;
    const leftCurveCenterX = -width / 2 + height / 2;
    const centerY = 0;
    let angle = 0;
    let radius = 0;
    let nextPoint = null;

    // Create a shape that is like E. Coli. Start at the left side of the line that defines the top edge and move
    // around the shape in a clockwise direction.

    // Add points for the top line.
    for ( let i = 0; i < numPointsPerLineSegment; i++ ) {
      nextPoint = new Vector2( leftCurveCenterX + i * ( lineLength / ( numPointsPerLineSegment - 1 ) ), centerY - height / 2 );
      nextPoint.setXY( nextPoint.x, nextPoint.y + ( rand.nextDouble() - 0.5 ) * height * alterationFactor );
      pointList.push( nextPoint );
    }

    // Add points that define the right curved edge. Skip what would be the first point, because it would overlap with
    // the previous segment.
    for ( let i = 1; i < numPointsPerCurvedSegment; i++ ) {
      angle = -Math.PI / 2 + i * ( Math.PI / ( numPointsPerCurvedSegment - 1 ) );
      radius = curveRadius + ( rand.nextDouble() - 0.5 ) * height * alterationFactor;
      pointList.push( new Vector2( rightCurveCenterX + radius * Math.cos( angle ), radius * Math.sin( angle ) ) );
    }

    // Add points that define the bottom line. Skip what would be the first point, because it would overlap with the
    // previous segment.
    for ( let i = 1; i < numPointsPerLineSegment; i++ ) {
      nextPoint = new Vector2( rightCurveCenterX - i * ( lineLength / ( numPointsPerLineSegment - 1 ) ), centerY + height / 2 );
      nextPoint.setXY( nextPoint.x, nextPoint.y + ( rand.nextDouble() - 0.5 ) * height * alterationFactor );
      pointList.push( nextPoint );
    }

    // Add points that define the left curved side. Skip what would be the first point and last points, because the
    // would overlap with the previous and next segment (respectively).
    for ( let i = 1; i < numPointsPerCurvedSegment - 1; i++ ) {
      angle = Math.PI / 2 + i * ( Math.PI / ( numPointsPerCurvedSegment - 1 ) );
      radius = curveRadius + ( rand.nextDouble() - 0.5 ) * height * alterationFactor;
      pointList.push( new Vector2( leftCurveCenterX + radius * Math.cos( angle ), radius * Math.sin( angle ) ) );
    }

    // Create the unrotated and untranslated shape.
    return ShapeUtils.createRoundedShapeFromPoints( pointList );
  }
};

geneExpressionEssentials.register( 'BioShapeUtils', BioShapeUtils );

export default BioShapeUtils;