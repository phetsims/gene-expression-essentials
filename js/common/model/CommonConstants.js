//  Copyright 2002-2014, University of Colorado Boulder
/**
 * The constants used in DNAMolecule is referred in multiple external places, so a separate constants file is created

 * @author Sharfudeen Ashraf (for Ghent University)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );

  var LENGTH_PER_TWIST = 340;// In picometers
  var BASE_PAIRS_PER_TWIST = 10;// In picometers.
  var INTER_POINT_DISTANCE = 50;

  var CommonConstants = {
    // Constants the define the geometry of the DNA molecule.
    DNA_MOLECULE_DIAMETER: 200,
    LENGTH_PER_TWIST: LENGTH_PER_TWIST,// In picometers
    BASE_PAIRS_PER_TWIST: BASE_PAIRS_PER_TWIST,
    DISTANCE_BETWEEN_BASE_PAIRS: LENGTH_PER_TWIST / BASE_PAIRS_PER_TWIST,
    INTER_STRAND_OFFSET:         LENGTH_PER_TWIST * 0.3,
    DNA_MOLECULE_Y_POS: 0,//Y position of the molecule in model space.
    WATER_EQUILIBRIUM_CONSTANT: 1E-14,
    FLORESCENT_FILL_COLOR:new Color( 200, 255, 58 ),
    DEFAULT_AFFINITY: 0.05, // Default affinity for any given biomolecule,

    // Standard distance between points that define the shape.  This is done to
    // keep the number of points reasonable and make the shape-defining
    // algorithm consistent.
    INTER_POINT_DISTANCE:INTER_POINT_DISTANCE, // In picometers, empirically determined.

    // Length of the "leader segment", which is the portion of the mRNA that
    // sticks out on the upper left side so that a ribosome can be attached.
    LEADER_LENGTH: INTER_POINT_DISTANCE * 2
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( CommonConstants ); }


  return CommonConstants;

} );