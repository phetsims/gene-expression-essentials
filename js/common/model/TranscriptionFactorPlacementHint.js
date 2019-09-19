// Copyright 2015-2017, University of Colorado Boulder

/**
 *  Specialization of placement hint for transcription factors.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  //modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PlacementHint = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/PlacementHint' );
  const TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );

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

  return inherit( PlacementHint, TranscriptionFactorPlacementHint, {

    /**
     * @override
     * @param {MobileBiomolecule} testBiomolecule
     * @returns {boolean}
     * @public
     */
    isMatchingBiomolecule: function( testBiomolecule ) {
      return testBiomolecule instanceof TranscriptionFactor && ( testBiomolecule.getConfig() === this.tfConfig);
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
} );