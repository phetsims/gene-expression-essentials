//  Copyright 2002-2015, University of Colorado Boulder

/**
 * Node that has a shape and that can be set up to flash in a number of  different ways.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Color = require( 'SCENERY/util/Color' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Timer = require( 'JOIST/Timer' );

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
    var transitionCountdown = 0;

    this.flashingNode = flashingNode;
    this.flashColor = flashColor;
    this.normalColor = normalColor;
    this.flashOnAtStart = flashOnAtStart;
    this.flashOnAtEnd = flashOnAtEnd;
    this.numFlashes = numFlashes;
    this.timerHandle = null;

    var time = 0;
    this.timerListener = function() {
      if ( flashingNode.fill === flashColor ) {
        // Flash is on, so turn flash off.
        flashingNode.fill = normalColor;
        time = offTime;
      }
      else {
        // Flash is off, so turn flash on.
        flashingNode.fill = flashColor;
        time = onTime;
      }
      transitionCountdown--;
      if ( transitionCountdown > 0 ) {
        // Set timer for next transition.
        self.stop();
        self.timerHandle = Timer.setTimeout( self.timerListener, time );
      }
      else {
        // Done flashing.
        self.stop();
      }
    };

    // Set up the timer.
    this.timerListener();


  }

  inherit( Object, FlashController, {

    isFlashing: function() {
      return this.timerHandle !== null;
    },

    stop: function() {
      if ( this.timerHandle ) {
        Timer.clearTimeout( this.timerHandle );
      }
      this.timerHandle = null;
    },

    forceFlashOff: function() {
      if ( this.isFlashing() ) {
        this.stop();
      }
      this.setFlashOn( false );
    },

    restart: function() {
      this.stop();
      this.setFlashOn( this.flashOnAtStart );
      this.transitionCountdown = this.numFlashes * 2;
      if ( this.flashOnAtStart !== this.flashOnAtEnd ) {
        this.transitionCountdown -= 1;
      }
      this.timerHandle = Timer.setTimeout( this.timerListener, 0 );
    },

    /**
     * // private
     * @param {boolean} flashOn
     */
    setFlashOn: function( flashOn ) {
      this.flashingNode.fill = flashOn ? this.flashColor : this.normalColor;
    }

  } );

  /**
   *
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
    var thisNode = this;
    Node.call( thisNode );

    var flashingNode = new Path( shape, {
      fill: visibleAtStart ? flashColor : INVISIBLE_COLOR
    } );
    thisNode.addChild( flashingNode );
    this.flashController = new FlashController( flashingNode, INVISIBLE_COLOR, flashColor, onTime, offTime, numFlashes, visibleAtStart, visibleAtEnd );

  }


  return inherit( Node, FlashingShapeNode, {
    startFlashing: function() {
      this.flashController.restart();
    },

    stopFlashing: function() {
      this.flashController.stop();
    },

    forceFlashOff: function() {
      this.flashController.forceFlashOff();
    }
  } );
} );


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.manualgeneexpression.view;
//
//import java.awt.Color;
//import java.awt.Shape;
//import java.awt.event.ActionEvent;
//import java.awt.event.ActionListener;
//
//import javax.swing.Timer;
//
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PPath;
//
///**
// * PNode that has a shape and that can be set up to flash in a number of
// * different ways.
// *
// * @author John Blanco
// */
//class FlashingShapeNode extends PNode {
//
//    private static final Color INVISIBLE_COLOR = new Color( 0, 0, 0, 0 );
//
//    private final FlashController flashController;
//
//    public FlashingShapeNode( Shape shape, Color flashColor, int onTime, int offTime, int numFlashes, boolean visibleAtStart, boolean visibleAtEnd ) {
//        PPath flashingNode = new PhetPPath( shape, visibleAtStart ? flashColor : INVISIBLE_COLOR );
//        addChild( flashingNode );
//        flashController = new FlashController( flashingNode, INVISIBLE_COLOR, flashColor, onTime, offTime, numFlashes, visibleAtStart, visibleAtEnd );
//    }
//
//    public void startFlashing() {
//        flashController.restart();
//    }
//
//    public void stopFlashing() {
//        flashController.stop();
//    }
//
//    public void forceFlashOff() {
//        flashController.forceFlashOff();
//    }
//
//    /**
//     * Class that controls timed flashing.
//     */
//    private static class FlashController {
//
//        // Variables used to implement the flashing behavior.
//        private int transitionCountdown = 0;
//        private Timer flashTimer;
//        private final PPath flashingNode;
//        private final Color normalColor;
//        private final Color flashColor;
//        private final boolean flashOnAtStart;
//        private final boolean flashOnAtEnd;
//        private final int numFlashes;
//
//        /**
//         * Constructor.
//         *
//         * @param flashingNode
//         * @param normalColor
//         * @param flashColor
//         * @param onTime       - in milliseconds
//         * @param offTime      - in milliseconds
//         */
//        private FlashController( final PPath flashingNode, final Color normalColor, final Color flashColor,
//                                 final int onTime, final int offTime, final int numFlashes, boolean flashOnAtStart, boolean flashOnAtEnd ) {
//
//            this.flashingNode = flashingNode;
//            this.flashColor = flashColor;
//            this.normalColor = normalColor;
//            this.flashOnAtStart = flashOnAtStart;
//            this.flashOnAtEnd = flashOnAtEnd;
//            this.numFlashes = numFlashes;
//
//            // Set up the timer.
//            flashTimer = new Timer( Integer.MAX_VALUE, new ActionListener() {
//                public void actionPerformed( ActionEvent e ) {
//                    int time;
//                    if ( flashingNode.getPaint() == flashColor ) {
//                        // Flash is on, so turn flash off.
//                        flashingNode.setPaint( normalColor );
//                        time = offTime;
//                    }
//                    else {
//                        // Flash is off, so turn flash on.
//                        flashingNode.setPaint( flashColor );
//                        time = onTime;
//                    }
//                    transitionCountdown--;
//                    if ( transitionCountdown > 0 ) {
//                        // Set timer for next transition.
//                        flashTimer.setInitialDelay( time );
//                        flashTimer.restart();
//                    }
//                    else {
//                        // Done flashing.
//                        flashTimer.stop();
//                    }
//                }
//            } );
//            flashTimer.setRepeats( false );
//        }
//
//        public void restart() {
//            flashTimer.stop();
//            setFlashOn( flashOnAtStart );
//            transitionCountdown = numFlashes * 2;
//            if ( flashOnAtStart != flashOnAtEnd ) {
//                transitionCountdown -= 1;
//            }
//            flashTimer.setInitialDelay( 0 );
//            flashTimer.restart();
//        }
//
//        public boolean isFlashing() {
//            return flashTimer.isRunning();
//        }
//
//        public void stop() {
//            flashTimer.stop();
//        }
//
//        public void forceFlashOff() {
//            if ( isFlashing() ) {
//                stop();
//            }
//            setFlashOn( false );
//        }
//
//        private void setFlashOn( boolean flashOn ) {
//            flashingNode.setPaint( flashOn ? flashColor : normalColor );
//        }
//    }
//}
