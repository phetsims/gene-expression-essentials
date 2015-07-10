// Copyright 2002-2014, University of Colorado Boulder

/**
 * common constants are used in  gene expression model
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  // Overall size of the polymerase molecule.
  var WIDTH = 340;   // picometers
  var HEIGHT = 480;  // picometers

  // Offset from the center of the molecule to the location where mRNA
  // should emerge when transcription is occurring.  This is determined
  // empirically, and may need to change if the shape is changed.
  var MESSENGER_RNA_GENERATION_OFFSET = new Vector2( -WIDTH * 0.4, HEIGHT * 0.4 );

  /**
   *
   * @constructor
   */
  function GeneExpressionRnaPolymeraseConstant() {
  }

  return inherit( Object, GeneExpressionRnaPolymeraseConstant, {}, {

    WIDTH : WIDTH,
    HEIGHT : HEIGHT,
    MESSENGER_RNA_GENERATION_OFFSET : MESSENGER_RNA_GENERATION_OFFSET

  } );
} );