// Copyright 2015-2020, University of Colorado Boulder

/**
 * Specialization of the attachment site for transcription factors - associates a transcription factor configuration and
 * a property with the attachment site.
 *
 * NOTE TO SELF (or other future developers): If any other attachment site is needed that has variable affinity, the
 * class hierarchy should be changed to make this more general.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


//modules
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import AttachmentSite from './AttachmentSite.js';

class TranscriptionFactorAttachmentSite extends AttachmentSite {

  /**
   * @param {Object} owner - the molecule upon which this attachment site exists
   * @param {Vector2} initialPosition
   * @param {TranscriptionFactorConfig} tfConfig
   * @param {number} initialAffinity
   */
  constructor( owner, initialPosition, tfConfig, initialAffinity ) {
    super( owner, initialPosition, initialAffinity );

    // Configuration of TF that attaches to this site.
    this.tfConfig = tfConfig; // @private
  }

  /**
   * @param {TranscriptionFactorConfig} tfConfig
   * @returns {boolean}
   * @public
   */
  configurationMatches( tfConfig ) {
    return this.tfConfig === tfConfig;
  }

  /**
   * @returns {TranscriptionFactorConfig}
   * @public
   */
  getTfConfig() {
    return this.tfConfig;
  }
}

geneExpressionEssentials.register( 'TranscriptionFactorAttachmentSite', TranscriptionFactorAttachmentSite );

export default TranscriptionFactorAttachmentSite;
