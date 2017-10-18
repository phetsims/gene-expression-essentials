// Copyright 2017, University of Colorado Boulder

/**
 * A DNA Backbone Layer rendered on canvas. This exists for performance reasons.
 *
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var STRAND_1_COLOR = new Color( 31, 163, 223 );
  var STRAND_2_COLOR = new Color( 214, 87, 107 );
  var BASE_PAIR_COLOR = Color.DARK_GRAY.computeCSS();

  /**
   * @param {DnaMolecule} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} backboneStrokeWidth
   * @param {Object} [options]
   * @constructor
   */
  function DnaMoleculeCanvasNode( model, modelViewTransform, backboneStrokeWidth, options ) {
    this.model = model; // @private
    this.modelViewTransform = modelViewTransform; // @private
    this.backboneStrokeWidth = modelViewTransform.viewToModelDeltaX( backboneStrokeWidth ); // @private
    CanvasNode.call( this, options );
    this.invalidatePaint();
  }

  geneExpressionEssentials.register( 'DnaMoleculeCanvasNode', DnaMoleculeCanvasNode );

  return inherit( CanvasNode, DnaMoleculeCanvasNode, {

    /**
     * Draws the base pairs - this normally just draws a single line the connects between the two strands, but if the
     * strands are split it draws the base pairs in two pieces.
     * @param {CanvasRenderingContext2D} context
     * @param {BasePair}basePair
     * @private
     */
    drawBasePair: function( context, basePair ) {

      var endOffset = basePair.width / 2;

      if ( basePair.topYLocation - basePair.bottomYLocation <= this.model.maxBasePairHeight ){

        // draw the base pair as a single line between the top and bottom locations
        context.moveTo( basePair.x, basePair.topYLocation + endOffset);
        context.lineTo( basePair.x, basePair.bottomYLocation - endOffset );
      }
      else{

        // the strands are separate, draw two separate base pairs
        var dividedBasePairHeight = this.model.maxBasePairHeight / 2;
        context.moveTo( basePair.x, basePair.topYLocation + endOffset );
        context.lineTo( basePair.x, basePair.topYLocation - dividedBasePairHeight );
        context.moveTo( basePair.x, basePair.bottomYLocation - endOffset );
        context.lineTo( basePair.x, basePair.bottomYLocation + dividedBasePairHeight );
      }

      context.lineWidth = basePair.width;
    },

    /**
     * Draws the strand segments
     * @param {CanvasRenderingContext2D} context
     * @param {Array} strandSegmentArray
     * @param {Color} strokeColor
     * @private
     */
    drawCurve: function( context, strandSegmentArray, strokeColor ) {
      context.beginPath();

      // allocate reusable vectors for optimal performance
      var cp1 = Vector2.dirtyFromPool();
      var cp2 = Vector2.dirtyFromPool();

      // loop, drawing each strand segment
      for ( var i = 0; i < strandSegmentArray.length; i++ ) {
        var strandSegment = strandSegmentArray[ i ];
        var strandSegmentLength = strandSegment.length;
        context.moveTo( strandSegment[ 0 ].x, strandSegment[ 0 ].y );
        if ( strandSegmentLength === 1 || strandSegmentLength === 2 ) {

          // can't really create a curve from this, so draw a straight line to the end point and call it good
          context.lineTo(
            strandSegment[ strandSegmentLength - 1 ].x,
            strandSegment[ strandSegmentLength - 1 ].y
          );
          break;
        }

        // create the first curved segment
        cp1 = ShapeUtils.extrapolateControlPoint( strandSegment[ 2 ], strandSegment[ 1 ], strandSegment[ 0 ], cp1 );
        context.quadraticCurveTo( cp1.x, cp1.y, strandSegment[ 1 ].x, strandSegment[ 1 ].y );

        // create the middle segments
        for ( var j = 1; j < strandSegmentLength - 2; j++ ) {
          var segmentStartPoint = strandSegment[ j ];
          var segmentEndPoint = strandSegment[ j + 1 ];
          var previousPoint = strandSegment[ j - 1 ];
          var nextPoint = strandSegment[ ( j + 2 ) ];
          cp1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint, cp1 );
          cp2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint, cp2 );
          context.bezierCurveTo( cp1.x, cp1.y, cp2.x, cp2.y, segmentEndPoint.x, segmentEndPoint.y );
        }

        // create the final curved segment
        cp1 = ShapeUtils.extrapolateControlPoint(
          strandSegment[ strandSegmentLength - 3 ],
          strandSegment[ strandSegmentLength - 2 ],
          strandSegment[ strandSegmentLength - 1 ],
          cp1
        );
        context.quadraticCurveTo(
          cp1.x,
          cp1.y,
          strandSegment[ strandSegmentLength - 1 ].x,
          strandSegment[ strandSegmentLength - 1 ].y
        );
      }
      cp1.freeToPool();
      cp2.freeToPool();
      context.strokeStyle = strokeColor.computeCSS();
      context.lineWidth = this.backboneStrokeWidth;
      context.stroke();
    },

    /**
     * @override
     * Draws the DNA Molecule on canvas which includes helix like strands and base pairs.
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      var strand1ArrayBehind = [];
      var strand2ArrayBehind = [];
      var strand1ArrayFront = [];
      var strand2ArrayFront = [];
      for ( var i = 0; i < this.model.strand1Segments.length; i++ ) {
        var strand1Segment = this.model.strand1Segments[ i ];
        var strand2Segment = this.model.strand2Segments[ i ];

        if ( i % 2 === 0 ) {
          strand2ArrayBehind.push( strand2Segment );
          strand1ArrayFront.push( strand1Segment );
        }
        else {
          strand1ArrayBehind.push( strand1Segment );
          strand2ArrayFront.push( strand2Segment );
        }
      }

      // draw the back portions of the DNA strand
      context.lineCap = 'round';
      this.drawCurve( context, strand1ArrayBehind, STRAND_1_COLOR );
      this.drawCurve( context, strand2ArrayBehind, STRAND_2_COLOR );

      // draw the base pairs
      context.lineCap = 'butt';
      context.beginPath();
      context.strokeStyle = BASE_PAIR_COLOR;

      for ( i = 0; i < this.model.basePairs.length; i++ ) {
        var basePair = this.model.basePairs[ i ];
        this.drawBasePair( context, basePair );
      }
      context.stroke();

      // draw the front portions of the DNA strand
      context.lineCap = 'round';
      this.drawCurve( context, strand1ArrayFront, STRAND_1_COLOR );
      this.drawCurve( context, strand2ArrayFront, STRAND_2_COLOR );

      strand1ArrayBehind.length = 0;
      strand2ArrayBehind.length = 0;
      strand1ArrayFront.length = 0;
      strand2ArrayFront.length = 0;
    },

    /**
     * Step Function which checks whether to redraw or not
     * @public
     */
    step: function() {
      if ( this.model.redraw ) {
        this.invalidatePaint();
      }
    }
  } );
} );