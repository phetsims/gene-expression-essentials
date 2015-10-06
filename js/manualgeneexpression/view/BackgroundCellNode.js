// Copyright 2002-2015, University of Colorado Boulder

/**
 * A  node that looks like a cell (as in the biology concept of a cell).
 * This is used when cells are needed in the background and have no  corresponding model component.
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
  var Dimension2 = require( 'DOT/Dimension2' );
  var Color = require( 'SCENERY/util/Color' );
  var BioShapeUtils = require( 'GENE_EXPRESSION_BASICS/common/model/BioShapeUtils' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  //constants
  var DEFAULT_SIZE = new Dimension2( 65000, 20000 );
  var CELL_INTERIOR_COLOR = new Color( 190, 231, 251 );

  /**
   *
   * @param {centerLocation:Vector2,seed:number,size:number} options
   * @param {number} seed
   *
   * @constructor
   */
  function BackgroundCellNode( options ) {
    var thisNode = this;
    Node.call( thisNode );
    options = _.extend( {
      size: DEFAULT_SIZE,
      rotationAngle: 0
    }, options );

    var centerLocation = options.centerLocation;
    var seed = options.seed;
    var size = options.size;
    var rotationAngle = options.rotationAngle;

    var cellBody = new Path( BioShapeUtils.createEColiLikeShape( centerLocation, size.width, DEFAULT_SIZE.height, 0, seed ),
      {
        lineWidth: 500, // This is big because the cell is only ever shown when zoomed way out.
        stroke: Color.WHITE
      } );

    cellBody.rotateAround( centerLocation, rotationAngle );

    var cellInteriorPaint = new LinearGradient( centerLocation.x - size.width * 0.1, ( centerLocation.y - size.height * 0.5 ),
      ( centerLocation.x + size.width * 0.1 ), ( centerLocation.y + size.height * 0.5 ) );
    cellInteriorPaint.addColorStop( 1, CELL_INTERIOR_COLOR.darkerColor( 0.5 ) );
    cellInteriorPaint.addColorStop( 2, CELL_INTERIOR_COLOR.brighterColor( 0.25 ) );

    cellBody.fill = cellInteriorPaint;
    thisNode.addChild( cellBody );
  }


  return inherit( Node, BackgroundCellNode, {},

    //statics
    {
      // Default size in screen coordinates, which are pretty close to pixels
      // when there is no zoom in effect.  Size was empirically determined to
      // hold the DNA strand.
      DEFAULT_SIZE: DEFAULT_SIZE

    } );
} );
