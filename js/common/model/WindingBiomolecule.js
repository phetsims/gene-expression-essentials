// Copyright 2015-2017, University of Colorado Boulder

/**
 * Biomolecule that is a represented as a wound up strand. Generally, this refers to some sort of RNA. The complicated
 * part of this is the algorithm that is used to wind the strand.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var BioShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BioShapeUtils' );
  var Color = require( 'SCENERY/util/Color' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  var PointMass = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/PointMass' );
  var Random = require( 'DOT/Random' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  // Color used by this molecule. Since mRNA is depicted as a line and not as a closed shape, a transparent color is 
  // used for the fill. This enables reuse of generic biomolecule classes.
  var NOMINAL_COLOR = new Color( 0, 0, 0, 0 );

  // parameters that control how the winding biomolecule winds
  var WINDING_PARAMS = [

    {
      // straight line
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
      // nice windy one
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
      // tight, irregular, couple of loops
      yWave1Frequency: 0.008 * Math.PI,
      yWave1PhaseOffset: 0.35 * Math.PI,
      yWave1Multiplier: 0.0565,
      yWave2Frequency: 0.037 * Math.PI,
      yWave2PhaseOffset: 1.6 * Math.PI,
      yWave2Multiplier: 0.19,
      xWaveFrequency: 0.022 * Math.PI,
      xWavePhaseOffset: 0.17 * Math.PI,
      xWaveMultiplier: 0.2373
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

  // reusable vectors, pre-allocated for better performance
  var vectorToPreviousPoint = new Vector2( 0, 0 );
  var vectorToNextPoint = new Vector2( 0, 0 );
  var dampingForce = new Vector2( 0, 0 );

  /**
   * @param {GeneExpressionModel} model
   * @param {Shape} initialShape
   * @param {Vector2} position
   * @param {Object} options
   * @constructor
   */
  function WindingBiomolecule( model, initialShape, position, options ) {

    options = _.extend( {

      // {number} - winding algorithm to use when creating and updating this biomolecule, see code for range
      windingParamSet: 0

    }, options );

    MobileBiomolecule.call( this, model, initialShape, NOMINAL_COLOR );

    // set up the winding params
    this.windingParams = WINDING_PARAMS[ options.windingParamSet ];

    // Add first shape defining point to the point list.
    this.firstShapeDefiningPoint = new PointMass( position, 0 ); //@protected
    this.lastShapeDefiningPoint = this.firstShapeDefiningPoint; //@protected

    // List of the shape segments that define the outline shape.
    this.shapeSegments = []; //@public
  }

  geneExpressionEssentials.register( 'WindingBiomolecule', WindingBiomolecule );

  return inherit( MobileBiomolecule, WindingBiomolecule, {

    /**
     * @public
     */
    dispose: function() {
      this.shapeSegments.length = 0;
      MobileBiomolecule.prototype.dispose.call( this );
    },

    /**
     * Position a set of points within a rectangle. The first point stays at the upper left, the last point stays at the
     * lower right, and the points in between are initially positioned randomly, then a spring algorithm is run to
     * position them such that each point is the appropriate distance from the previous and next points.
     * @param {PointMass} firstPoint
     * @param {PointMass} lastPoint
     * @param {Bounds2} bounds
     * @private
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
     * @param {Range} lengthRange
     * @returns {PointMass}
     * @private
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
     * @param  {Range} lengthRange
     * @returns {PointMass}
     * @private
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
     * @param {number} length - Length of mRNA to add in picometers.
     * @public
     */
    addLength: function( length ) {

      // Add the length to the set of shape-defining points. This may add a new point, or simply reposition the current
      // last point.
      if ( this.firstShapeDefiningPoint === this.lastShapeDefiningPoint ) {

        // This is the first length added to the strand, so put it on.
        this.addPointToEnd( this.lastShapeDefiningPoint.getPosition(), length );
      }
      else if ( this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint() < GEEConstants.INTER_POINT_DISTANCE ) {
        var prevDistance = this.lastShapeDefiningPoint.getTargetDistanceToPreviousPoint();
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
        var remainingLengthToAdd = length;
        while ( remainingLengthToAdd > 0 ){
          var targetDistanceToPreviousPoint = Math.min( GEEConstants.INTER_POINT_DISTANCE, remainingLengthToAdd );
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
    },

    /**
     * This is the "winding algorithm" that positions the points that define the shape of the mRNA within the shape
     * segments. The combination of this algorithm and the shape segments allow the mRNA to look reasonable when it is
     * being synthesized and when it is being transcribed.
     * @protected
     */
    windPointsThroughSegments: function() {
      var handledLength = 0;

      // Loop through the shape segments positioning the shape-defining points within them.
      for ( var i = 0; i < this.shapeSegments.length; i++ ) {
        var shapeSegment = this.shapeSegments[ i ];
        var lengthRange;

        // determine how much of the mRNA is within this shape segment and set the amount of length to work with accordingly
        if ( shapeSegment !== this.getLastShapeSegment() ) {
          lengthRange = new Range( handledLength, handledLength + shapeSegment.getContainedLength() );
        }
        else {

          // This is the last segment, so set the end of the length range to be infinite in order to be sure that the
          // last point is always included. If this isn't done, accumulation of floating point errors can cause the last
          // point to fall outside of the range, and it won't get positioned.  Which is bad.
          lengthRange = new Range( handledLength, Number.MAX_VALUE );

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

          // The segment must be square, so position the points within it in a way that looks something like mRNA
          // this.positionPointsFromUpperLeftToLowerRight( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getBounds() );
          this.positionPointsAsComplexWave( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getBounds() );
          //this.positionPointsAsTiltedSineWave( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getBounds() );

          // Segment must be square, so position the points within it using the spring algorithm.
          //this.randomizePointPositionsInRectangle( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getBounds() );
          //this.runSpringAlgorithm( firstEnclosedPoint, lastEnclosedPoint, shapeSegment.getBounds() );
        }

        handledLength += shapeSegment.getContainedLength();
      }

      // Update the shape property based on the newly positioned points.
      this.shapeProperty.set( BioShapeUtils.createCurvyLineFromPoints( this.getPointList() ).makeImmutable() );
    },

    /**
     * Returns the sum of length of all shape segments
     * @returns {number}
     * @private
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
     * @private
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
     * @private
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
      } );
      var currentPoint = firstPoint;
      do {

        // Randomly position the points within the segment.
        currentPoint.setPosition( bounds.getMinX() + seededRandom.nextDouble() * bounds.getWidth(),
          bounds.getMinY() + (seededRandom.nextDouble()) * bounds.getHeight() );
        currentPoint = currentPoint.getNextPointMass();
      } while ( currentPoint !== lastPoint && currentPoint !== null );
    },

    /**
     * TODO: This is probably temporary, document if retained.
     *
     * @param {PointMass} firstPoint
     * @param {PointMass} lastPoint
     * @param {Rectangle} bounds
     * @private
     */
    positionPointsFromUpperLeftToLowerRight: function( firstPoint, lastPoint, bounds ) {

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

      // for easier manipulation, make a list of all of the points in order from first to last
      var points = [];
      var currentPoint = firstPoint;
      points.push( currentPoint );
      while ( currentPoint !== lastPoint ) {
        currentPoint = currentPoint.getNextPointMass();
        points.push( currentPoint );
      }

      // position the points in a line from top to bottom using a C-style loop for best performance
      var nextPointPosition = new Vector2( bounds.minX, bounds.maxY );
      var interPointXDistance = bounds.width / ( points.length - 1 );
      var interPointYDistance = -bounds.height / ( points.length - 1 );
      for ( var i = 0; i < points.length; i++ ) {
        points[ i ].setPosition( nextPointPosition.x, nextPointPosition.y );
        nextPointPosition.addXY( interPointXDistance, interPointYDistance );
      }
    },

    /**
     * TODO: This is probably temporary, document and clean up if retained.
     *
     * @param {PointMass} firstPoint
     * @param {PointMass} lastPoint
     * @param {Rectangle} bounds
     * @private
     */
    positionPointsAsTiltedSineWave: function( firstPoint, lastPoint, bounds ) {

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

      // for easier manipulation, make a list of all of the points in order from first to last
      var points = [];
      var currentPoint = firstPoint;
      points.push( currentPoint );
      while ( currentPoint !== lastPoint ) {
        currentPoint = currentPoint.getNextPointMass();
        points.push( currentPoint );
      }

      // position the points in a sine wave tilted from top to bottom using a C-style loop for best performance
      var nextLinearPosition = new Vector2( bounds.minX, bounds.maxY );
      var interPointXDistance = bounds.width / ( points.length - 1 );
      var interPointYDistance = -bounds.height / ( points.length - 1 );
      var totalDistanceTraversed = 0;
      var totalDistancePerStep = Math.sqrt( interPointXDistance * interPointXDistance +
                                            interPointYDistance * interPointYDistance );
      var mRnaWavinessFactor = Math.PI / 100; // TODO: make this a constant if retained
      var offsetFromLine = new Vector2;
      for ( var i = 0; i < points.length; i++ ) {
        offsetFromLine.setXY( Math.sin( totalDistanceTraversed * mRnaWavinessFactor ) * 50, 0 );
        offsetFromLine.rotate( Math.PI / 4 );
        points[ i ].setPosition( nextLinearPosition.x + offsetFromLine.x, nextLinearPosition.y + offsetFromLine.y );
        nextLinearPosition.addXY( interPointXDistance, interPointYDistance );
        totalDistanceTraversed += totalDistancePerStep;
      }
    },

    /**
     * TODO: This is probably temporary, document and clean up if retained.
     *
     * @param {PointMass} firstPoint
     * @param {PointMass} lastPoint
     * @param {Rectangle} bounds
     * @private
     */
    positionPointsAsComplexWave: function( firstPoint, lastPoint, bounds ) {

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

      var diagonalSpan = Math.sqrt( bounds.width * bounds.width + bounds.height * bounds.height );

      // for easier manipulation, make a list of all of the points in order from first to last
      var points = [];
      var currentPoint = firstPoint;
      points.push( currentPoint );
      while ( currentPoint !== lastPoint ) {
        currentPoint = currentPoint.getNextPointMass();
        points.push( currentPoint );
      }

      var nextLinearPosition = new Vector2( bounds.minX, bounds.maxY );
      var interPointXDistance = bounds.width / ( points.length - 1 );
      var interPointYDistance = -bounds.height / ( points.length - 1 );
      var totalDistanceTraversed = 0;
      var totalDistancePerStep = Math.sqrt( interPointXDistance * interPointXDistance +
                                            interPointYDistance * interPointYDistance );

      // convenience vars for winding params
      var yWave1Frequency = this.windingParams.yWave1Frequency;
      var yWave1PhaseOffset = this.windingParams.yWave1PhaseOffset;
      var yWave1Multiplier = this.windingParams.yWave1Multiplier;
      var yWave2Frequency = this.windingParams.yWave2Frequency;
      var yWave2PhaseOffset = this.windingParams.yWave2PhaseOffset;
      var yWave2Multiplier = this.windingParams.yWave2Multiplier;
      var xWaveFrequency = this.windingParams.xWaveFrequency;
      var xWavePhaseOffset = this.windingParams.xWavePhaseOffset;
      var xWaveMultiplier = this.windingParams.xWaveMultiplier;

      // pre-allocate and reuse the offset vector for optimal performance
      var offsetFromLinearSequence = new Vector2;

      // implement the winding algorithm
      for ( var i = 0; i < points.length; i++ ) {

        // window function to modulate less at corners of square than in middle so that everything fits in the segment
        var yAmplitudeMultiplier;
        if ( totalDistanceTraversed < diagonalSpan / 2 ) {
          yAmplitudeMultiplier = totalDistanceTraversed;
        }
        else {
          yAmplitudeMultiplier = diagonalSpan - totalDistanceTraversed;
        }

        // use periodic functions to create a complex but deterministic shape
        offsetFromLinearSequence.setXY(
          ( yWave1Multiplier * Math.sin( totalDistanceTraversed * yWave1Frequency + yWave1PhaseOffset ) +
            yWave2Multiplier * Math.sin( totalDistanceTraversed * yWave2Frequency + yWave2PhaseOffset ) ) *
          yAmplitudeMultiplier,
          xWaveMultiplier * Math.sin( totalDistanceTraversed * xWaveFrequency + xWavePhaseOffset ) * yAmplitudeMultiplier
        );
        offsetFromLinearSequence.rotate( Math.PI / 4 );
        points[ i ].setPosition(
          nextLinearPosition.x + offsetFromLinearSequence.x,
          Math.min( nextLinearPosition.y + offsetFromLinearSequence.y, bounds.maxY )
        );
        nextLinearPosition.addXY( interPointXDistance, interPointYDistance );
        totalDistanceTraversed += totalDistancePerStep;
      }
    },

    /**
     * Realign all the segments, making sure that the end of one connects to the beginning of another, using the last
     * segment on the list as the starting point.
     * @private
     */
    realignSegmentsFromEnd: function() {
      var copyOfShapeSegments = this.shapeSegments.slice();

      copyOfShapeSegments = copyOfShapeSegments.reverse();

      for ( var i = 0; i < copyOfShapeSegments.length - 1; i++ ) {

        // Assumes that the shape segments attach to one another in such a way that they chain from the upper left to
        // the lower right.
        copyOfShapeSegments[ i + 1 ].setLowerRightCornerPosByVector( copyOfShapeSegments[ i ].getUpperLeftCornerPos() );
      }
    },

    /**
     * Returns the last shape segment in the shapeSegments array
     * @returns {ShapeSegment}
     * @private
     */
    getLastShapeSegment: function() {
      return this.shapeSegments[ this.shapeSegments.length - 1 ];
    },

    /**
     * Add a point to the end of the list of shape defining points. Note that this will alter the last point on the list.
     * @param {Vector2} position
     * @param {number} targetDistanceToPreviousPoint
     * @private
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
     * @private
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
     * @returns {number} length in picometers
     * @protected
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
     * @param {Vector2} p
     * @public
     */
    setLowerRightPositionByVector: function( p ) {
      this.setLowerRightPosition( p.x, p.y );
      // this.setPosition( p.x - this.bounds.width / 2, p.y - this.bounds.height / 2 );
      // this.bounds.width
      // this.getLastShapeSegment().setLowerRightCornerPos( p );
      // this.realignSegmentsFromEnd();
    },

    /**
     * @param {number} x
     * @param {number} y
     * @public
     */
    setLowerRightPosition: function( x, y ) {
      var totalWidth = 0;
      var totalHeight = 0;
      for ( var i = 0; i < this.shapeSegments.length; i++ ){
        totalWidth += this.shapeSegments[ i ].bounds.width;
        totalHeight += this.shapeSegments[ i ].bounds.height;
      }
      // set the overall position property
      this.setPositionByXY( x - totalWidth / 2, y + totalHeight / 2 );

      // set the position of the last segment - this position is relative to the overall position, not absolute
      this.getLastShapeSegment().setLowerRightCornerPos( totalWidth / 2, -totalHeight / 2 );

      // realign all other segments based on the position of the last one
      this.realignSegmentsFromEnd();
    },

    /**
     * Adjust the position and the relative locations of all the shape segments such that the mRNA is in the same
     * place but the center is actually in the center of the segments.  This is necessary because during translations
     * the segments change shape and can move such that the position is not longer at the center of the shape.
     */
    recenter: function(){
      var shapeBounds = this.shapeProperty.get().bounds;
      var adjustmentX = shapeBounds.centerX;
      var adjustmentY = shapeBounds.centerY;

      // only readjust if needed
      if ( adjustmentX !== 0 || adjustmentY !== 0 ){

        // adjust the shape segments
        for ( var i = 0; i < this.shapeSegments.length; i++ ){
          var shapeSegment = this.shapeSegments[ i ];
          var upperLeftCornerPosition = shapeSegment.getUpperLeftCornerPos();
          shapeSegment.setUpperLeftCornerPosition(
            upperLeftCornerPosition.x - adjustmentX,
            upperLeftCornerPosition.y - adjustmentY
          );
        }

        // adjust the position
        var position = this.getPosition();
        this.setPositionByXY( position.x + adjustmentX, position.y + adjustmentY );
      }
    },

    /**
     * Realign the positions of all segments starting from the given segment and working forward and backward through
     * the segment list.
     * @param {ShapeSegment} segmentToAlignFrom
     * @protected
     */
    realignSegmentsFrom: function( segmentToAlignFrom ) {
      if ( this.shapeSegments.indexOf( segmentToAlignFrom ) === -1 ) {
        console.log( ' Warning: Ignoring attempt to align to segment that is not on the list.' );
        return;
      }

      // Align segments that follow this one.
      var currentSegment = segmentToAlignFrom;
      var nextSegment = this.getNextShapeSegment( currentSegment );
      while ( nextSegment !== null ) {
        var nextSegmentLowerRightCornerPos = currentSegment.getLowerRightCornerPos();
        nextSegment.setUpperLeftCornerPosition( nextSegmentLowerRightCornerPos.x, nextSegmentLowerRightCornerPos.y );
        currentSegment = nextSegment;
        nextSegment = this.getNextShapeSegment( currentSegment );
      }

      // Align segments that precede this one.
      currentSegment = segmentToAlignFrom;
      var previousSegment = this.getPreviousShapeSegment( currentSegment );
      while ( previousSegment !== null ) {
        previousSegment.setLowerRightCornerPosByVector( currentSegment.getUpperLeftCornerPos() );
        currentSegment = previousSegment;
        previousSegment = this.getPreviousShapeSegment( currentSegment );
      }
    },

    /**
     * Returns the next shape segment in the array for the given shape segment
     * @param {ShapeSegment} shapeSegment
     * @returns {ShapeSegment}
     * @public
     */
    getNextShapeSegment: function( shapeSegment ) {
      var index = this.shapeSegments.indexOf( shapeSegment );

      assert && assert( index !== -1, 'Given item not in list' );

      if ( index === this.shapeSegments.length - 1 ) {
        // The given segment is the last element on the list, so null is returned.
        return null;
      }
      else {
        return this.shapeSegments[ index + 1 ];
      }
    },

    /**
     * Returns the previous shape segment in the array for the given shape segment
     * @param {ShapeSegment} shapeSegment
     * @returns {ShapeSegment}
     * @public
     */
    getPreviousShapeSegment: function( shapeSegment ) {
      var index = this.shapeSegments.indexOf( shapeSegment );

      assert && assert( index !== -1, 'Given item not in list' );

      if ( index === 0 ) {
        // The given segment is the first element on the list, so null is returned.
        return null;
      }
      else {
        return this.shapeSegments[ index - 1 ];
      }
    },

    /**
     * Inserts the new shape segment after the given shape segment in the array
     * @param {ShapeSegment} existingShapeSegment
     * @param {ShapeSegment} shapeSegmentToInsert
     * @public
     */
    insertAfterShapeSegment: function( existingShapeSegment, shapeSegmentToInsert ) {
      var index = this.shapeSegments.indexOf( existingShapeSegment );
      assert && assert( index !== -1, 'Given item not in list' );
      this.shapeSegments.splice( index + 1, 0, shapeSegmentToInsert );
    },

    /**
     * Inserts the new shape segment before the given shape segment in the array
     * @param {ShapeSegment} existingShapeSegment
     * @param {ShapeSegment} shapeSegmentToInsert
     * @public
     */
    insertBeforeShapeSegment: function( existingShapeSegment, shapeSegmentToInsert ) {
      var index = this.shapeSegments.indexOf( existingShapeSegment );
      assert && assert( index !== -1, 'Given item not in list' );
      this.shapeSegments.splice( index, 0, shapeSegmentToInsert );
    }
  } );
} );
