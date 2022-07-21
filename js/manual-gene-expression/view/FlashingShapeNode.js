// Copyright 2015-2022, University of Colorado Boulder

/**
 * Node that has a shape and that can be set up to flash in a number of different ways.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import merge from '../../../../phet-core/js/merge.js';
import { Color, Node, Path } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import FlashController from './FlashController.js';

// constants
const INVISIBLE_COLOR = new Color( 0, 0, 0, 0 );

class FlashingShapeNode extends Node {

  /**
   * @param {Shape} shape
   * @param {Color} flashColor
   * @param {Object} [options]
   */
  constructor( shape, flashColor, options ) {
    options = merge( {
      onTime: 350,
      offTime: 350,
      numFlashes: 4,
      visibleAtStart: false,
      visibleAtEnd: true
    }, options );

    super();

    const flashingNode = new Path( shape, {
      fill: options.visibleAtStart ? flashColor : INVISIBLE_COLOR
    } );
    this.addChild( flashingNode );
    this.flashController = new FlashController( flashingNode, INVISIBLE_COLOR, flashColor, options );
  }

  /**
   * @public
   */
  startFlashing() {
    this.flashController.restart();
  }

  /**
   * @public
   */
  forceFlashOff() {
    this.flashController.forceFlashOff();
  }
}

geneExpressionEssentials.register( 'FlashingShapeNode', FlashingShapeNode );

export default FlashingShapeNode;