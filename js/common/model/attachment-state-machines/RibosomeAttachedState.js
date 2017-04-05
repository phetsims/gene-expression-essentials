// Copyright 2015, University of Colorado Boulder

/**
 * One of the state of the RibosomeAttachmentStateMachine. It defined what the ribosome does when attached to mRNA,
 * which is essentially to transcribe it.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RibosomeTranslatingRnaMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/RibosomeTranslatingRnaMotionStrategy' );
  var Vector2 = require( 'DOT/Vector2' );

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
    this.ribosomeAttachmentStateMachine = ribosomeAttachmentStateMachine; //@public
  }

  geneExpressionEssentials.register( 'RibosomeAttachedState', RibosomeAttachedState );

  return inherit( AttachmentState, RibosomeAttachedState, {
    /**
     * @override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt
     * @public
     */
    stepInTime: function( asm, dt ) {

      var proteinBeingSynthesized = this.ribosomeAttachmentStateMachine.proteinBeingSynthesized;
      var ribosome = this.ribosomeAttachmentStateMachine.ribosome;

      // verify that state is consistent
      assert && assert( asm.attachmentSite !== null );
      assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === ribosome );

      // Grow the protein.
      proteinBeingSynthesized.setFullSizeProportion(
        ribosome.getMessengerRnaBeingTranslated().getProportionOfRnaTranslated( ribosome ) );
      proteinAttachmentPointScratchVector = ribosome.getProteinAttachmentPoint( proteinAttachmentPointScratchVector );
      proteinBeingSynthesized.setAttachmentPointPositionXY(
        proteinAttachmentPointScratchVector.x,
        proteinAttachmentPointScratchVector.y );

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
     * @override
     * @param {AttachmentStateMachine} asm
     * @public
     */
    entered: function( asm ) {
      var ribosome = this.ribosomeAttachmentStateMachine.ribosome;
      //var proteinBeingSynthesized = this.ribosomeAttachmentStateMachine.proteinBeingSynthesized;
      ribosome.initiateTranslation();
      ribosome.setMotionStrategy( new RibosomeTranslatingRnaMotionStrategy( ribosome ) );
      var proteinBeingSynthesized = ribosome.getMessengerRnaBeingTranslated().getProteinPrototype().createInstance();
      this.ribosomeAttachmentStateMachine.proteinBeingSynthesized = proteinBeingSynthesized;
      proteinBeingSynthesized.setAttachmentPointPosition( ribosome.getProteinAttachmentPoint() );
      ribosome.getModel().addMobileBiomolecule( proteinBeingSynthesized );

      // Prevent user interaction while translating.
      asm.biomolecule.movableByUserProperty.set( false );
    }
  } );
} );