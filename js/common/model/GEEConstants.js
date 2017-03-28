// Copyright 2015, University of Colorado Boulder

/**
 * The constants used in DNAMolecule is referred in multiple external places, so a separate constants file is created
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LENGTH_PER_TWIST = 340;// In picometers
  var BASE_PAIRS_PER_TWIST = 10;// In picometers.
  var INTER_POINT_DISTANCE = 50;// In picometers

  var GEEConstants = {

    // constants that define the geometry of the DNA molecule
    DNA_MOLECULE_DIAMETER: 200,
    LENGTH_PER_TWIST: LENGTH_PER_TWIST,// In picometers
    BASE_PAIRS_PER_TWIST: BASE_PAIRS_PER_TWIST,
    DISTANCE_BETWEEN_BASE_PAIRS: LENGTH_PER_TWIST / BASE_PAIRS_PER_TWIST,
    INTER_STRAND_OFFSET: LENGTH_PER_TWIST * 0.3,
    DNA_MOLECULE_Y_POS: 0, // Y position of the molecule in model space.

    FLORESCENT_FILL_COLOR: new Color( 200, 255, 58 ),

    DEFAULT_AFFINITY: 0.05, // Default affinity for any given biomolecule,

    CONFORMATIONAL_CHANGE_RATE: 1, // proportion per second

    VELOCITY_ON_DNA: 200, // Scalar velocity when moving between attachment points on the DNA.
    DEFAULT_ATTACH_TIME: 0.15, // // Time for attachment to a site on the DNA, in seconds.

    // Standard distance between points that define the shape. This is done to keep the number of points reasonable
    // and make the shape-defining algorithm consistent.
    INTER_POINT_DISTANCE: INTER_POINT_DISTANCE,

    // Length of the "leader segment", which is the portion of the mRNA that sticks out on the upper left side so that
    // a ribosome can be attached.
    LEADER_LENGTH: INTER_POINT_DISTANCE * 2,

    TRANSCRIPTION_FACTOR_MVT: ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
      new Vector2( 0, 0 ), 0.08 )
  };

  geneExpressionEssentials.register( 'GEEConstants', GEEConstants );

  return GEEConstants;
} );