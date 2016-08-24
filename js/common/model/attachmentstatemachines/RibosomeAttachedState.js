// Copyright 2015, University of Colorado Boulder
/**
 /**
 * Class that defines what the ribosome does when attached to mRNA, which
 * is essentially to transcribe it.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
  var RibosomeTranslatingRnaMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/RibosomeTranslatingRnaMotionStrategy' );

  // constants
  var RNA_TRANSLATION_RATE = 750; // Picometers per second. // Scalar velocity for transcription.

  // to avoid creating excessive vector2 instances, we are using a scratch vector
  var proteinAttachmentPointScratchVector = new Vector2();

  /**
   *
   * @param {RibosomeAttachmentStateMachine} ribosomeAttachmentStateMachine
   * @constructor
   */
  function RibosomeAttachedState( ribosomeAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.ribosomeAttachmentStateMachine = ribosomeAttachmentStateMachine;
  }

  return inherit( AttachmentState, RibosomeAttachedState, {
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
      proteinAttachmentPointScratchVector = ribosome.getProteinAttachmentPoint( proteinAttachmentPointScratchVector );
      proteinBeingSynthesized.setAttachmentPointPositionXY( proteinAttachmentPointScratchVector.x, proteinAttachmentPointScratchVector.y );

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
      asm.biomolecule.movableByUser = false;
    }


  } );


} );