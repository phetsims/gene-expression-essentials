// Copyright 2015, University of Colorado Boulder

/**
 * Timer with stop, stop and restart method. Used for managing fade in and fade out of labels (though it is generic)
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Timer = require( 'PHET_CORE/Timer' );

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

  return inherit( Object, FadeTimer, {

    /**
     * Starts the timer. This is a no-op if the timer is already running.
     * @public
     */
    start: function() {
      var self = this;
      if ( !this.isRunningProperty.get() ) {
        self._intervalId = Timer.setInterval( function() {
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
        Timer.clearInterval( this._intervalId );
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
} );
