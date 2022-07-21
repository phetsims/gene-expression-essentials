// Copyright 2015-2022, University of Colorado Boulder

/**
 * Node that is a textual label that can fade in and out.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import FadeTimer from './FadeTimer.js';

// constants
const FONT = new PhetFont( 14 );
const TIMER_DELAY = 100; // In milliseconds.

class FadeLabel extends Node {

  /**
   * @param {string} text
   * @param {boolean} initiallyVisible
   * @param {Property.<number>} existenceStrengthProperty
   */
  constructor( text, initiallyVisible, existenceStrengthProperty ) {
    super( { pickable: false } );
    this.fadeDelta = 0; // @private
    let opacity = 0;

    const label = new Text( text, { font: FONT, maxWidth: 80 } );
    this.addChild( label );

    if ( !initiallyVisible ) {
      this.setOpacity( 0 );
      opacity = 0;
    }
    else {
      opacity = 1;
    }

    // Create the timers that will be used for fading in and out.
    this.fadeInTimer = new FadeTimer( TIMER_DELAY, () => {
      opacity = Math.min( opacity + this.fadeDelta, existenceStrengthProperty.get() );
      updateTransparency();
      if ( opacity >= 1 ) {
        this.fadeInTimer.stop();
      }
    } );

    this.fadeOutTimer = new FadeTimer( TIMER_DELAY, () => {
      opacity = Math.min( Math.max( opacity - this.fadeDelta, 0 ), existenceStrengthProperty.get() );
      updateTransparency();
      if ( opacity <= 0 ) {
        this.fadeOutTimer.stop();
      }
    } );

    const updateTransparency = () => {
      this.opacity = Math.min( existenceStrengthProperty.get(), opacity );
    };

    // Update if existence strength changes.
    existenceStrengthProperty.link( () => {
      updateTransparency();
    } );

  }

  /**
   * @param {number} time // in millseconds
   * @public
   */
  startFadeIn( time ) {
    if ( this.fadeOutTimer.isRunningProperty.get() ) {
      this.fadeOutTimer.stop();
    }
    this.fadeDelta = TIMER_DELAY / time;
    this.fadeInTimer.restart();
  }

  /**
   * @param {number} time // in millseconds
   * @public
   */
  startFadeOut( time ) {
    if ( this.fadeInTimer.isRunningProperty.get() ) {
      this.fadeInTimer.stop();
    }
    this.fadeDelta = TIMER_DELAY / time;
    this.fadeOutTimer.restart();
  }
}

geneExpressionEssentials.register( 'FadeLabel', FadeLabel );

export default FadeLabel;