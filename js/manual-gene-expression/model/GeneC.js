// Copyright 2015-2021, University of Colorado Boulder

/**
 * Specific instance of a gene.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Range from '../../../../dot/js/Range.js';
import { Color } from '../../../../scenery/js/imports.js';
import Gene from '../../common/model/Gene.js';
import TranscriptionFactor from '../../common/model/TranscriptionFactor.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import ProteinC from './ProteinC.js';

// constants
const REGULATORY_REGION_COLOR = new Color( 216, 191, 216 );
const TRANSCRIBED_REGION_COLOR = new Color( 205, 255, 112, 150 );
const NUM_BASE_PAIRS_IN_REGULATORY_REGION = 28;
const NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION = 200;
const NUM_BASE_PAIRS = NUM_BASE_PAIRS_IN_REGULATORY_REGION + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION;
const MRNA_WINDING_ALGORITHM_NUMBER = 4;

class GeneC extends Gene {

  /**
   * @param {DnaMolecule} dnaMolecule -  The DNA molecule within which this gene exists
   * @param {number} initialBasePair - Where this gene starts on the DNA strand
   */
  constructor( dnaMolecule, initialBasePair ) {
    super( dnaMolecule,
      new Range( initialBasePair, initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION ),
      REGULATORY_REGION_COLOR,
      new Range(
        initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1,
        initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1 + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION
      ),
      TRANSCRIBED_REGION_COLOR,
      MRNA_WINDING_ALGORITHM_NUMBER
    );

    // Add transcription factors that are specific to this gene.  Position is pretty much arbitrary, just meant to look
    // decent.
    this.addTranscriptionFactorPosition( 5, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_1 );
    this.addTranscriptionFactorPosition( 16, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_2 );
    this.addTranscriptionFactorPosition( 11, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_NEG );
  }

  /**
   * @override
   * @returns {ProteinC}
   * @public
   */
  getProteinPrototype() {
    return new ProteinC();
  }

}


// statics
GeneC.NUM_BASE_PAIRS = NUM_BASE_PAIRS;

geneExpressionEssentials.register( 'GeneC', GeneC );

export default GeneC;
