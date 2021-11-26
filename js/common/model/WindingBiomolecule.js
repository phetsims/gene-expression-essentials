// Copyright 2015-2021, University of Colorado Boulder

/**
 * Biomolecule that is a represented as a wound up strand. Generally, this refers to some sort of RNA. The complicated
 * part of this is the algorithm that is used to wind the strand.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GEEConstants from '../GEEConstants.js';
import BioShapeUtils from './BioShapeUtils.js';
import MobileBiomolecule from './MobileBiomolecule.js';
import ShapeDefiningPoint from './ShapeDefiningPoint.js';

// constants
// Color used by this molecule. Since mRNA is depicted as a line and not as a closed shape, a transparent color is
// used for the fill. This enables reuse of generic biomolecule classes.
const NOMINAL_COLOR = new Color( 0, 0, 0, 0 );

// Parameters that control how the winding biomolecule winds. NOTE: The different variations of winding parameters
// were added in an effort to come to some consensus about how the mRNA should look for the various genes.  In the
// end, a single set was chosen, but I (jbphet) have left the other parameter sets here in case this question ever
// comes up again so that we don't have to "rediscover" parameters that look reasonably good.
const WINDING_PARAMS = [

  {
    // straight line - generally only used for debug
    yWave1Frequency: 0,
    yWave1PhaseOffset: 0,
    yWave1Multiplier: 0,
    yWave2Frequency: 0,
    yWave2PhaseOffset: 0,
    yWave2Multiplier: 0,
    xWaveFrequency: 0,
    xWavePhaseOffset: 0,
    xWaveMultiplier: 0
  },

  {
    // sine wave from yWave1 only
    yWave1Frequency: Math.PI * 0.01,
    yWave1PhaseOffset: 0.1 * Math.PI,
    yWave1Multiplier: 0.5,
    yWave2Frequency: 0,
    yWave2PhaseOffset: 0,
    yWave2Multiplier: 0,
    xWaveFrequency: 0,
    xWavePhaseOffset: 0,
    xWaveMultiplier: 0
  },

  {
    // double sine wave from yWave1 and yWave2
    yWave1Frequency: Math.PI * 0.01,
    yWave1PhaseOffset: 0.1 * Math.PI,
    yWave1Multiplier: 0.5,
    yWave2Frequency: Math.PI * 0.02,
    yWave2PhaseOffset: 0,
    yWave2Multiplier: 0.5,
    xWaveFrequency: 0,
    xWavePhaseOffset: 0,
    xWaveMultiplier: 0
  },

  {
    // x wave
    yWave1Frequency: Math.PI * 0.01,
    yWave1PhaseOffset: 0.1 * Math.PI,
    yWave1Multiplier: 0.5,
    yWave2Frequency: 0,
    yWave2PhaseOffset: 0,
    yWave2Multiplier: 0,
    xWaveFrequency: Math.PI * 0.03,
    xWavePhaseOffset: 0,
    xWaveMultiplier: 0.4
  },

  {
    // tight, irregular, couple of loops
    yWave1Frequency: 0.007 * Math.PI,
    yWave1PhaseOffset: 0.35 * Math.PI,
    yWave1Multiplier: 0.11,
    yWave2Frequency: 0.037 * Math.PI,
    yWave2PhaseOffset: 1.6 * Math.PI,
    yWave2Multiplier: 0.3,
    xWaveFrequency: 0.022 * Math.PI,
    xWavePhaseOffset: 0.3 * Math.PI,
    xWaveMultiplier: 0.24
  },

  {
    // winding with a few kinks, no complete loops
    yWave1Frequency: 0.02 * Math.PI,
    yWave1PhaseOffset: 0.35 * Math.PI,
    yWave1Multiplier: 0.2,
    yWave2Frequency: 0.007 * Math.PI,
    yWave2PhaseOffset: 1.6 * Math.PI,
    yWave2Multiplier: 0.1,
    xWaveFrequency: 0.01 * Math.PI,
    xWavePhaseOffset: 0.25 * Math.PI,
    xWaveMultiplier: 0.14
  },

  {
    // squiggly with a couple of small loops
    yWave1Frequency: 0.008 * Math.PI,
    yWave1PhaseOffset: 0.5 * Math.PI,
    yWave1Multiplier: 0.2,
    yWave2Frequency: 0.02 * Math.PI,
    yWave2PhaseOffset: 0.55 * Math.PI,
    yWave2Multiplier: 0.2,
    xWaveFrequency: 0.02 * Math.PI,
    xWavePhaseOffset: 0.45 * Math.PI,
    xWaveMultiplier: 0.2
  },

  {
    // large winds, no loops
    yWave1Frequency: 0.03350868765331309,
    yWave1PhaseOffset: 1.4652859313212294,
    yWave1Multiplier: 0.3523018499297727,
    yWave2Frequency: 0.03679270540637452,
    yWave2PhaseOffset: 0.8290895969945882,
    yWave2Multiplier: 0.3710465106439804,
    xWaveFrequency: 0.06762818354262706,
    xWavePhaseOffset: 1.3697784268233215,
    xWaveMultiplier: 0.19589544619869786
  },

  {
    // loopy and windy, liked by @kathy-phet
    yWave1Frequency: 0.02417698217540225,
    yWave1PhaseOffset: 2.4695448382255574,
    yWave1Multiplier: 0.37836434264592467,
    yWave2Frequency: 0.06201593943296497,
    yWave2PhaseOffset: 1.936966001193581,
    yWave2Multiplier: 0.41526000924061474,
    xWaveFrequency: 0.16811027073589893,
    xWavePhaseOffset: 0.030242447922989232,
    xWaveMultiplier: 0.3390090209844494
  },

  {
    // very loopy
    yWave1Frequency: 0.008 * Math.PI,
    yWave1PhaseOffset: 2.4695448382255574,
    yWave1Multiplier: 0.2,
    yWave2Frequency: 0.02 * Math.PI,
    yWave2PhaseOffset: 1.936966001193581,
    yWave2Multiplier: 0.2,
    xWaveFrequency: 0.02 * Math.PI,
    xWavePhaseOffset: 0.030242447922989232,
    xWaveMultiplier: 0.2
  },

  {
    // ECG sort of one with some overlap
    yWave1Frequency: 0.033801261909700855,
    yWave1PhaseOffset: 2.749035346535291,
    yWave1Multiplier: 0.27327335215625254,
    yWave2Frequency: 0.13249523648326847,
    yWave2PhaseOffset: 3.5761786010790373,
    yWave2Multiplier: 0.20586648052301262,
    xWaveFrequency: 0.03982596097448576,
    xWavePhaseOffset: 1.7894001491723766,
    xWaveMultiplier: 0.13588696362810446
  }
];

class WindingBiomolecule extends MobileBiomolecule {

  /**
   * @param {GeneExpressionModel} model
   * @param {Shape} initialShape
   * @param {Vector2} position
   * @param {Object} [options]
   */
  constructor( model, initialShape, position, options ) {

    options = merge( {

      // {number} - winding algorithm to use when creating and updating this biomolecule, see code for range
      windingParamSet: 0

    }, options );

    super( model, initialShape, NOMINAL_COLOR );

    // set up the winding params
    this.windingParams = WINDING_PARAMS[ options.windingParamSet ];

    // Add first shape defining point to the point list.
    this.firstShapeDefiningPoint = new ShapeDefiningPoint( position, 0 ); //@protected
    this.lastShapeDefiningPoint = this.firstShapeDefiningPoint; //@protected

    // List of the shape segments that define the outline shape.
    this.shapeSegments = []; //@public
  }

  /**
   * @public
   */
  dispose() {
    this.shapeSegments.length = 0;
    super.dispose();
  }

  /**
   * Get the first shape-defining point enclosed in the provided length range.
   * @param {Range} lengthRange
   * @returns {ShapeDefiningPoint}
   * @private
   */
  getFirstEnclosedPoint( lengthRange ) {
    let currentPoint = this.firstShapeDefiningPoint;
    let currentLength = 0;
    while ( currentPoint !== null ) {
      if ( currentLength >= lengthRange.min && currentLength < lengthRange.max ) {

        // We've found the first point.
        break;
      }
      currentPoint = currentPoint.getNextPoint();
      currentLength += currentPoint !== null ? currentPoint.getTargetDistanceToPreviousPoint() : 0;
    }
    return currentPoint;
  }

  /**
   * Get the last shape-defining point enclosed in the provided length range.
   * @param  {Range} lengthRange
   * @returns {ShapeDefiningPoint}
   * @private
   */
  getLastEnclosedPoint( lengthRange ) {
    let currentPoint = this.firstShapeDefiningPoint;
    let currentLength = 0;
    while ( currentPoint !== null ) {
      if ( currentLength >= lengthRange.min && currentLength < lengthRange.max ) {
        break;
      }
      currentPoint = currentPoint.getNextPoint();
      currentLength += currentPoint !== null ? currentPoint.getTargetDistanceToPreviousPoint() : 0;
    }

    if ( currentPoint !== null ) {
      while ( currentPoint.getNextPoint() !== null &&
              currentPoint.getNextPoint().getTargetDistanceToPreviousPoint() + currentLength < lengthRange.max ) {
        currentPoint = currentPoint.getNextPoint();
        currentLength += currentPoint.getTargetDistanceToPreviousPoint();
      }
    }

    return currentPoint;
  }

  /**
   * Add the specified amount of mRNA length to the tail end of the mRNA. Adding a length will cause the winding
   * algorithm to be re-run.
   * @param {number} length - Length of mRNA to add in picometers.
   * @public
   */
  addLength( length ) {

    // Add the length to the set of shape-defining points. This may add a new point, or simply reposition the current
    // last point.
    if ( this.firstShapeDefiningPoint === this.lastShapeDefiningPoint ) {

      // This is the first length added to the strand, so put it on.
      this.addPointToEnd( this.lastShapeDefiningPoint.getPosition(), length );
    }
    else if ( this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint() < GEEConstants.INTER_POINT_DISTANCE ) {
      const prevDistance = this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint();
      if ( prevDistance + length <= GEEConstants.INTER_POINT_DISTANCE ) {

        // No need to add a new point - just set the distance of the current last point to be further away from the
        // previous.
        this.lastShapeDefiningPoint.setTargetDistanceToPreviousPoint( prevDistance + length );
      }
      else {

        // Set the last point to be at the prescribed inter-point distance, and then add a new point.
        this.lastShapeDefiningPoint.setTargetDistanceToPreviousPoint( GEEConstants.INTER_POINT_DISTANCE );
        this.addPointToEnd(
          this.lastShapeDefiningPoint.getPosition(),
          length - ( GEEConstants.INTER_POINT_DISTANCE - prevDistance )
        );
      }
    }
    else {

      // add new point or points to the end
      let remainingLengthToAdd = length;
      while ( remainingLengthToAdd > 0 ) {
        const targetDistanceToPreviousPoint = Math.min( GEEConstants.INTER_POINT_DISTANCE, remainingLengthToAdd );
        this.addPointToEnd( this.lastShapeDefiningPoint.getPosition(), targetDistanceToPreviousPoint );
        remainingLengthToAdd -= targetDistanceToPreviousPoint;
      }
    }

    // Update the shape segments that define the outline shape.
    this.getLastShapeSegment().add( length, this, this.shapeSegments );

    // Realign the segments, since some growth probably occurred.
    this.realignSegmentsFromEnd();

    // Now that the points and shape segments are updated, run the algorithm that winds the points through the shapes
    // to produce the shape of the strand that will be presented to the user.
    this.windPointsThroughSegments();
  }

  /**
   * This is the "winding algorithm" that positions the points that define the shape of the mRNA within the shape
   * segments. The combination of this algorithm and the shape segments allow the mRNA to look reasonable when it is
   * being synthesized and when it is being transcribed.
   * @protected
   */
  windPointsThroughSegments() {
    let handledLength = 0;

    // Loop through the shape segments positioning the shape-defining points within them.
    for ( let i = 0; i < this.shapeSegments.length; i++ ) {
      const shapeSegment = this.shapeSegments[ i ];
      let lengthRange;

      // determine how much of the mRNA is within this shape segment and set the amount of length to work with accordingly
      if ( shapeSegment !== this.getLastShapeSegment() ) {
        lengthRange = new Range( handledLength, handledLength + shapeSegment.getContainedLength() );
      }
      else {

        // This is the last segment, so set the end of the length range to be infinite in order to be sure that the
        // last point is always included. If this isn't done, accumulation of floating point errors can cause the last
        // point to fall outside of the range, and it won't get positioned.  Which is bad.
        lengthRange = new Range( handledLength, Number.MAX_VALUE );


        // If this assert is hit, something may well be wrong with the way the shape segments are being updated.
        assert && assert(
          this.getLength() - this.getTotalLengthInShapeSegments() < 1,
          'larger than expected difference between mRNA length and shape segment length'
        );
      }

      const firstEnclosedPoint = this.getFirstEnclosedPoint( lengthRange );
      const lastEnclosedPoint = this.getLastEnclosedPoint( lengthRange );
      if ( firstEnclosedPoint === null ) {

        // The segment contains no points.
        continue;
      }
      else if ( shapeSegment.isFlat() ) {

        // Position the contained points in a flat line.
        this.positionPointsInLine( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getUpperLeftCornerPosition() );
      }
      else {

        // The segment is square, so position the points within it in a way that looks something like mRNA.
        this.positionPointsAsComplexWave( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getBounds() );
      }

      handledLength += shapeSegment.getContainedLength();
    }

    // Update the shape property based on the newly positioned points.
    this.shapeProperty.set( BioShapeUtils.createCurvyLineFromPoints( this.getPointList() ).makeImmutable() );
  }

  /**
   * Returns the sum of length of all shape segments
   * @returns {number}
   * @private
   */
  getTotalLengthInShapeSegments() {
    let totalShapeSegmentLength = 0;

    this.shapeSegments.forEach( shapeSeg => {
      totalShapeSegmentLength += shapeSeg.getContainedLength();
    } );

    return totalShapeSegmentLength;
  }

  /**
   * Position a series of points in a straight line. The distances between the points are set to be their target
   * distances. This is generally used when positioning the points in a flat shape segment.
   *
   * @param {ShapeDefiningPoint} firstPoint
   * @param {ShapeDefiningPoint} lastPoint
   * @param {Vector2} origin
   * @private
   */
  positionPointsInLine( firstPoint, lastPoint, origin ) {
    let currentPoint = firstPoint;
    let xOffset = 0;
    while ( currentPoint !== lastPoint && currentPoint !== null ) {
      currentPoint.setPositionXY( origin.x + xOffset, origin.y );
      currentPoint = currentPoint.getNextPoint();
      xOffset += currentPoint !== null ? currentPoint.getTargetDistanceToPreviousPoint() : 0;
    }

    assert && assert( currentPoint !== null, 'error: last point not found when positioning points' );

    // position the last point
    currentPoint.setPositionXY( origin.x + xOffset, origin.y );
  }

  /**
   * position the points that define the shape of the strand using a combination of sine waves
   * @param {ShapeDefiningPoint} firstPoint
   * @param {ShapeDefiningPoint} lastPoint
   * @param {Rectangle} bounds
   * @private
   */
  positionPointsAsComplexWave( firstPoint, lastPoint, bounds ) {

    if ( firstPoint === null ) {

      // Defensive programming.
      return;
    }

    // Position the first point at the upper left.
    firstPoint.setPositionXY( bounds.getMinX(), bounds.getMinY() + bounds.getHeight() );
    if ( firstPoint === lastPoint ) {

      // Nothing more to do.
      return;
    }

    const diagonalSpan = Math.sqrt( bounds.width * bounds.width + bounds.height * bounds.height );

    // for easier manipulation, make a list of all of the points in order from first to last
    const points = [];
    let currentPoint = firstPoint;
    points.push( currentPoint );
    while ( currentPoint !== lastPoint ) {
      currentPoint = currentPoint.getNextPoint();
      points.push( currentPoint );
    }

    const nextLinearPosition = new Vector2( bounds.minX, bounds.maxY );
    const interPointXDistance = bounds.width / ( points.length - 1 );
    const interPointYDistance = -bounds.height / ( points.length - 1 );
    let totalDistanceTraversed = 0;
    const totalDistancePerStep = Math.sqrt( interPointXDistance * interPointXDistance +
                                            interPointYDistance * interPointYDistance );

    // convenience vars for winding params
    const yWave1Frequency = this.windingParams.yWave1Frequency;
    const yWave1PhaseOffset = this.windingParams.yWave1PhaseOffset;
    const yWave1Multiplier = this.windingParams.yWave1Multiplier;
    const yWave2Frequency = this.windingParams.yWave2Frequency;
    const yWave2PhaseOffset = this.windingParams.yWave2PhaseOffset;
    const yWave2Multiplier = this.windingParams.yWave2Multiplier;
    const xWaveFrequency = this.windingParams.xWaveFrequency;
    const xWavePhaseOffset = this.windingParams.xWavePhaseOffset;
    const xWaveMultiplier = this.windingParams.xWaveMultiplier;

    // pre-allocate and reuse the offset vector for optimal performance
    const offsetFromLinearSequence = new Vector2( 0, 0 );

    // implement the winding algorithm
    for ( let i = 0; i < points.length; i++ ) {

      // window function to modulate less at corners of square than in middle so that everything fits in the segment
      let offsetScale;
      if ( totalDistanceTraversed < diagonalSpan / 2 ) {
        offsetScale = totalDistanceTraversed;
      }
      else {
        offsetScale = diagonalSpan - totalDistanceTraversed;
      }

      // use periodic functions to create a complex but deterministic shape
      offsetFromLinearSequence.setXY(
        ( yWave1Multiplier * Math.sin( totalDistanceTraversed * yWave1Frequency + yWave1PhaseOffset ) +
          yWave2Multiplier * Math.sin( totalDistanceTraversed * yWave2Frequency + yWave2PhaseOffset ) ),
        xWaveMultiplier * Math.sin( totalDistanceTraversed * xWaveFrequency + xWavePhaseOffset )
      );
      offsetFromLinearSequence.rotate( Math.PI / 4 );
      offsetFromLinearSequence.multiplyScalar( offsetScale );
      points[ i ].setPositionXY(
        nextLinearPosition.x + offsetFromLinearSequence.x,
        Math.min( nextLinearPosition.y + offsetFromLinearSequence.y, bounds.maxY )
      );
      nextLinearPosition.addXY( interPointXDistance, interPointYDistance );
      totalDistanceTraversed += totalDistancePerStep;
    }
  }

  /**
   * Realign all the segments, making sure that the end of one connects to the beginning of another, using the last
   * segment on the list as the starting point.
   * @private
   */
  realignSegmentsFromEnd() {
    let copyOfShapeSegments = this.shapeSegments.slice();

    copyOfShapeSegments = copyOfShapeSegments.reverse();

    for ( let i = 0; i < copyOfShapeSegments.length - 1; i++ ) {

      // Assumes that the shape segments attach to one another in such a way that they chain from the upper left to
      // the lower right.
      copyOfShapeSegments[ i + 1 ].setLowerRightCornerPosition( copyOfShapeSegments[ i ].getUpperLeftCornerPosition() );
    }
  }

  /**
   * Returns the last shape segment in the shapeSegments array
   * @returns {ShapeSegment}
   * @private
   */
  getLastShapeSegment() {
    return this.shapeSegments[ this.shapeSegments.length - 1 ];
  }

  /**
   * Add a point to the end of the list of shape defining points. Note that this will alter the last point on the list.
   * @param {Vector2} position
   * @param {number} targetDistanceToPreviousPoint
   * @private
   */
  addPointToEnd( position, targetDistanceToPreviousPoint ) {
    const newPoint = new ShapeDefiningPoint( position, targetDistanceToPreviousPoint );
    this.lastShapeDefiningPoint.setNextPoint( newPoint );
    newPoint.setPreviousPoint( this.lastShapeDefiningPoint );
    this.lastShapeDefiningPoint = newPoint;
  }

  /**
   * Get the points that define the shape as a list.
   * @returns {Array}
   * @private
   */
  getPointList() {
    const pointList = [];
    let thisPoint = this.firstShapeDefiningPoint;
    while ( thisPoint !== null ) {
      pointList.push( thisPoint.getPosition() );
      thisPoint = thisPoint.getNextPoint();
    }
    return pointList;
  }

  /**
   * Get the length of the strand. The length is calculated by adding up the intended distances between the points, and
   * does not account for curvature.
   * @returns {number} length in picometers
   * @protected
   */
  getLength() {
    let length = 0;
    let thisPoint = this.firstShapeDefiningPoint.getNextPoint();
    while ( thisPoint !== null ) {
      length += thisPoint.getTargetDistanceToPreviousPoint();
      thisPoint = thisPoint.getNextPoint();
    }
    return length;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @public
   */
  setLowerRightPositionXY( x, y ) {
    let totalWidth = 0;
    let totalHeight = 0;
    for ( let i = 0; i < this.shapeSegments.length; i++ ) {
      totalWidth += this.shapeSegments[ i ].bounds.width;
      totalHeight += this.shapeSegments[ i ].bounds.height;
    }
    // set the overall position property
    this.setPositionXY( x - totalWidth / 2, y + totalHeight / 2 );

    // set the position of the last segment - this position is relative to the overall position, not absolute
    this.getLastShapeSegment().setLowerRightCornerPositionXY( totalWidth / 2, -totalHeight / 2 );

    // realign all other segments based on the position of the last one
    this.realignSegmentsFromEnd();
  }

  /**
   * Adjust the position and the relative positions of all the shape segments such that the mRNA is in the same
   * place but the center is actually in the center of the segments.  This is necessary because during translations
   * the segments change shape and can move such that the position is not longer at the center of the shape.
   * @protected
   */
  recenter() {
    const shapeBounds = this.shapeProperty.get().bounds;
    const adjustmentX = shapeBounds.centerX;
    const adjustmentY = shapeBounds.centerY;

    // only readjust if needed
    if ( adjustmentX !== 0 || adjustmentY !== 0 ) {

      // adjust the shape segments
      for ( let i = 0; i < this.shapeSegments.length; i++ ) {
        const shapeSegment = this.shapeSegments[ i ];
        const upperLeftCornerPosition = shapeSegment.getUpperLeftCornerPosition();
        shapeSegment.setUpperLeftCornerPositionXY(
          upperLeftCornerPosition.x - adjustmentX,
          upperLeftCornerPosition.y - adjustmentY
        );
      }

      // adjust the position
      const position = this.getPosition();
      this.setPositionXY( position.x + adjustmentX, position.y + adjustmentY );
    }
  }

  /**
   * Realign the positions of all segments starting from the given segment and working forward and backward through
   * the segment list.
   * @param {ShapeSegment} segmentToAlignFrom
   * @protected
   */
  realignSegmentsFrom( segmentToAlignFrom ) {

    assert && assert(
      this.shapeSegments.indexOf( segmentToAlignFrom ) !== -1,
      'attempt to align to segment that is not on the list'
    );

    // Align segments that follow this one.
    let currentSegment = segmentToAlignFrom;
    let nextSegment = this.getNextShapeSegment( currentSegment );
    while ( nextSegment !== null ) {
      const nextSegmentLowerRightCornerPos = currentSegment.getLowerRightCornerPosition();
      nextSegment.setUpperLeftCornerPositionXY( nextSegmentLowerRightCornerPos.x, nextSegmentLowerRightCornerPos.y );
      currentSegment = nextSegment;
      nextSegment = this.getNextShapeSegment( currentSegment );
    }

    // Align segments that precede this one.
    currentSegment = segmentToAlignFrom;
    let previousSegment = this.getPreviousShapeSegment( currentSegment );
    while ( previousSegment !== null ) {
      previousSegment.setLowerRightCornerPosition( currentSegment.getUpperLeftCornerPosition() );
      currentSegment = previousSegment;
      previousSegment = this.getPreviousShapeSegment( currentSegment );
    }
  }

  /**
   * Returns the next shape segment in the array for the given shape segment
   * @param {ShapeSegment} shapeSegment
   * @returns {ShapeSegment}
   * @public
   */
  getNextShapeSegment( shapeSegment ) {
    const index = this.shapeSegments.indexOf( shapeSegment );

    assert && assert( index !== -1, 'Given item not in list' );

    if ( index === this.shapeSegments.length - 1 ) {
      // The given segment is the last element on the list, so null is returned.
      return null;
    }
    else {
      return this.shapeSegments[ index + 1 ];
    }
  }

  /**
   * Returns the previous shape segment in the array for the given shape segment
   * @param {ShapeSegment} shapeSegment
   * @returns {ShapeSegment}
   * @public
   */
  getPreviousShapeSegment( shapeSegment ) {
    const index = this.shapeSegments.indexOf( shapeSegment );

    assert && assert( index !== -1, 'Given item not in list' );

    if ( index === 0 ) {
      // The given segment is the first element on the list, so null is returned.
      return null;
    }
    else {
      return this.shapeSegments[ index - 1 ];
    }
  }

  /**
   * Inserts the new shape segment after the given shape segment in the array
   * @param {ShapeSegment} existingShapeSegment
   * @param {ShapeSegment} shapeSegmentToInsert
   * @public
   */
  insertAfterShapeSegment( existingShapeSegment, shapeSegmentToInsert ) {
    const index = this.shapeSegments.indexOf( existingShapeSegment );
    assert && assert( index !== -1, 'Given item not in list' );
    this.shapeSegments.splice( index + 1, 0, shapeSegmentToInsert );
  }

  /**
   * Inserts the new shape segment before the given shape segment in the array
   * @param {ShapeSegment} existingShapeSegment
   * @param {ShapeSegment} shapeSegmentToInsert
   * @public
   */
  insertBeforeShapeSegment( existingShapeSegment, shapeSegmentToInsert ) {
    const index = this.shapeSegments.indexOf( existingShapeSegment );
    assert && assert( index !== -1, 'Given item not in list' );
    this.shapeSegments.splice( index, 0, shapeSegmentToInsert );
  }
}

geneExpressionEssentials.register( 'WindingBiomolecule', WindingBiomolecule );

export default WindingBiomolecule;
