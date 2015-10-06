// Copyright 2002-2015, University of Colorado Boulder

/**
 * Timer with stop, stop and restart method. Used for managing fade in and fade out of labels (though it is generic)
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Timer = require( 'JOIST/Timer' );

  /**
   *
   * @param {number} interval in milliseconds
   * @param {Function} listener
   * @constructor
   */
  function FadeTimer( interval, listener ) {
    this.interval = interval; // milliseconds
    this.listener = listener;
    PropertySet.call( this, {
      isRunning: false
    } );
    this._intervalId = null; // private
  }

  return inherit( PropertySet, FadeTimer, {
    // Starts the timer. This is a no-op if the timer is already running.
    start: function() {
      var self = this;
      if ( !this.isRunning ) {
        var thisTimer = this;
        thisTimer._intervalId = Timer.setInterval( function() {
          self.listener();
        }, this.interval );
        thisTimer.isRunning = true;
      }
    },

    // Stops the timer. This is a no-op if the timer is already stopped.
    stop: function() {
      if ( this.isRunning ) {
        Timer.clearInterval( this._intervalId );
        this._intervalId = null;
        this.isRunning = false;
      }
    },

    // Convenience function for restarting the timer.
    restart: function() {
      this.stop();
      this.start();
    }

  } );

} );
