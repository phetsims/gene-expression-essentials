// Copyright 2015, University of Colorado Boulder

/**
 * Node that has a shape and that can be set up to flash in a number of different ways.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var FlashController = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/FlashController' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  // constants
  var INVISIBLE_COLOR = new Color( 0, 0, 0, 0 );

  /**
   * @param {Shape} shape
   * @param {Color} flashColor
   * @param {Object} [options]
   * @constructor
   */
  function FlashingShapeNode( shape, flashColor, options ) {
    options = _.extend( {
      onTime: 350,
      offTime: 350,
      numFlashes: 4,
      visibleAtStart: false,
      visibleAtEnd: true
    }, options );

    var self = this;
    Node.call( self );

    var flashingNode = new Path( shape, {
      fill: options.visibleAtStart ? flashColor : INVISIBLE_COLOR
    } );
    self.addChild( flashingNode );
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