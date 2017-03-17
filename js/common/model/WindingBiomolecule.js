// Copyright 2015, University of Colorado Boulder
/**
 * Biomolecule that is a represented as a wound up strand. Generally, this refers to some sort of RNA. The complicated
 * part of this is the algorithm that is used to wind the strand.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Color = require( 'SCENERY/util/Color' );
  var EnhancedObservableList = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/EnhancedObservableList' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );
  var BioShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BioShapeUtils' );
  var Range = require( 'DOT/Range' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  var PointMass = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/PointMass' );
  var Random = require( 'DOT/Random' );


  // constants
  // Color used by this molecule. Since mRNA is depicted as a line and not as a closed shape, a transparent color is used.
  // This enables reuse of generic biomolecule classes.
  var NOMINAL_COLOR = new Color( 0, 0, 0, 0 );

  // Standard distance between points that define the shape. This is done to keep the number of points reasonable and
  // make the shape-defining algorithm consistent.
  var INTER_POINT_DISTANCE = CommonConstants.INTER_POINT_DISTANCE;

  var vectorToPreviousPoint = new Vector2( 0, 0 );
  var vectorToNextPoint = new Vector2( 0, 0 );
  var dampingForce = new Vector2( 0, 0 );

  /**
   *
   * @param {GeneExpressionModel} model
   * @param {Shape} initialShape
   * @param {Vector2} position
   * @constructor
   */
  function WindingBiomolecule( model, initialShape, position ) {
    MobileBiomolecule.call( this, model, initialShape, NOMINAL_COLOR );

    // Add first shape defining point to the point list.
    this.firstShapeDefiningPoint = new PointMass( position, 0 );
    this.lastShapeDefiningPoint = this.firstShapeDefiningPoint;

    // List of the shape segments that define the outline shape.
    this.shapeSegments = new EnhancedObservableList();
  }

  geneExpressionEssentials.register( 'WindingBiomolecule', WindingBiomolecule );

  return inherit( MobileBiomolecule, WindingBiomolecule, {

    /**
     * Position a set of points within a rectangle. The first point stays at the upper left, the last point stays at the
     * lower right, and the points in between are initially positioned randomly, then a spring algorithm is run to position
     * them such that each point is the appropriate distance from the previous and next points.
     *
     * @private static
     * @param {PointMass} firstPoint
     * @param {PointMass} lastPoint
     * @param {Bounds2} bounds
     */
    runSpringAlgorithm: function( firstPoint, lastPoint, bounds ) {

      if ( firstPoint === null ) {

        // Defensive programming.
        return;
      }

      // Position the first point at the upper left.
      firstPoint.setPosition( bounds.getMinX(), bounds.getMinY() + bounds.getHeight() );
      if ( firstPoint === lastPoint ) {
        // Nothing more to do.
        return;
      }

      // Position the last point at the lower right.
      lastPoint.setPosition( bounds.getMaxX(), bounds.getMinY() );

      // Run an algorithm that treats each pair of points as though there is a spring between them, but doesn't allow the
      // first or last points to be moved.
      var currentPoint = firstPoint;
      while ( currentPoint !== null ) {
        currentPoint.clearVelocity();
        currentPoint = currentPoint.getNextPointMass();
      }

      var springConstant = 2; // In Newtons/m
      var dampingConstant = 1;
      var pointMass = PointMass.MASS;
      var dt = 0.025; // In seconds. Fixed time-step is used to have consistency in the MRNA shape
      var numUpdates = 20;


      for ( var i = 0; i < numUpdates; i++ ) {
        var previousPoint = firstPoint;
        currentPoint = firstPoint.getNextPointMass();
        while ( currentPoint !== null ) {
          if ( currentPoint.getNextPointMass() !== null ) {
            var nextPoint = currentPoint.getNextPointMass();

            // This is not the last point on the list, so go ahead and run the spring algorithm on it.
            var previousPointPosition = previousPoint.getPosition();
            var currentPointPosition = currentPoint.getPosition();
            var nextPointPosition = nextPoint.getPosition();
            var currentPointVelocity = currentPoint.getVelocity();

            vectorToPreviousPoint.setXY( previousPointPosition.x - currentPointPosition.x, previousPointPosition.y - currentPointPosition.y );

            if ( vectorToPreviousPoint.magnitude() === 0 ) {

              // This point is sitting on top of the previous point, so create an arbitrary vector away from it.
              vectorToPreviousPoint.setXY( 1, 1 );
            }
            var scalarForceDueToPreviousPoint = ( -springConstant ) * ( currentPoint.getTargetDistanceToPreviousPoint() - currentPoint.distance( previousPoint ) );
            var forceDueToPreviousPoint = vectorToPreviousPoint.normalize().multiply( scalarForceDueToPreviousPoint );

            vectorToNextPoint.setXY( nextPointPosition.x - currentPointPosition.x, nextPointPosition.y - currentPointPosition.y );

            if ( vectorToNextPoint.magnitude() === 0 ) {

              // This point is sitting on top of the next point, so create an arbitrary vector away from it.
              vectorToNextPoint.setXY( -1, -1 );
            }

            var scalarForceDueToNextPoint = ( -springConstant ) * ( currentPoint.getTargetDistanceToPreviousPoint() - currentPoint.distance( nextPoint ) );
            var forceDueToNextPoint = vectorToNextPoint.normalize().multiply( scalarForceDueToNextPoint );

            dampingForce.setXY( currentPointVelocity.x * -dampingConstant, currentPointVelocity.y * -dampingConstant );
            var totalForce = forceDueToPreviousPoint.add( forceDueToNextPoint ).add( dampingForce );
            var acceleration = totalForce.multiply( 1 / pointMass );

            //var acceleration = totalForce.timesScalar( 1 / pointMass ); // The acceleration vector is used internally by currentPoit, so cant reuse a scratch instance
            currentPoint.setAcceleration( acceleration );
            currentPoint.update( dt );
          }
          previousPoint = currentPoint;
          currentPoint = currentPoint.getNextPointMass();
        }
      }
    },

    /**
     * Get the first shape-defining point enclosed in the provided length range.
     *
     * @param {Range} lengthRange
     * @return {PointMass}
     */
    getFirstEnclosedPoint: function( lengthRange ) {
      var currentPoint = this.firstShapeDefiningPoint;
      var currentLength = 0;
      while ( currentPoint !== null ) {
        if ( currentLength >= lengthRange.min && currentLength < lengthRange.max ) {

          // We've found the first point.
          break;
        }
        currentPoint = currentPoint.getNextPointMass();
        currentLength += currentPoint !== null ? currentPoint.getTargetDistanceToPreviousPoint() : 0;
      }
      return currentPoint;
    },

    /**
     * Get the last shape-defining point enclosed in the provided length range.
     *
     * @param  {Range} lengthRange
     * @return {PointMass}
     */
    getLastEnclosedPoint: function( lengthRange ) {
      var currentPoint = this.firstShapeDefiningPoint;
      var currentLength = 0;
      while ( currentPoint !== null ) {
        if ( currentLength >= lengthRange.min && currentLength < lengthRange.max ) {
          break;
        }
        currentPoint = currentPoint.getNextPointMass();
        currentLength += currentPoint !== null ? currentPoint.getTargetDistanceToPreviousPoint() : 0;
      }

      if ( currentPoint !== null ) {
        while ( currentPoint.getNextPointMass() !== null &&
                currentPoint.getNextPointMass().getTargetDistanceToPreviousPoint() + currentLength < lengthRange.max ) {
          currentPoint = currentPoint.getNextPointMass();
          currentLength += currentPoint.getTargetDistanceToPreviousPoint();
        }
      }

      if ( currentPoint === null ) {
        console.log( 'No last point.' );
      }

      return currentPoint;
    },

    /**
     * Add the specified amount of mRNA length to the tail end of the mRNA. Adding a length will cause the winding
     * algorithm to be re-run.
     *
     * @param {number} length - Length of mRNA to add in picometers.
     */
    addLength: function( length, dt ) {

      // Add the length to the set of shape-defining points. This may add a new point, or simply reposition the current
      // last point.
      if ( this.firstShapeDefiningPoint === this.lastShapeDefiningPoint ) {

        // This is the first length added to the strand, so put it on.
        this.addPointToEnd( this.lastShapeDefiningPoint.getPosition(), length );
      }
      else if ( this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint() < INTER_POINT_DISTANCE ) {
        var prevDistance = this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint();
        if ( prevDistance + length <= INTER_POINT_DISTANCE ) {

          // No need to add a new point - just set the distance of the current last point to be further away from the
          // previous.
          this.lastShapeDefiningPoint.setTargetDistanceToPreviousPoint( prevDistance + length );
        }
        else {

          // Set the last point to be at the prescribed inter-point distance, and then add a new point.
          this.lastShapeDefiningPoint.setTargetDistanceToPreviousPoint( INTER_POINT_DISTANCE );
          this.addPointToEnd( this.lastShapeDefiningPoint.getPosition(), length - ( INTER_POINT_DISTANCE - prevDistance ) );
        }
      }
      else {

        // Just add a new point to the end.
        this.addPointToEnd( this.lastShapeDefiningPoint.getPosition(), length );
      }

      // Update the shape segments that define the outline shape.
      this.getLastShapeSegment().add( length, this.shapeSegments );

      // Realign the segments, since some growth probably occurred.
      this.realignSegmentsFromEnd();

      // Now that the points and shape segments are updated, run the algorithm that winds the points through the shapes
      // to produce the shape of the strand that will be presented to the user.
      this.windPointsThroughSegments( dt );
    },

    /**
     * This is the "winding algorithm" that positions the points that define the shape of the mRNA within the shape
     * segments. The combination of this algorithm and the shape segments allow the mRNA to look reasonable when it is
     * being synthesized and when it is being transcribed.
     */
    windPointsThroughSegments: function( dt ) {
      var handledLength = 0;

      // Loop through the shape segments positioning the shape-defining points within them.
      for ( var i = 0; i < this.shapeSegments.length; i++ ) {
        var shapeSegment = this.shapeSegments.get( i );
        var lengthRange;
        if ( shapeSegment !== this.getLastShapeSegment() ) {
          lengthRange = new Range( handledLength, handledLength + shapeSegment.getContainedLength() );
        }
        else {

          // This is the last segment, so set the max to be infinite in order to be sure that the last point is always
          // included. If this isn't done, accumulation of floating point errors can cause the last point to fall outside
          // of the range, and it won't get positioned.  Which is bad.
          lengthRange = new Range( handledLength, Number.MAX_VALUE ); //TODO Double POSITIVE

          // Watch for unexpected conditions and spit out warning if found.
          var totalShapeSegmentLength = this.getTotalLengthInShapeSegments();
          if ( Math.abs( this.getLength() - totalShapeSegmentLength ) > 1 ) {

            // If this message appears, something may well be wrong with the way the shape segments are being updated.
            console.log( ' Warning: Larger than expected difference between mRNA length and shape segment length.' );
          }
        }

        var firstEnclosedPoint = this.getFirstEnclosedPoint( lengthRange );
        var lastEnclosedPoint = this.getLastEnclosedPoint( lengthRange );
        if ( firstEnclosedPoint === null ) {

          // The segment contains no points.
          continue;
        }
        else if ( shapeSegment.isFlat() ) {
          // Position the contained points in a flat line.
          this.positionPointsInLine( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getUpperLeftCornerPos() );
        }
        else {
          // Segment must be square, so position the points within it using the spring algorithm.
          this.randomizePointPositionsInRectangle( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getBounds() );
          this.runSpringAlgorithm( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getBounds(), dt );
        }

        handledLength += shapeSegment.getContainedLength();
      }

      // Update the shape property based on the newly positioned points.
      this.shapeProperty.set( BioShapeUtils.createCurvyLineFromPoints( this.getPointList() ) );
    },

    /**
     * @returns {number}
     */
    getTotalLengthInShapeSegments: function() {
      var totalShapeSegmentLength = 0;

      this.shapeSegments.forEach( function( shapeSeg ) {
        totalShapeSegmentLength += shapeSeg.getContainedLength();
      } );

      return totalShapeSegmentLength;
    },

    /**
     * Position a series of point masses in a straight line. The distances between the point masses are set to be their
     * target distances. This is generally used when positioning the point masses in a flat shape segment.
     *
     * @param {PointMass} firstPoint
     * @param {PointMass} lastPoint
     * @param {Vector2} origin
     */
    positionPointsInLine: function( firstPoint, lastPoint, origin ) {
      var currentPoint = firstPoint;
      var xOffset = 0;
      while ( currentPoint !== lastPoint && currentPoint !== null ) {
        currentPoint.setPosition( origin.x + xOffset, origin.y );
        currentPoint = currentPoint.getNextPointMass();
        xOffset += currentPoint !== null ? currentPoint.getTargetDistanceToPreviousPoint() : 0;
      }
      if ( currentPoint === null ) {
        console.log( ' Error: Last point not found when positioning points.' );
      }
      else {

        // Position the last point.
        currentPoint.setPosition( origin.x + xOffset, origin.y );
      }
    },

    /**
     * Randomly position a set of points inside a rectangle. The first point is positioned at the upper left, the last at
     * the lower right, and all points in between are randomly placed.
     *
     * @param {PointMass} firstPoint
     * @param {PointMass} lastPoint
     * @param {Rectangle} bounds
     */
    randomizePointPositionsInRectangle: function( firstPoint, lastPoint, bounds ) {

      if ( firstPoint === null ) {
        // Defensive programming.
        return;
      }

      // Position the first point at the upper left.
      firstPoint.setPosition( bounds.getMinX(), bounds.getMinY() + bounds.getHeight() );
      if ( firstPoint === lastPoint ) {
        // Nothing more to do.
        return;
      }

      // Position the last point at the lower right.
      lastPoint.setPosition( bounds.getMaxX(), bounds.getMinY() );

      var seededRandom = new Random( {
        seed: 8
      });
      var currentPoint = firstPoint;
      do {

        // Randomly position the points within the segment.
        currentPoint.setPosition( bounds.getMinX() + seededRandom.nextDouble() * bounds.getWidth(),
          bounds.getMinY() + (seededRandom.nextDouble()) * bounds.getHeight() );
        currentPoint = currentPoint.getNextPointMass();
      } while ( currentPoint !== lastPoint && currentPoint !== null );
    },

    /**
     * Realign all the segments, making sure that the end of one connects to the beginning of another, using the last
     * segment on the list as the starting point.
     */
    realignSegmentsFromEnd: function() {
      var copyOfShapeSegments = [].concat( this.shapeSegments.getArray() );

      copyOfShapeSegments = copyOfShapeSegments.reverse();

      for ( var i = 0; i < copyOfShapeSegments.length - 1; i++ ) {

        // Assumes that the shape segments attach to one another in such a way that they chain from the upper left to the
        // lower right.
        copyOfShapeSegments[ i + 1 ].setLowerRightCornerPos( copyOfShapeSegments[ i ].getUpperLeftCornerPos() );
      }
    },

    /**
     *
     * @returns {ShapeSegment}
     */
    getLastShapeSegment: function() {
      var lastShapeSegment = this.shapeSegments.get( this.shapeSegments.length - 1 );
      return lastShapeSegment;
    },

    /**
     * Add a point to the end of the list of shape defining points. Note that this will alter the last point on the list.
     *
     * @param {Vector2} position
     * @param {number} targetDistanceToPreviousPoint
     */
    addPointToEnd: function( position, targetDistanceToPreviousPoint ) {
      var newPoint = new PointMass( position, targetDistanceToPreviousPoint );
      this.lastShapeDefiningPoint.setNextPointMass( newPoint );
      newPoint.setPreviousPointMass( this.lastShapeDefiningPoint );
      this.lastShapeDefiningPoint = newPoint;
    },


    /**
     * Get the points that define the shape as a list.
     * @returns {Array}
     */
    getPointList: function() {
      var pointList = [];
      var thisPoint = this.firstShapeDefiningPoint;
      while ( thisPoint !== null ) {
        pointList.push( thisPoint.getPosition() );
        thisPoint = thisPoint.getNextPointMass();
      }
      return pointList;
    },

    /**
     * Get the length of the strand. The length is calculated by adding up the intended distances between the points, and
     * does not account for curvature.
     *
     * @return {number} length in picometers
     */
    getLength: function() {
      var length = 0;
      var thisPoint = this.firstShapeDefiningPoint.getNextPointMass();
      while ( thisPoint !== null ) {
        length += thisPoint.getTargetDistanceToPreviousPoint();
        thisPoint = thisPoint.getNextPointMass();
      }
      return length;
    },

    /**
     * Set the position of the lower right end of the mRNA strand.
     *
     * @param {Vector2} p
     */
    setLowerRightPositionByVector: function( p ) {
      this.getLastShapeSegment().setLowerRightCornerPos( p );
      this.realignSegmentsFromEnd();
    },

    /**
     * @param {number} x
     * @param {number} y
     */
    setLowerRightPosition: function( x, y ) {
      this.setLowerRightPositionByVector( new Vector2( x, y ) );
    },

    /**
     * Realign the positions of all segments starting from the given segment and working forward and backward through the
     * segment list.
     *
     * @param {ShapeSegment} segmentToAlignFrom
     */
    realignSegmentsFrom: function( segmentToAlignFrom ) {
      if ( this.shapeSegments.indexOf( segmentToAlignFrom ) === -1 ) {
        console.log( ' Warning: Ignoring attempt to align to segment that is not on the list.' );
        return;
      }

      // Align segments that follow this one.
      var currentSegment = segmentToAlignFrom;
      var nextSegment = this.shapeSegments.getNextItem( currentSegment );
      while ( nextSegment !== null ) {
        nextSegment.setUpperLeftCornerPosition( currentSegment.getLowerRightCornerPos() );
        currentSegment = nextSegment;
        nextSegment = this.shapeSegments.getNextItem( currentSegment );
      }

      // Align segments that precede this one.
      currentSegment = segmentToAlignFrom;
      var previousSegment = this.shapeSegments.getPreviousItem( currentSegment );
      while ( previousSegment !== null ) {
        previousSegment.setLowerRightCornerPos( currentSegment.getUpperLeftCornerPos() );
        currentSegment = previousSegment;
        previousSegment = this.shapeSegments.getPreviousItem( currentSegment );
      }
    }
  } );
} );
