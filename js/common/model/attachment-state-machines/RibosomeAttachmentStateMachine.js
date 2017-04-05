// Copyright 2015, University of Colorado Boulder

/**
 * This class defined the attachment state machine for all ribosomes. Ribosomes pretty much only connect to mRNA, so
 * that's what this controls.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericAttachmentStateMachine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RibosomeAttachedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/RibosomeAttachedState' );

  /**
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function RibosomeAttachmentStateMachine( biomolecule ) {
    GenericAttachmentStateMachine.call( this, biomolecule );

    // Set up a local reference of the needed type.

    this.ribosome = biomolecule; //@public

    // Protein created during translation process, null if no protein is being synthesized.
    this.proteinBeingSynthesized = null; //@public

    // Set up offset used when attaching to mRNA.
    this.setDestinationOffset( this.ribosome.offsetToTranslationChannelEntrance );

    // Set up a non-default "attached" state, since the behavior is different from the default.
    this.attachedState = new RibosomeAttachedState( this ); //@public
  }

  geneExpressionEssentials.register( 'RibosomeAttachmentStateMachine', RibosomeAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, RibosomeAttachmentStateMachine, {

    /**
     * @override
     * @public
     */
    forceImmediateUnattachedAndAvailable: function() {
      if ( this.ribosome.getMessengerRnaBeingTranslated() !== null ) {
        this.ribosome.releaseMessengerRna();
      }
      GenericAttachmentStateMachine.prototype.forceImmediateUnattachedAndAvailable.call( this );
    }
  } );
} );
