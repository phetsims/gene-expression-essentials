// Copyright 2016-2018, University of Colorado Boulder

/**
 * Class that created slider controller across the simulation. Scale for the controller can be linear or log
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const HSlider = require( 'SUN/HSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  /**
   * @param {Property.<number>} controller
   * @param {number} minValue
   * @param {number} maxValue
   * @param {String} minLabel
   * @param {String} maxLabel
   * @param {Object} [options]
   * @constructor
   */
  function ControllerNode( controller, minValue, maxValue, minLabel, maxLabel, options ) {
    Node.call( this ); // Call super constructor.

    options = _.extend( {
      logScale: false,
      trackSize: new Dimension2( 100, 5 )
    }, options );

    var range;
    var passThroughController;
    if ( options.logScale ) {
      range = new Range( Math.log( minValue ) / Math.LN10, Math.log( maxValue ) / Math.LN10 );
      passThroughController = new Property( Math.log( controller.get() ) / Math.LN10, { reentrant: true } );
    }
    else {
      range = new Range( minValue, maxValue );
      passThroughController = new Property( controller.get(), { reentrant: true } );
    }

    // Conversion to exponential.
    passThroughController.link( function( value ) {
      if ( options.logScale ) {
        controller.set( Util.clamp( Math.pow( 10, value ), minValue, maxValue ) );
      }
      else {
        controller.set( value );
      }
    } );

    // Hook up the data flow in the other direction, so that if the controlled value changes (which may occur, for
    // example, when the property is reset) this changes too.
    controller.link( function( value ) {
      if ( options.logScale ) {
        passThroughController.set( Math.log( value ) / Math.LN10 );
      }
      else {
        passThroughController.set( value );
      }
    } );

    var tickLabelOptions = {
      font: new PhetFont( 12 ),
      pickable: false,
      maxWidth: 50
    };

    var slider = new HSlider( passThroughController, range, {
      trackSize: options.trackSize,
      thumbSize: new Dimension2( 15, 30 ),
      majorTickLength: 15,
      tickLabelSpacing: 0
    } );

    // major ticks
    slider.addMajorTick( range.min, new Text( minLabel, tickLabelOptions ) );
    slider.addMajorTick( range.max, new Text( maxLabel, tickLabelOptions ) );
    this.addChild( slider );

  }

  geneExpressionEssentials.register( 'ControllerNode', ControllerNode );

  return inherit( Node, ControllerNode, {} );
} );