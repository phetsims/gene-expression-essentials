// Copyright 2015, University of Colorado Boulder
/**
 * Specific instance of a gene.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Gene = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Gene' );
  var Range = require( 'DOT/Range' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  var ProteinC = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/ProteinC' );

  // constants
  var REGULATORY_REGION_COLOR = new Color( 216, 191, 216 );
  var TRANSCRIBED_REGION_COLOR = new Color( 205, 255, 112, 150 );
  var NUM_BASE_PAIRS_IN_REGULATORY_REGION = 28;
  var NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION = 200;
  var NUM_BASE_PAIRS = NUM_BASE_PAIRS_IN_REGULATORY_REGION + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION;

  /**
   * @param {DnaMolecule} dnaMolecule -  The DNA molecule within which this gene exists
   * @param {number} initialBasePair - Location on the DNA strand where this gene starts
   * @constructor
   */
  function GeneC( dnaMolecule, initialBasePair ) {
    Gene.call( this, dnaMolecule,
      new Range( initialBasePair, initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION ),
      REGULATORY_REGION_COLOR,
      new Range( initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1, initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1 + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION ),
      TRANSCRIBED_REGION_COLOR
    );

    // Add transcription factors that are specific to this gene.  Location
    // is pretty much arbitrary, just meant to look decent.
    this.addTranscriptionFactor( 6, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_1 );
    this.addTranscriptionFactor( 16, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_2 );
    this.addTranscriptionFactor( 11, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_NEG );


  }

  geneExpressionEssentials.register( 'GeneC', GeneC );

  return inherit( Gene, GeneC, {


    /**
     * @Override
     * @returns {ProteinC}
     */
    getProteinPrototype: function() {
      return new ProteinC();
    }

  }, {

    NUM_BASE_PAIRS: NUM_BASE_PAIRS

  } );


} );
