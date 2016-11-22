// Copyright 2015, University of Colorado Boulder
/**
 *  Specialization of placement hint for transcription factors.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlacementHint = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/PlacementHint' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );

  /**
   *
   * @param {TranscriptionFactor} transcriptionFactor
   * @constructor
   */
  function TranscriptionFactorPlacementHint( transcriptionFactor ) {
    PlacementHint.call( this, transcriptionFactor );
    this.tfConfig = transcriptionFactor.getConfig(); // private
  }

  geneExpressionEssentials.register( 'TranscriptionFactorPlacementHint', TranscriptionFactorPlacementHint );

  return inherit( PlacementHint, TranscriptionFactorPlacementHint, {

    /**
     * @Override
     * @param {MobileBiomolecule} testBiomolecule
     * @returns {boolean}
     */
    isMatchingBiomolecule: function( testBiomolecule ) {
      return testBiomolecule instanceof TranscriptionFactor && ( testBiomolecule.getConfig() === this.tfConfig);
    },

    /**
     *
     * @param { TranscriptionFactorConfig } transcriptionFactorConfig
     */
    activateIfConfigMatch: function( transcriptionFactorConfig ) {
      if ( this.tfConfig === transcriptionFactorConfig ) {
        this.activeProperty.set( true );
      }
    }

  } );


} );
// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor.TranscriptionFactorConfig;
//
///**
// * Specialization of placement hint for transcription factors.
// *
// * @author John Blanco
// */
//public class TranscriptionFactorPlacementHint extends PlacementHint {
//
//    private final TranscriptionFactorConfig tfConfig;
//
//    /**
//     * Constructor.
//     *
//     * @param transcriptionFactor
//     */
//    public TranscriptionFactorPlacementHint( TranscriptionFactor transcriptionFactor ) {
//        super( transcriptionFactor );
//        this.tfConfig = transcriptionFactor.getConfig();
//    }
//
//    @Override public boolean isMatchingBiomolecule( MobileBiomolecule testBiomolecule ) {
//        return testBiomolecule instanceof TranscriptionFactor && ( (TranscriptionFactor) testBiomolecule ).getConfig().equals( tfConfig );
//    }
//
//    public void activateIfConfigMatch( TranscriptionFactorConfig transcriptionFactorConfig ) {
//        if ( this.tfConfig.equals( transcriptionFactorConfig ) ) {
//            active.set( true );
//        }
//    }
//}
