// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

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
    var self = this;
    Node.call( self );
    var pathNode = new Path( mvt.modelToViewShape( dnaStrandSegment.getShape() ), { lineWidth: strandSegmentStroke, stroke: color } );
    self.addChild( pathNode );


    dnaStrandSegment.shapeProperty.lazyLink( function( newShape, oldShape ) {
     pathNode.setShape( mvt.modelToViewShape( newShape ) );
    } );
  }

  geneExpressionEssentials.register( 'DnaStrandSegmentNode', DnaStrandSegmentNode );

  return inherit( Node, DnaStrandSegmentNode );
} );
