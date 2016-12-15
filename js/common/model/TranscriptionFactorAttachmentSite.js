// Copyright 2015, University of Colorado Boulder
/**
 * Specialization of the attachment site for transcription factors - associates a transcription factor configuration and
 * a property with the attachment site.
 *
 * NOTE TO SELF (or other future developers): If any other attachment site is needed that has variable affinity, the
 * class hierarchy should be changed to make this more general.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/AttachmentSite' );

  /**
   *
   * @param {Vector} initialLocation
   * @param {TranscriptionFactorConfig} tfConfig
   * @param {number} initialAffinity
   * @constructor
   */
  function TranscriptionFactorAttachmentSite( initialLocation, tfConfig, initialAffinity ) {
    AttachmentSite.call( this, initialLocation, initialAffinity );

    // Configuration of TF that attaches to this site.
    this.tfConfig = tfConfig; // private
  }

  geneExpressionEssentials.register( 'TranscriptionFactorAttachmentSite', TranscriptionFactorAttachmentSite );

  return inherit( AttachmentSite, TranscriptionFactorAttachmentSite, {

    /**
     *
     * @param {TranscriptionFactorConfig} tfConfig
     * @returns {boolean}
     */
    configurationMatches: function( tfConfig ) {
      return this.tfConfig === tfConfig;
    },

    /**
     *
     * @returns {TranscriptionFactorConfig}
     */
    getTfConfig: function() {
      return this.tfConfig;
    }
  } );

} );

