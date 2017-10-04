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
  var ProteinA = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinA' );
  var Range = require( 'DOT/Range' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );

  // constants
  var REGULATORY_REGION_COLOR = new Color( 216, 191, 216 );
  var TRANSCRIBED_REGION_COLOR = new Color( 255, 165, 79, 150 );
  var NUM_BASE_PAIRS_IN_REGULATORY_REGION = 16;
  var NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION = 100;
  var MRNA_WINDING_ALGORITHM_NUMBER = 6;

  /**
   * Constructor.
   *
   * @param {DnaMolecule} dnaMolecule - The DNA molecule within which this gene exists.
   * @param {number} initialBasePair - Location on the DNA strand where this gene starts.
   * @constructor
   */
  function GeneA( dnaMolecule, initialBasePair ) {
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

    // Add transcription factors that are specific to this gene. Location is withing the regulatory region, and the
    // negative factor should overlap, and thus block, the positive factor(s).
    this.addTranscriptionFactorLocation( 5, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS );
    this.addTranscriptionFactorLocation( 2, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG );
  }

  geneExpressionEssentials.register( 'GeneA', GeneA );

  return inherit( Gene, GeneA, {

      /**
       * @override
       * @returns {ProteinA}
       * @public
       */
      getProteinPrototype: function() {
        return new ProteinA();
      }
    },
    {
      NUM_BASE_PAIRS: NUM_BASE_PAIRS_IN_REGULATORY_REGION + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION
    } );
} );
