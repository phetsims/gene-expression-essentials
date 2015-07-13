//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Specialization of the attachment site for transcription factors -
 * associates a transcription factor configuration and a property with the
 * attachment site.
 * <p/>
 * NOTE TO SELF (or other future developers): If any other attachment site is
 * needed that has variable affinity, the class hierarchy should be changed to
 * make this more general.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentSite = require( 'GENE_EXPRESSION_BASICS/common/model/AttachmentSite' );

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

  return inherit( AttachmentSite, TranscriptionFactorAttachmentSite, {

    /**
     *
     * @param {TranscriptionFactorConfig} tfConfig
     * @returns {boolean}
     */
    configurationMatches: function( tfConfig ) {
      return this.tfConfig === tfConfig ;
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
//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor.TranscriptionFactorConfig;
//
///**
// * Specialization of the attachment site for transcription factors -
// * associates a transcription factor configuration and a property with the
// * attachment site.
// * <p/>
// * NOTE TO SELF (or other future developers): If any other attachment site is
// * needed that has variable affinity, the class hierarchy should be changed to
// * make this more general.
// *
// * @author John Blanco
// */
//public class TranscriptionFactorAttachmentSite extends AttachmentSite {
//
//    // Configuration of TF that attaches to this site.
//    private final TranscriptionFactorConfig tfConfig;
//
//    /**
//     * Constructor.
//     *
//     * @param initialLocation
//     * @param initialAffinity
//     */
//    public TranscriptionFactorAttachmentSite( Vector2D initialLocation, TranscriptionFactorConfig tfConfig, double initialAffinity ) {
//        super( initialLocation, initialAffinity );
//        this.tfConfig = tfConfig;
//    }
//
//    public boolean configurationMatches( TranscriptionFactorConfig tfConfig ) {
//        return this.tfConfig.equals( tfConfig );
//    }
//
//    public TranscriptionFactorConfig getTfConfig() {
//        return tfConfig;
//    }
//}
