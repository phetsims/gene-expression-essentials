// Copyright 2015-2017, University of Colorado Boulder

/**
 * Specific instance of a gene.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Gene = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Gene' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProteinC = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinC' );
  var Range = require( 'DOT/Range' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );

  // constants
  var REGULATORY_REGION_COLOR = new Color( 216, 191, 216 );
  var TRANSCRIBED_REGION_COLOR = new Color( 205, 255, 112, 150 );
  var NUM_BASE_PAIRS_IN_REGULATORY_REGION = 28;
  var NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION = 200;
  var NUM_BASE_PAIRS = NUM_BASE_PAIRS_IN_REGULATORY_REGION + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION;
  var MRNA_WINDING_ALGORITHM_NUMBER = 4;

  /**
   * @param {DnaMolecule} dnaMolecule -  The DNA molecule within which this gene exists
   * @param {number} initialBasePair - Location on the DNA strand where this gene starts
   * @constructor
   */
  function GeneC( dnaMolecule, initialBasePair ) {
    Gene.call( this, dnaMolecule,
      new Range( initialBasePair, initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION ),
      REGULATORY_REGION_COLOR,
      new Range(
        initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1,
        initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1 + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION
      ),
      TRANSCRIBED_REGION_COLOR,
      MRNA_WINDING_ALGORITHM_NUMBER
    );

    // Add transcription factors that are specific to this gene.  Location is pretty much arbitrary, just meant to look
    // decent.
    this.addTranscriptionFactorLocation( 5, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_1 );
    this.addTranscriptionFactorLocation( 16, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_2 );
    this.addTranscriptionFactorLocation( 11, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_NEG );
  }

  geneExpressionEssentials.register( 'GeneC', GeneC );

  return inherit( Gene, GeneC, {

    /**
     * @override
     * @returns {ProteinC}
     */
    getProteinPrototype: function() {
      return new ProteinC();
    }

  }, {

    // statics
    NUM_BASE_PAIRS: NUM_BASE_PAIRS

  } );
} );
