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
    dnaStrandSegment.addShapeChangeObserver( function( newShape ) {
      pathNode.setShape( mvt.modelToViewShape( newShape ) );
    } );
  }
  return inherit( Node, DnaStrandSegmentNode );
} );
