// Copyright 2015-2020, University of Colorado Boulder

/**
 * type that is used to implement a 'flashing' behavior in a node by switching colors using a timer
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import timer from '../../../../axon/js/timer.js';
import inherit from '../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

/**
 * @param {Path} flashingNode
 * @param {Color} normalColor
 * @param {Color} flashColor
 * @param {Object} [options]
 * @constructor
 */
function FlashController( flashingNode, normalColor, flashColor, options ) {
  const self = this;

  // variables used to implement the flashing behavior
  this.transitionCountdown = 0; // @private
  this.flashingNode = flashingNode; // @private
  this.flashColor = flashColor; // @private
  this.normalColor = normalColor; // @private
  this.flashOnAtStart = options.visibleAtStart; // @private
  this.flashOnAtEnd = options.visibleAtEnd; // @private
  this.numFlashes = options.numFlashes; // @private
  this.timerHandle = null; // @private

  let time = 0;

  // @private
  this.timerListener = function() {
    self.timerHandle = null;
    if ( self.flashingNode.fill === self.flashColor ) {

      // Flash is on, so turn flash off.
      self.flashingNode.fill = self.normalColor;
      time = options.offTime;
    }
    else {

      // Flash is off, so turn flash on.
      self.flashingNode.fill = self.flashColor;
      time = options.onTime;
    }
    self.transitionCountdown--;
    if ( self.transitionCountdown > 0 ) {

      // Set timer for next transition.
      self.timerHandle = timer.setTimeout( self.timerListener, time );
    }
  };
}

geneExpressionEssentials.register( 'FlashController', FlashController );

inherit( Object, FlashController, {

  /**
   * @returns {boolean}
   * @public
   */
  isFlashing: function() {
    return this.timerHandle !== null;
  },

  /**
   * @public
   */
  stop: function() {
    if ( this.timerHandle ) {
      timer.clearTimeout( this.timerHandle );
    }
    this.timerHandle = null;
  },

  /**
   * @public
   */
  forceFlashOff: function() {
    if ( this.isFlashing() ) {
      this.stop();
    }
    this.setFlashOn( false );
  },

  /**
   * @public
   */
  restart: function() {
    this.stop();
    this.setFlashOn( this.flashOnAtStart );
    this.transitionCountdown = this.numFlashes * 2;
    if ( this.flashOnAtStart !== this.flashOnAtEnd ) {
      this.transitionCountdown -= 1;
    }
    this.timerListener();
  },

  /**
   * @param {boolean} flashOn
   * @private
   */
  setFlashOn: function( flashOn ) {
    this.flashingNode.fill = flashOn ? this.flashColor : this.normalColor;
  }
} );

export default FlashController;