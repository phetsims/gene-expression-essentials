//  Copyright 2002-2014, University of Colorado Boulder
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
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var GeneExpressionRibosomeConstant = require( 'GENE_EXPRESSION_BASICS/common/model/GeneExpressionRibosomeConstant' );
  var RibosomeTranslatingRnaMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/RibosomeTranslatingRnaMotionStrategy' );

  // constants
  var RNA_TRANSLATION_RATE = 750; // Picometers per second. // Scalar velocity for transcription.

  // private classes
  /**
   * Class that defines what the ribosome does when attached to mRNA, which
   * is essentially to transcribe it.
   */
  var RibosomeAttachedState = inherit( AttachmentState,

    /**
     * @param {RibosomeAttachmentStateMachine} ribosomeAttachmentStateMachine
     */
    function( ribosomeAttachmentStateMachine ) {
      this.ribosomeAttachmentStateMachine = ribosomeAttachmentStateMachine;
    },

    {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var proteinBeingSynthesized = this.ribosomeAttachmentStateMachine.proteinBeingSynthesized;
        var ribosome = this.ribosomeAttachmentStateMachine.ribosome;

        // Grow the protein.
        proteinBeingSynthesized.setFullSizeProportion(
          ribosome.getMessengerRnaBeingTranslated().getProportionOfRnaTranslated( ribosome ) );
        proteinBeingSynthesized.setAttachmentPointPosition( ribosome.getProteinAttachmentPoint() );

        // Advance the translation of the mRNA.
        var translationComplete = ribosome.advanceMessengerRnaTranslation( RNA_TRANSLATION_RATE * dt );
        if ( translationComplete ) {

          // Release the mRNA.
          ribosome.releaseMessengerRna();

          // Release the protein.
          proteinBeingSynthesized.release();
          proteinBeingSynthesized = null;

          // Release this ribosome to wander in the cytoplasm.
          asm.detach();
        }
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var ribosome = this.ribosomeAttachmentStateMachine.ribosome;
        var proteinBeingSynthesized = this.ribosomeAttachmentStateMachine.proteinBeingSynthesized;
        ribosome.initiateTranslation();
        ribosome.setMotionStrategy( new RibosomeTranslatingRnaMotionStrategy( ribosome ) );
        proteinBeingSynthesized = ribosome.getMessengerRnaBeingTranslated().getProteinPrototype().createInstance();
        proteinBeingSynthesized.setAttachmentPointPosition( ribosome.getProteinAttachmentPoint() );
        ribosome.getModel().addMobileBiomolecule( proteinBeingSynthesized );

        // Prevent user interaction while translating.
        asm.biomolecule.movableByUser.set( false );
      }


    } );


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
    this.setDestinationOffset( GeneExpressionRibosomeConstant.OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE );

    // Set up a non-default "attached" state, since the behavior is
    // different from the default.
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
      RibosomeAttachmentStateMachine.prototype.forceImmediateUnattachedAndAvailable.call( this );
    }


  } );


} );
