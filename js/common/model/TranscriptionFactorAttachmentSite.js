// Copyright 2015-2017, University of Colorado Boulder

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
define( require => {
  'use strict';

  //modules
  const AttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/AttachmentSite' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Object} owner - the molecule upon which this attachment site exists
   * @param {Vector2} initialLocation
   * @param {TranscriptionFactorConfig} tfConfig
   * @param {number} initialAffinity
   * @constructor
   */
  function TranscriptionFactorAttachmentSite( owner, initialLocation, tfConfig, initialAffinity ) {
    AttachmentSite.call( this, owner, initialLocation, initialAffinity );

    // Configuration of TF that attaches to this site.
    this.tfConfig = tfConfig; // @private
  }

  geneExpressionEssentials.register( 'TranscriptionFactorAttachmentSite', TranscriptionFactorAttachmentSite );

  return inherit( AttachmentSite, TranscriptionFactorAttachmentSite, {

    /**
     * @param {TranscriptionFactorConfig} tfConfig
     * @returns {boolean}
     * @public
     */
    configurationMatches: function( tfConfig ) {
      return this.tfConfig === tfConfig;
    },

    /**
     * @returns {TranscriptionFactorConfig}
     * @public
     */
    getTfConfig: function() {
      return this.tfConfig;
    }
  } );
} );

