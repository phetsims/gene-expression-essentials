// Copyright 2016, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property.<number>} controller
   * @param {number} minValue
   * @param {number} maxValue
   * @constructor
   */
  function ControllerNode( controller, minValue, maxValue, minLabel, maxLabel, options ) {
    Node.call( this ); // Call super constructor.

    options = _.extend( {
      logScale: false
    }, options );

    var range;
    var passThroughController;
    if ( options.logScale ){
      range = new Range( Math.log10( minValue ), Math.log10( maxValue ) );
      passThroughController = new Property( Math.log10( controller.get() ) );
    }
    else{
      range = new Range( minValue, maxValue );
      passThroughController = new Property( controller.get() );
    }

    // Conversion to exponential.
    passThroughController.link( function( value ){
      if ( options.logScale ) {
        controller.set( Util.clamp( Math.pow( 10, value ), minValue, maxValue ) );
      }
      else{
        controller.set( value );
      }
    } );

    // Hook up the data flow in the other direction, so that if the
    // controlled value changes (which may occur, for example, when the
    // property is reset) this changes too.
    controller.link( function( value ){
      if ( options.logScale ){
        passThroughController.set( Math.log10( value ) );
      }
      else{
        passThroughController.set( value );
      }
    } );

    var tickLabelOptions = { font: new PhetFont( 12 ), pickable: false };

    var slider = new HSlider( passThroughController, range, {
      trackSize: new Dimension2( 80, 5 ),
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
  return inherit( Node, ControllerNode, {
    /*dispose: function() {
      this.controlIsotopeDispose();
    }*/
  } );
} );