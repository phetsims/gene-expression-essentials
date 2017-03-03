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
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeUtils' );

  function DnaMoleculeCanvasNode( model, mvt, options ) {
    this.model = model;
    this.mvt = mvt;
    CanvasNode.call( this, options );
    this.invalidatePaint();
  }

  geneExpressionEssentials.register( 'DnaMoleculeCanvasNode', DnaMoleculeCanvasNode );

  return inherit( CanvasNode, DnaMoleculeCanvasNode, {

    /**
     * Paints the particles on the canvas node.
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {


      for ( var i = 0; i < this.model.strand1Segments.length; i++ ) {
        var strandSegment = this.model.strand1Segments[ i ];
        var strandSegmentLength = strandSegment.length;
        context.beginPath();
        context.moveTo( this.mvt.modelToViewX( strandSegment[ 0 ].x ), this.mvt.modelToViewY( strandSegment[ 0 ].y ) );
        if ( strandSegmentLength === 1 || strandSegmentLength === 2 ) {
          // Can't really create a curve from this, so draw a straight line
          // to the end point and call it good.
          context.lineTo(
            this.mvt.modelToViewX( strandSegment[ strandSegmentLength - 1 ].x ),
            this.mvt.modelToViewY( strandSegment[ strandSegmentLength - 1 ].y )
          );

          //context.closePath();
          continue;
        }
        // Create the first curved segment.
        var cp1 = ShapeUtils.extrapolateControlPoint( strandSegment[ 2 ], strandSegment[ 1 ], strandSegment[ 0 ] );
        context.quadraticCurveTo(
          this.mvt.modelToViewX( cp1.x ),
          this.mvt.modelToViewY( cp1.y ),
          this.mvt.modelToViewX( strandSegment[ 1 ].x ),
          this.mvt.modelToViewY( strandSegment[ 1 ].y )
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
            this.mvt.modelToViewX( controlPoint1.x ),
            this.mvt.modelToViewY( controlPoint1.y ),
            this.mvt.modelToViewX( controlPoint2.x ),
            this.mvt.modelToViewY( controlPoint2.y ),
            this.mvt.modelToViewX( segmentEndPoint.x ),
            this.mvt.modelToViewY( segmentEndPoint.y )
          );
        }
        // Create the final curved segment.
        cp1 = ShapeUtils.extrapolateControlPoint( strandSegment[ strandSegmentLength - 3 ],
          strandSegment[ strandSegmentLength - 2 ],
          strandSegment[ strandSegmentLength - 1 ]
        );

        context.quadraticCurveTo(
          this.mvt.modelToViewX( cp1.x ),
          this.mvt.modelToViewY( cp1.y ),
          this.mvt.modelToViewX( strandSegment[ strandSegmentLength - 1 ].x ),
          this.mvt.modelToViewY( strandSegment[ strandSegmentLength - 1 ].y )
        );
        //context.closePath();
        context.stroke();
      }

      //context.fillRect(-1208.48, 380, 8000, 200);
      //context.fillStyle = 'black';
      //context.strokeStyle = particles[ 0 ].color.darkerColor().getCanvasStyle();
      //context.lineWidth = 1;
      //context.beginPath();
      //context.moveTo( 5589 - 8000,  380.52 );
      //context.lineTo( 5589, 380.52 );
      //context.closePath();
    }


  } );
} );