//  Copyright 2002-2014, University of Colorado Boulder
/**
 * The constants used in DNAMolecule is referred in multiple external places, so a separate constants file is created

 * @author Sharfudeen Ashraf (for Ghent University)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var LENGTH_PER_TWIST = 340;// In picometers
  var BASE_PAIRS_PER_TWIST = 10;// In picometers.

  var CommonConstants = {
    // Constants the define the geometry of the DNA molecule.
    DIAMETER: 200,
    LENGTH_PER_TWIST: LENGTH_PER_TWIST,// In picometers
    BASE_PAIRS_PER_TWIST: BASE_PAIRS_PER_TWIST,
    DISTANCE_BETWEEN_BASE_PAIRS: LENGTH_PER_TWIST / BASE_PAIRS_PER_TWIST,
    INTER_STRAND_OFFSET:         LENGTH_PER_TWIST * 0.3,
    Y_POS: 0,//Y position of the molecule in model space.
    WATER_EQUILIBRIUM_CONSTANT: 1E-14,
    DEFAULT_AFFINITY: 0.05 // Default affinity for any given biomolecule.
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( CommonConstants ); }


  return CommonConstants;

} );