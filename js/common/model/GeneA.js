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
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import ProteinA from '../../manual-gene-expression/model/ProteinA.js';
import Gene from './Gene.js';
import TranscriptionFactor from './TranscriptionFactor.js';

// constants
const REGULATORY_REGION_COLOR = new Color( 216, 191, 216 );
const TRANSCRIBED_REGION_COLOR = new Color( 255, 165, 79, 150 );
const NUM_BASE_PAIRS_IN_REGULATORY_REGION = 16;
const NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION = 100;
const MRNA_WINDING_ALGORITHM_NUMBER = 4;

class GeneA extends Gene {

  /**
   * Constructor.
   *
   * @param {DnaMolecule} dnaMolecule - The DNA molecule within which this gene exists.
   * @param {number} initialBasePair - Position on the DNA strand where this gene starts.
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

    // Add transcription factors that are specific to this gene. Position is withing the regulatory region, and the
    // negative factor should overlap, and thus block, the positive factor(s).
    this.addTranscriptionFactorPosition( 5, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS );
    this.addTranscriptionFactorPosition( 2, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG );
  }

  /**
   * @override
   * @returns {ProteinA}
   * @public
   */
  getProteinPrototype() {
    return new ProteinA();
  }

}

GeneA.NUM_BASE_PAIRS = NUM_BASE_PAIRS_IN_REGULATORY_REGION + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION;

geneExpressionEssentials.register( 'GeneA', GeneA );

export default GeneA;
