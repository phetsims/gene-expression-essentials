// Copyright 2017, University of Colorado Boulder

/**
 * A isotope layer rendered on canvas.  This exists for performance reasons.
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

  // constants
  var STRAND_1_COLOR = new Color( 31, 163, 223 );
  var STRAND_2_COLOR = new Color( 214, 87, 107 );

  function DnaMoleculeCanvasNode( model, mvt, backboneStrokeWidth, options ) {
    this.model = model;
    this.mvt = mvt;
    this.backboneStrokeWidth = mvt.viewToModelDeltaX( backboneStrokeWidth );
    CanvasNode.call( this, options );
    //this.setMatrix( mvt.getMatrix() );
    this.invalidatePaint();
  }

  geneExpressionEssentials.register( 'DnaMoleculeCanvasNode', DnaMoleculeCanvasNode );

  return inherit( CanvasNode, DnaMoleculeCanvasNode, {


    drawRect: function( context, basePair ) {
      context.beginPath();
      context.fillStyle = Color.DARK_GRAY.computeCSS();
      context.fillRect(
        basePair.x,
        basePair.y,
        basePair.width,
        basePair.height
      );

    },

    drawCurve: function( context, strandSegment, strokeColor ) {
      var strandSegmentLength = strandSegment.length;
      context.beginPath();
      context.moveTo( strandSegment[ 0 ].x, strandSegment[ 0 ].y );
      if ( strandSegmentLength === 1 || strandSegmentLength === 2 ) {
        // Can't really create a curve from this, so draw a straight line
        // to the end point and call it good.
        context.lineTo(
          strandSegment[ strandSegmentLength - 1 ].x,
          strandSegment[ strandSegmentLength - 1 ].y
        );

        //context.closePath();
        return;
      }
      // Create the first curved segment.
      var cp1 = ShapeUtils.extrapolateControlPoint( strandSegment[ 2 ], strandSegment[ 1 ], strandSegment[ 0 ] );
      context.quadraticCurveTo(
        cp1.x,
        cp1.y,
        strandSegment[ 1 ].x,
        strandSegment[ 1 ].y
      );
      // Create the middle segments.
      for ( var j = 1; j < strandSegmentLength - 2; j++ ) {
        var segmentStartPoint = strandSegment[ j ];
        var segmentEndPoint = strandSegment[ j + 1 ];
        var previousPoint = strandSegment[ j - 1 ];
        var nextPoint = strandSegment[ ( j + 2 ) ];
        var controlPoint1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint );
        var controlPoint2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint );
        context.bezierCurveTo(
          controlPoint1.x,
          controlPoint1.y,
          controlPoint2.x,
          controlPoint2.y,
          segmentEndPoint.x,
          segmentEndPoint.y
        );
      }
      // Create the final curved segment.
      cp1 = ShapeUtils.extrapolateControlPoint( strandSegment[ strandSegmentLength - 3 ],
        strandSegment[ strandSegmentLength - 2 ],
        strandSegment[ strandSegmentLength - 1 ]
      );

      context.quadraticCurveTo(
        cp1.x,
        cp1.y,
        strandSegment[ strandSegmentLength - 1 ].x,
        strandSegment[ strandSegmentLength - 1 ].y
      );
      context.strokeStyle = strokeColor.computeCSS();
      context.lineWidth = this.backboneStrokeWidth;
      context.stroke();
    },

    /**
     * Paints the particles on the canvas node.
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      for ( var i = 0; i < this.model.strand1Segments.length; i++ ) {

        var strand1Segment = this.model.strand1Segments[ i ];
        var strand2Segment = this.model.strand2Segments[ i ];

        if ( i % 2 === 0 ) {
          this.drawCurve( context, strand2Segment, STRAND_2_COLOR );

          //this.drawCurve( context, strand1Segment, STRAND_1_COLOR );
        }
        else {
          this.drawCurve( context, strand1Segment, STRAND_1_COLOR );
          //this.drawRect( context, basePair );
          //this.drawCurve( context, strand2Segment, STRAND_2_COLOR );
        }

        //context.closePath();
      }

      for ( i = 0; i < this.model.basePairs.length; i++ ) {
        var basePair = this.model.basePairs[ i ];
        this.drawRect( context, basePair );
      }

      for ( i = 0; i < this.model.strand1Segments.length; i++ ) {

        strand1Segment = this.model.strand1Segments[ i ];
        strand2Segment = this.model.strand2Segments[ i ];

        if ( i % 2 === 0 ) {
          //this.drawCurve( context, strand2Segment, STRAND_2_COLOR );

          this.drawCurve( context, strand1Segment, STRAND_1_COLOR );
        }
        else {
          //this.drawCurve( context, strand1Segment, STRAND_1_COLOR );
          //this.drawRect( context, basePair );
          this.drawCurve( context, strand2Segment, STRAND_2_COLOR );
        }

        //context.closePath();
      }

      //context.fillRect(-1208.48, 380, 8000, 200);
      //context.fillStyle = 'black';
      //context.strokeStyle = particles[ 0 ].color.darkerColor().getCanvasStyle();
      //context.lineWidth = 1;
      //context.beginPath();
      //context.moveTo( 5589 - 8000,  380.52 );
      //context.lineTo( 5589, 380.52 );
      //context.closePath();
    },

    step: function() {
      if ( this.model.redraw ) {
        this.invalidatePaint();
      }
    }


  } );
} );