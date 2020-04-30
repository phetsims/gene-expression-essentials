// Copyright 2015-2020, University of Colorado Boulder

/**
 * Node that has a shape and that can be set up to flash in a number of different ways.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import FlashController from './FlashController.js';

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

inherit( Node, FlashingShapeNode, {

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

export default FlashingShapeNode;