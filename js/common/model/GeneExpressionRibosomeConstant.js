// Copyright 2015, University of Colorado Boulder

/**
 * common constants are used in  gene expression model
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  var WIDTH = 430;                  // In nanometers.
  var OVERALL_HEIGHT = 450;         // In nanometers.
  var TOP_SUBUNIT_HEIGHT_PROPORTION = 0.6;
  var TOP_SUBUNIT_HEIGHT = OVERALL_HEIGHT * TOP_SUBUNIT_HEIGHT_PROPORTION;
  var BOTTOM_SUBUNIT_HEIGHT = OVERALL_HEIGHT * ( 1 - TOP_SUBUNIT_HEIGHT_PROPORTION );

  // Offset from the center position to the entrance of the translation
  // channel.  May require some tweaking if the shape changes.
  var OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE = new Vector2( WIDTH / 2, -OVERALL_HEIGHT * 0.20 );

  // Offset from the center position to the point from which the protein
  // emerges.  May require some tweaking if the overall shape changes.
  var OFFSET_TO_PROTEIN_OUTPUT_CHANNEL = new Vector2( WIDTH * 0.4, OVERALL_HEIGHT * 0.55 );

  /**
   *
   * @constructor
   */
  function GeneExpressionRibosomeConstant() {
  }

  return inherit( Object, GeneExpressionRibosomeConstant, {}, {

    WIDTH: WIDTH,
    OVERALL_HEIGHT: OVERALL_HEIGHT,
    TOP_SUBUNIT_HEIGHT_PROPORTION: TOP_SUBUNIT_HEIGHT_PROPORTION,
    TOP_SUBUNIT_HEIGHT: TOP_SUBUNIT_HEIGHT,
    BOTTOM_SUBUNIT_HEIGHT: BOTTOM_SUBUNIT_HEIGHT,

    OFFSET_TO_PROTEIN_OUTPUT_CHANNEL: OFFSET_TO_PROTEIN_OUTPUT_CHANNEL,
    OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE: OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE

  } );
} );