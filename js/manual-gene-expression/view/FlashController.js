// Copyright 2017, University of Colorado Boulder

/**
 * Class that controls timed flashing.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Timer = require( 'PHET_CORE/Timer' );

  /**
   * @param {Path} flashingNode
   * @param {Color} normalColor
   * @param {Color} flashColor
   * @param {Object} [options]
   * @constructor
   */
  function FlashController( flashingNode, normalColor, flashColor, options ) {
    var self = this;


    // Variables used to implement the flashing behavior.
    this.transitionCountdown = 0; // @private
    this.flashingNode = flashingNode; // @private
    this.flashColor = flashColor; // @private
    this.normalColor = normalColor; // @private
    this.flashOnAtStart = options.visibleAtStart; // @private
    this.flashOnAtEnd = options.visibleAtEnd; // @private
    this.numFlashes = options.numFlashes; // @private
    this.timerHandle = null; // @private

    var time = 0;

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
        self.timerHandle = Timer.setTimeout( self.timerListener, time );
      }
    };
  }

  geneExpressionEssentials.register( 'FlashController', FlashController );

  return inherit( Object, FlashController, {

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
        Timer.clearTimeout( this.timerHandle );
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
} );
