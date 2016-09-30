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

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model;
//
//import java.awt.Color;
//
//import edu.colorado.phet.common.phetcommon.util.IntegerRange;
//import edu.colorado.phet.geneexpressionbasics.common.model.DnaMolecule;
//import edu.colorado.phet.geneexpressionbasics.common.model.Gene;
//import edu.colorado.phet.geneexpressionbasics.common.model.Protein;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor;
//
///**
// * Specific instance of a gene.
// *
// * @author John Blanco
// */
//public class GeneC extends Gene {
//
//    //-------------------------------------------------------------------------
//    // Class Data
//    //-------------------------------------------------------------------------
//
//    private static final Color REGULATORY_REGION_COLOR = new Color( 216, 191, 216 );
//    private static final Color TRANSCRIBED_REGION_COLOR = new Color( 205, 255, 112, 150 );
//    private static final int NUM_BASE_PAIRS_IN_REGULATORY_REGION = 28;
//    private static final int NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION = 200;
//    public static final int NUM_BASE_PAIRS = NUM_BASE_PAIRS_IN_REGULATORY_REGION + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION;
//
//    //-------------------------------------------------------------------------
//    // Constructor(s)
//    //-------------------------------------------------------------------------
//
//    /**
//     * Constructor.
//     *
//     * @param dnaMolecule     The DNA molecule within which this gene
//     *                        exists.
//     * @param initialBasePair Location on the DNA strand where this gene
//     *                        starts.
//     */
//    public GeneC( DnaMolecule dnaMolecule, int initialBasePair ) {
//        super( dnaMolecule,
//               new IntegerRange( initialBasePair, initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION ),
//               REGULATORY_REGION_COLOR,
//               new IntegerRange( initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1, initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1 + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION ),
//               TRANSCRIBED_REGION_COLOR
//        );
//
//        // Add transcription factors that are specific to this gene.  Location
//        // is pretty much arbitrary, just meant to look decent.
//        addTranscriptionFactor( 6, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_1 );
//        addTranscriptionFactor( 16, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_2 );
//        addTranscriptionFactor( 11, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_NEG );
//    }
//
//    @Override public Protein getProteinPrototype() {
//        return new ProteinC();
//    }
//}
