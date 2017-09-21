// Copyright 2015-2017, University of Colorado Boulder

/**
 * Node that is a textual label that can fade in and out.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var FadeTimer = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/FadeTimer' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var FONT = new PhetFont( 14 );
  var TIMER_DELAY = 100; // In milliseconds.

  /**
   *
   * @param {string} text
   * @param {boolean} initiallyVisible
   * @param {Property<number>} existenceStrengthProperty
   * @constructor
   */
  function FadeLabel( text, initiallyVisible, existenceStrengthProperty ) {
    var self = this;
    Node.call( self, { pickable: false } );
    this.fadeDelta = 0; // @private
    var opacity = 0;

    var label = new Text( text, { font: FONT, maxWidth: 80 } );
    this.addChild( label );

    if ( !initiallyVisible ) {
      this.setOpacity( 0 );
      opacity = 0;
    }
    else {
      opacity = 1;
    }

    // Create the timers that will be used for fading in and out.
    this.fadeInTimer = new FadeTimer( TIMER_DELAY, function() {
      opacity = Math.min( opacity + self.fadeDelta, existenceStrengthProperty.get() );
      updateTransparency();
      if ( opacity >= 1 ) {
        self.fadeInTimer.stop();
      }
    } );

    this.fadeOutTimer = new FadeTimer( TIMER_DELAY, function() {
      opacity = Math.min( Math.max( opacity - self.fadeDelta, 0 ), existenceStrengthProperty.get() );
      updateTransparency();
      if ( opacity <= 0 ) {
        self.fadeOutTimer.stop();
      }
    } );

    function updateTransparency() {
      self.opacity = Math.min( existenceStrengthProperty.get(), opacity );
    }

    // Update if existence strength changes.
    existenceStrengthProperty.link( function() {
      updateTransparency();
    } );

  }

  geneExpressionEssentials.register( 'FadeLabel', FadeLabel );

  return inherit( Node, FadeLabel, {

    /**
     * @param {number} time // in millseconds
     * @public
     */
    startFadeIn: function( time ) {
      if ( this.fadeOutTimer.isRunningProperty.get() ) {
        this.fadeOutTimer.stop();
      }
      this.fadeDelta = TIMER_DELAY / time;
      this.fadeInTimer.restart();
    },

    /**
     * @param {number} time // in millseconds
     * @public
     */
    startFadeOut: function( time ) {
      if ( this.fadeInTimer.isRunningProperty.get() ) {
        this.fadeInTimer.stop();
      }
      this.fadeDelta = TIMER_DELAY / time;
      this.fadeOutTimer.restart();
    }
  } );
} );
