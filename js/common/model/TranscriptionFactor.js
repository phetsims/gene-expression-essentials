// Copyright 2015-2021, University of Colorado Boulder

/**
 * Class that represents a transcription factor in the model. There are multiple transcription factors, and some are
 * positive (in the sense that they increase the likelihood of transcription) and some are negative (i.e. the reduce the
 * likelihood of transcription).
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Color } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import TranscriptionFactorAttachmentStateMachine from './attachment-state-machines/TranscriptionFactorAttachmentStateMachine.js';
import BioShapeUtils from './BioShapeUtils.js';
import MobileBiomolecule from './MobileBiomolecule.js';
import StubGeneExpressionModel from './StubGeneExpressionModel.js';
import TranscriptionFactorConfig from './TranscriptionFactorConfig.js';

// constants
const WIDTH = 325;   // In nanometers.
const HEIGHT = 240;  // In nanometers.
const SIZE = new Dimension2( WIDTH, HEIGHT );

class TranscriptionFactor extends MobileBiomolecule {

  /**
   * @param {GeneExpressionModel} model
   * @param {TranscriptionFactorConfig} config
   * @param {Vector2} initialPosition
   */
  constructor( model, config, initialPosition ) {
    model = model || new StubGeneExpressionModel();
    initialPosition = initialPosition || new Vector2( 0, 0 );
    super( model, config.shape, config.baseColor );

    // Configuration used to create this transcription factor, used when comparing factors and creating copies.
    this.config = config; // @private
    this.setPosition( initialPosition );
  }

  /**
   * Get an indication of whether this transcription factor is positive (enhances transcription) or negative
   * (prevents or decreases likelihood of transcription).
   *
   * @returns {boolean}
   * @public
   */
  isPositive() {
    return this.config.isPositive;
  }

  /**
   * @override
   * Overridden in order to provide some unique behavior for transcription factors.
   * @returns {TranscriptionFactorAttachmentStateMachine}
   * @public
   */
  createAttachmentStateMachine() {
    return new TranscriptionFactorAttachmentStateMachine( this );
  }

  /**
   * @override
   * @public
   */
  handleReleasedByUser() {
    super.handleReleasedByUser();

    // A case that is unique to transcription factors: If released on top of another biomolecule on the DNA strand, go
    // directly into the detaching state so that this drifts away from the DNA. This makes it clear the you can't have
    // two transcription factors in the same place on the DNA.

    const moleculesShapes = this.model.getOverlappingBiomolecules( this.bounds );

    for ( let i = 0; i < moleculesShapes.length; i++ ) {
      const biomolecule = moleculesShapes[ i ];
      if ( biomolecule !== this && biomolecule.attachedToDnaProperty.get() ) {
        this.attachmentStateMachine.forceImmediateUnattachedButUnavailable();
        break;
      }
    }
  }

  /**
   * @override
   * @returns {Vector2}
   * @public
   */
  getDetachDirection() {
    // Randomly either up or down when detaching from DNA.
    return dotRandom.nextBoolean() ? new Vector2( 0, 1 ) : new Vector2( 0, -1 );
  }

  /**
   * @override
   * @returns {AttachmentSite}
   * @public
   */
  proposeAttachments() {

    // Transcription factors only attach to DNA.
    return this.model.getDnaMolecule().considerProposalFromTranscriptionFactor( this );
  }

  /**
   * @returns {TranscriptionFactorConfig}
   * @public
   */
  getConfig() {
    return this.config;
  }

}


// static definitions of all the transcription factor configurations that are used by this sim
TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS = new TranscriptionFactorConfig(
  BioShapeUtils.createRandomShape( SIZE, 1014 ),
  true,
  Color.yellow
);
TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG = new TranscriptionFactorConfig(
  BioShapeUtils.createRandomShape( SIZE, 2000 ),
  false,
  Color.red
);
TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_2_POS_1 = new TranscriptionFactorConfig(
  BioShapeUtils.createRandomShape( SIZE, 3004 ),
  true,
  Color.orange
);
TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_2_POS_2 = new TranscriptionFactorConfig(
  BioShapeUtils.createRandomShape( SIZE, 1 ),
  true,
  new Color( 0, 255, 127 )
);
TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_2_NEG = new TranscriptionFactorConfig(
  BioShapeUtils.createRandomShape( SIZE, 4000 ),
  false,
  new Color( 255, 255, 255 )
);
TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_1 = new TranscriptionFactorConfig(
  BioShapeUtils.createRandomShape( SIZE, 58 ),
  true,
  new Color( 255, 127, 0 )
);
TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_2 = new TranscriptionFactorConfig(
  BioShapeUtils.createRandomShape( SIZE, 96 ),
  true,
  new Color( 255, 99, 71 )
);
TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_3_NEG = new TranscriptionFactorConfig(
  BioShapeUtils.createRandomShape( SIZE, 40 ),
  false,
  Color.magenta
);

geneExpressionEssentials.register( 'TranscriptionFactor', TranscriptionFactor );

export default TranscriptionFactor;