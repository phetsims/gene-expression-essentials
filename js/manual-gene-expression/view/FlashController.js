// Copyright 2015-2020, University of Colorado Boulder

/**
 * type that is used to implement a 'flashing' behavior in a node by switching colors using a timer
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import stepTimer from '../../../../axon/js/stepTimer.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class FlashController {

  /**
   * @param {Path} flashingNode
   * @param {Color} normalColor
   * @param {Color} flashColor
   * @param {Object} [options]
   */
  constructor( flashingNode, normalColor, flashColor, options ) {

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
    this.timerListener = () => {
      this.timerHandle = null;
      if ( this.flashingNode.fill === this.flashColor ) {

        // Flash is on, so turn flash off.
        this.flashingNode.fill = this.normalColor;
        time = options.offTime;
      }
      else {

        // Flash is off, so turn flash on.
        this.flashingNode.fill = this.flashColor;
        time = options.onTime;
      }
      this.transitionCountdown--;
      if ( this.transitionCountdown > 0 ) {

        // Set timer for next transition.
        this.timerHandle = stepTimer.setTimeout( this.timerListener, time );
      }
    };
  }

  /**
   * @returns {boolean}
   * @public
   */
  isFlashing() {
    return this.timerHandle !== null;
  }

  /**
   * @public
   */
  stop() {
    if ( this.timerHandle ) {
      stepTimer.clearTimeout( this.timerHandle );
    }
    this.timerHandle = null;
  }

  /**
   * @public
   */
  forceFlashOff() {
    if ( this.isFlashing() ) {
      this.stop();
    }
    this.setFlashOn( false );
  }

  /**
   * @public
   */
  restart() {
    this.stop();
    this.setFlashOn( this.flashOnAtStart );
    this.transitionCountdown = this.numFlashes * 2;
    if ( this.flashOnAtStart !== this.flashOnAtEnd ) {
      this.transitionCountdown -= 1;
    }
    this.timerListener();
  }

  /**
   * @param {boolean} flashOn
   * @private
   */
  setFlashOn( flashOn ) {
    this.flashingNode.fill = flashOn ? this.flashColor : this.normalColor;
  }
}

geneExpressionEssentials.register( 'FlashController', FlashController );

export default FlashController;