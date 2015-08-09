//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   *
   * @param {DnaStrandSegment} dnaStrandSegment
   * @param {ModelViewTransform2} mvt
   * @param {number} strandSegmentStroke
   * @param {Color} color
   *
   * @constructor
   */
  function DnaStrandSegmentNode( dnaStrandSegment, mvt, strandSegmentStroke, color ) {
    var thisNode = this;
    Node.call( thisNode );
    var pathNode = new Path( new Shape(), { lineWidth: strandSegmentStroke, stroke: color } );
    thisNode.addChild( pathNode );
    var defaultBounds = new Bounds2( 0, 0, 0, 0 );

    //override computeShapeBounds to improve performance
    pathNode.computeShapeBounds = function() {
      return defaultBounds;
    };

    dnaStrandSegment.addShapeChangeObserver( function( newShape ) {
      newShape = mvt.modelToViewShape( newShape );
      pathNode.setShape( newShape );
    } );
  }

  return inherit( Node, DnaStrandSegmentNode );
} );
