// Copyright 2002-2015, University of Colorado Boulder
/**
 * This class defined the attachment state machine for all ribosomes.
 * Ribosomes pretty much only connect to mRNA, so that's what this controls.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericAttachmentStateMachine' );
  var RibosomeAttachedState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/RibosomeAttachedState' );
  var GeneExpressionRibosomeConstant = require( 'GENE_EXPRESSION_BASICS/common/model/GeneExpressionRibosomeConstant' );


  /**
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function RibosomeAttachmentStateMachine( biomolecule ) {
    GenericAttachmentStateMachine.call( this, biomolecule );

    // Set up a local reference of the needed type.
    // Reference back to the ribosome that is controlled by this state machine.
    this.ribosome = biomolecule;

    // Protein created during translation process, null if no protein is being
    // synthesized.
    this.proteinBeingSynthesized = null;

    // Set up offset used when attaching to mRNA.
    this.setDestinationOffsetByVector( GeneExpressionRibosomeConstant.OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE);

    // Set up a non-default "attached" state, since the behavior is different from the default.
    this.attachedState = new RibosomeAttachedState( this );
  }

  return inherit( GenericAttachmentStateMachine, RibosomeAttachmentStateMachine, {

    /**
     * @Override
     */
    forceImmediateUnattachedAndAvailable: function() {
      if ( this.ribosome.getMessengerRnaBeingTranslated() !== null ) {
        this.ribosome.releaseMessengerRna();
      }
      GenericAttachmentStateMachine.prototype.forceImmediateUnattachedAndAvailable.call( this );
    }


  } );


} );
