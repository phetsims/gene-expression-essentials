// Copyright 2015-2020, University of Colorado Boulder

/**
 * Timer with stop, stop and restart method. Used for managing fade in and fade out of labels (though it is generic)
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../../axon/js/Property.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class FadeTimer {

  /**
   * @param {number} interval in milliseconds
   * @param {Function} listener
   */
  constructor( interval, listener ) {
    this.interval = interval; // milliseconds // @private
    this.listener = listener; // @private
    this.isRunningProperty = new Property( false ); // @public
    this._intervalId = null; // @private
  }

  /**
   * Starts the timer. This is a no-op if the timer is already running.
   * @public
   */
  start() {
    if ( !this.isRunningProperty.get() ) {
      this._intervalId = stepTimer.setInterval( () => {
        this.listener();
      }, this.interval );
      this.isRunningProperty.set( true );
    }
  }

  /**
   * Stops the timer. This is a no-op if the timer is already stopped.
   * @public
   */
  stop() {
    if ( this.isRunningProperty.get() ) {
      stepTimer.clearInterval( this._intervalId );
      this._intervalId = null;
      this.isRunningProperty.set( false );
    }
  }

  /**
   * Convenience function for restarting the timer.
   * @public
   */
  restart() {
    this.stop();
    this.start();
  }
}

geneExpressionEssentials.register( 'FadeTimer', FadeTimer );

export default FadeTimer;