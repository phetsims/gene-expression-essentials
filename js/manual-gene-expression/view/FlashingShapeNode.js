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
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Timer = require( 'PHET_CORE/Timer' );

  // constants
  var INVISIBLE_COLOR = new Color( 0, 0, 0, 0 );

  /**
   * Class that controls timed flashing.
   *
   * @param {Path} flashingNode
   * @param {Color} normalColor
   * @param {Color} flashColor
   * @param {number} onTime - in milliseconds
   * @param {number} offTime - in milliseconds
   * @param {number} numFlashes
   * @param {boolean} flashOnAtStart
   * @param {boolean} flashOnAtEnd
   * @constructor
   */
  function FlashController( flashingNode, normalColor, flashColor, onTime, offTime, numFlashes, flashOnAtStart, flashOnAtEnd ) {

    var self = this;

    // Variables used to implement the flashing behavior.
    this.transitionCountdown = 0; // @private
    this.flashingNode = flashingNode; // @private
    this.flashColor = flashColor; // @private
    this.normalColor = normalColor; // @private
    this.flashOnAtStart = flashOnAtStart; // @private
    this.flashOnAtEnd = flashOnAtEnd; // @private
    this.numFlashes = numFlashes; // @private
    this.timerHandle = null; // @private

    var time = 0;

    // @private
    this.timerListener = function() {
      self.timerHandle = null;
      if ( self.flashingNode.fill === self.flashColor ) {

        // Flash is on, so turn flash off.
        self.flashingNode.fill = self.normalColor;
        time = offTime;
      }
      else {

        // Flash is off, so turn flash on.
        self.flashingNode.fill = self.flashColor;
        time = onTime;
      }
      self.transitionCountdown--;
      if ( self.transitionCountdown > 0 ) {

        // Set timer for next transition.
        self.timerHandle = Timer.setTimeout( self.timerListener, time );
      }
    };
  }

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

  /**
   * @param {Shape} shape
   * @param {Color} flashColor
   * @param {number} onTime - in milliseconds
   * @param {number} offTime - in milliseconds
   * @param {number} numFlashes
   * @param {boolean} visibleAtStart
   * @param {boolean} visibleAtEnd
   * @constructor
   */
  function FlashingShapeNode( shape, flashColor, onTime, offTime, numFlashes, visibleAtStart, visibleAtEnd ) {
    var self = this;
    Node.call( self );

    var flashingNode = new Path( shape, {
      fill: visibleAtStart ? flashColor : INVISIBLE_COLOR
    } );
    self.addChild( flashingNode );
    this.flashController = new FlashController( flashingNode, INVISIBLE_COLOR, flashColor, onTime, offTime, numFlashes, visibleAtStart, visibleAtEnd );
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