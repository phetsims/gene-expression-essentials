// Copyright 2015, University of Colorado Boulder
/**
 *  Convenience class for a horizontal slider that has labels at each end
 * rather than having tick marks with labels below them.
 *
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  //constants
  var MIN_DIMENSION = 1E-7;


  /**
   *
   * @param width
   * @param height
   * @constructor
   */
  function SpacerNode( width, height ) {
    width = width || MIN_DIMENSION;
    height = height || MIN_DIMENSION;

    Rectangle.call( this, 0, 0, width, height );

  }

  geneExpressionEssentials.register( 'SpacerNode', SpacerNode );

  return inherit( Rectangle, SpacerNode, {
  }, {

    MIN_DIMENSION: MIN_DIMENSION
  } );
} );