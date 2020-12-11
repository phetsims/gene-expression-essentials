// Copyright 2015-2020, University of Colorado Boulder

/**
 *  Specialization of placement hint for transcription factors.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


//modules
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import PlacementHint from './PlacementHint.js';
import TranscriptionFactor from './TranscriptionFactor.js';

class TranscriptionFactorPlacementHint extends PlacementHint {

  /**
   * @param {TranscriptionFactor} transcriptionFactor
   */
  constructor( transcriptionFactor ) {
    super( transcriptionFactor );
    this.setPosition( transcriptionFactor.getPosition() );
    this.tfConfig = transcriptionFactor.getConfig(); // @private
  }

  /**
   * @override
   * @param {MobileBiomolecule} testBiomolecule
   * @returns {boolean}
   * @public
   */
  isMatchingBiomolecule( testBiomolecule ) {
    return testBiomolecule instanceof TranscriptionFactor && ( testBiomolecule.getConfig() === this.tfConfig );
  }

  /**
   * @param { TranscriptionFactorConfig } transcriptionFactorConfig
   * @public
   */
  activateIfConfigMatch( transcriptionFactorConfig ) {
    if ( this.tfConfig === transcriptionFactorConfig ) {
      this.activeProperty.set( true );
    }
  }
}

geneExpressionEssentials.register( 'TranscriptionFactorPlacementHint', TranscriptionFactorPlacementHint );

export default TranscriptionFactorPlacementHint;