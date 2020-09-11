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
import inherit from '../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

/**
 *
 * @param {number} interval in milliseconds
 * @param {Function} listener
 * @constructor
 */
function FadeTimer( interval, listener ) {
  this.interval = interval; // milliseconds // @private
  this.listener = listener; // @private
  this.isRunningProperty = new Property( false ); // @public
  this._intervalId = null; // @private
}

geneExpressionEssentials.register( 'FadeTimer', FadeTimer );

inherit( Object, FadeTimer, {

  /**
   * Starts the timer. This is a no-op if the timer is already running.
   * @public
   */
  start: function() {
    const self = this;
    if ( !this.isRunningProperty.get() ) {
      self._intervalId = stepTimer.setInterval( function() {
        self.listener();
      }, this.interval );
      self.isRunningProperty.set( true );
    }
  },

  /**
   * Stops the timer. This is a no-op if the timer is already stopped.
   * @public
   */
  stop: function() {
    if ( this.isRunningProperty.get() ) {
      stepTimer.clearInterval( this._intervalId );
      this._intervalId = null;
      this.isRunningProperty.set( false );
    }
  },

  /**
   * Convenience function for restarting the timer.
   * @public
   */
  restart: function() {
    this.stop();
    this.start();
  }
} );

export default FadeTimer;