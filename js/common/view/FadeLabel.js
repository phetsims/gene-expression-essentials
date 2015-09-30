//  Copyright 2002-2015, University of Colorado Boulder

/**
 * Node that is a textual label that can fade in and out.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var FadeTimer = require( 'GENE_EXPRESSION_BASICS/common/view/FadeTimer' );

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
    var thisLabel = this;
    Node.call( thisLabel );
    this.fadeDelta = 0;
    var opacity = 0;

    var label = new Text( text, { font: FONT } );
    thisLabel.addChild( label );

    if ( !initiallyVisible ) {
      opacity = 0;
    }
    else {
      opacity = 1;
    }

    // Create the timers that will be used for fading in and out.
    this.fadeInTimer = new FadeTimer( TIMER_DELAY, function() {
      opacity = Math.min( opacity + thisLabel.fadeDelta, existenceStrengthProperty.get() );
      updateTransparency();
      if ( opacity >= 1 ) {
        thisLabel.fadeInTimer.stop();
      }
    } );

    this.fadeOutTimer = new FadeTimer( TIMER_DELAY, function() {
      opacity = Math.min( Math.max( opacity - thisLabel.fadeDelta, 0 ), existenceStrengthProperty.get() );
      updateTransparency();
      if ( opacity <= 0 ) {
        thisLabel.fadeOutTimer.stop();
      }
    } );

    function updateTransparency() {
      thisLabel.opacity = Math.min( existenceStrengthProperty.get(), opacity );
    }

    // Update if existence strength changes.
    existenceStrengthProperty.link( function() {
      updateTransparency();
    } );

  }

  return inherit( Node, FadeLabel, {

    /**
     *
     * @param {number} time // in millseconds
     */
    startFadeIn: function( time ) {
      if ( this.fadeOutTimer.isRunning ) {
        this.fadeOutTimer.stop();
      }
      this.fadeDelta = TIMER_DELAY / time;
      this.fadeInTimer.restart();
    },

    /**
     *
     * @param {number} time // in millseconds
     */
    startFadeOut: function( time ) {
      if ( this.fadeInTimer.isRunning ) {
        this.fadeInTimer.stop();
      }
      this.fadeDelta = TIMER_DELAY / time;
      this.fadeOutTimer.restart();
    }
  } );

} );
