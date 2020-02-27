// Copyright 2015-2019, University of Colorado Boulder

/**
 *  Specialization of placement hint for transcription factors.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


//modules
import inherit from '../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import PlacementHint from './PlacementHint.js';
import TranscriptionFactor from './TranscriptionFactor.js';

/**
 * @param {TranscriptionFactor} transcriptionFactor
 * @constructor
 */
function TranscriptionFactorPlacementHint( transcriptionFactor ) {
  PlacementHint.call( this, transcriptionFactor );
  this.setPosition( transcriptionFactor.getPosition() );
  this.tfConfig = transcriptionFactor.getConfig(); // @private
}

geneExpressionEssentials.register( 'TranscriptionFactorPlacementHint', TranscriptionFactorPlacementHint );

export default inherit( PlacementHint, TranscriptionFactorPlacementHint, {

  /**
   * @override
   * @param {MobileBiomolecule} testBiomolecule
   * @returns {boolean}
   * @public
   */
  isMatchingBiomolecule: function( testBiomolecule ) {
    return testBiomolecule instanceof TranscriptionFactor && ( testBiomolecule.getConfig() === this.tfConfig );
  },

  /**
   * @param { TranscriptionFactorConfig } transcriptionFactorConfig
   * @public
   */
  activateIfConfigMatch: function( transcriptionFactorConfig ) {
    if ( this.tfConfig === transcriptionFactorConfig ) {
      this.activeProperty.set( true );
    }
  }
} );