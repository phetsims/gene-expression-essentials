// Copyright 2015, University of Colorado Boulder

/**
 * Node that represents a cell (as in a biological organism) that changes color as the level of protein within the cell
 * changes. The color change is meant to represent a cell that is expressing a fluorescent protein, something like
 * Green Fluorescent Protein, or GFP.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Cell = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/model/Cell' );
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Util = require( 'DOT/Util' );

  // constants
  var NOMINAL_FILL_COLOR = new Color( 30, 30, 40 ); // Blue Gray
  var FLORESCENT_FILL_COLOR = new Color( 200, 255, 58 );
  var STROKE = 2;
  var STROKE_COLOR = Color.WHITE;

  /**
   * @param {Cell} cell
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ColorChangingCellNode( cell, mvt ) {
    Node.call( this );

    var cellBody = new Path( mvt.modelToViewShape( cell.getShape() ), {
      fill: NOMINAL_FILL_COLOR,
      stroke: STROKE_COLOR,
      lineWidth: STROKE,
      boundsMethod: 'unstroked',
      center: mvt.modelToViewXY( cell.positionX, cell.positionY )
    } );

    cell.proteinCount.lazyLink( function( proteinCount ) {
      var florescenceAmount = Util.clamp( ( proteinCount - Cell.ProteinLevelWhereColorChangeStarts ) /
                                          ( Cell.ProteinLevelWhereColorChangeCompletes - Cell.ProteinLevelWhereColorChangeStarts ), 0, 1.0 );
      cellBody.fill = Color.interpolateRGBA( NOMINAL_FILL_COLOR, FLORESCENT_FILL_COLOR, florescenceAmount );
    } );
    this.addChild( cellBody );
  }

  geneExpressionEssentials.register( 'ColorChangingCellNode', ColorChangingCellNode );

  return inherit( Node, ColorChangingCellNode, {}, {

    // statics
    NominalFillColor: NOMINAL_FILL_COLOR,
    FlorescentFillColor: FLORESCENT_FILL_COLOR
  } );
} );