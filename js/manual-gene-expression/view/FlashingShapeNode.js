// Copyright 2015-2019, University of Colorado Boulder

/**
 * Node that has a shape and that can be set up to flash in a number of different ways.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const FlashController = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/FlashController' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );

  // constants
  const INVISIBLE_COLOR = new Color( 0, 0, 0, 0 );

  /**
   * @param {Shape} shape
   * @param {Color} flashColor
   * @param {Object} [options]
   * @constructor
   */
  function FlashingShapeNode( shape, flashColor, options ) {
    options = merge( {
      onTime: 350,
      offTime: 350,
      numFlashes: 4,
      visibleAtStart: false,
      visibleAtEnd: true
    }, options );

    Node.call( this );

    const flashingNode = new Path( shape, {
      fill: options.visibleAtStart ? flashColor : INVISIBLE_COLOR
    } );
    this.addChild( flashingNode );
    this.flashController = new FlashController( flashingNode, INVISIBLE_COLOR, flashColor, options );
  }

  geneExpressionEssentials.register( 'FlashingShapeNode', FlashingShapeNode );

  return inherit( Node, FlashingShapeNode, {

    /**
     * @public
     */
    startFlashing: function() {
      this.flashController.restart();
    },

    /**
     * @public
     */
    forceFlashOff: function() {
      this.flashController.forceFlashOff();
    }
  } );
} );