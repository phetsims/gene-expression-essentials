// Copyright 2015, University of Colorado Boulder
/**
 * One of sub-states for the attached site
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 *
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/MoveDirectlyToDestinationMotionStrategy' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GeneExpressionRnaPolymeraseConstant = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GeneExpressionRnaPolymeraseConstant' );
  var MessengerRna = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MessengerRna' );
  var Property = require( 'AXON/Property' );

  // constants
  var TRANSCRIPTION_VELOCITY = 1000;// In picometers per second.
  var BIO_MOLECULE_POSITION_COMPARISON_EPSILON = 0.000001; // Added by Ashraf  - used for doing comparing the position of Biomolecule and endOfGene's position.

  /**
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @constructor
   */
  function AttachedAndTranscribingState( rnaPolymeraseAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;
    this.endOfGene = null;
    this.messengerRna = null;
  }

  geneExpressionEssentials.register( 'AttachedAndTranscribingState', AttachedAndTranscribingState );

  return inherit( AttachmentState, AttachedAndTranscribingState, {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
        var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var attachedState = this.rnaPolymeraseAttachmentStateMachine.attachedState;
        var attachedAndDeconformingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndDeconformingState;

        // Grow the messenger RNA and position it to be attached to the
        // polymerase.
        this.messengerRna.addLength( TRANSCRIPTION_VELOCITY * dt );
        this.messengerRna.setLowerRightPosition( rnaPolymerase.getPosition().x + GeneExpressionRnaPolymeraseConstant.MESSENGER_RNA_GENERATION_OFFSET.x,
          rnaPolymerase.getPosition().y + GeneExpressionRnaPolymeraseConstant.MESSENGER_RNA_GENERATION_OFFSET.y );

        // Move the DNA strand separator.
        dnaStrandSeparation.setXPos( rnaPolymerase.getPosition().x );

        // Check for molecules that are in the way.
        var molecules = asm.biomolecule.getModel().getOverlappingBiomolecules( asm.biomolecule.getShape() );
        _.forEach( molecules, function( molecule ) {
          if ( molecule.getPosition().x > asm.biomolecule.getPosition().x && molecule.attachedToDna ) {

            // This molecule is blocking transcription, so bump it off
            // of the DNA strand.
            molecule.forceDetach();
          }
        } );

        // If we've reached the end of the gene, detach.
        if ( biomolecule.getPosition().equalsEpsilon( this.endOfGene,BIO_MOLECULE_POSITION_COMPARISON_EPSILON ) ) {
          attachedState = attachedAndDeconformingState;
          this.rnaPolymeraseAttachmentStateMachine.setState( attachedState );
          this.messengerRna.releaseFromPolymerase();
        }
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var transcribingAttachmentSite = this.rnaPolymeraseAttachmentStateMachine.transcribingAttachmentSite;
        var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;

        // Prevent user interaction.
        asm.biomolecule.movableByUser = false;

        // Determine the gene that is being transcribed.
        var geneToTranscribe = biomolecule.getModel().getDnaMolecule().getGeneAtLocation( biomolecule.getPosition() );

        // Set up the motion strategy to move to the end of the transcribed
        // region of the gene.
        this.endOfGene = new Vector2( geneToTranscribe.getEndX(), CommonConstants.DNA_MOLECULE_Y_POS );

        asm.biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy( new Property( this.endOfGene.copy() ),
          biomolecule.motionBoundsProperty, new Vector2( 0, 0 ), TRANSCRIPTION_VELOCITY ) );


        // Create the mRNA that will be grown as a result of this
        // transcription.
        this.messengerRna = new MessengerRna( biomolecule.getModel(), geneToTranscribe.getProteinPrototype(),
          biomolecule.getPosition().plus( GeneExpressionRnaPolymeraseConstant.MESSENGER_RNA_GENERATION_OFFSET ) );
        biomolecule.spawnMessengerRna( this.messengerRna );

        // Free up the initial attachment site by hooking up to a somewhat
        // fictional attachment site instead.
        attachmentSite.attachedOrAttachingMolecule = null;
        transcribingAttachmentSite.attachedOrAttachingMolecule = asm.biomolecule;
        this.rnaPolymeraseAttachmentStateMachine.attachmentSite = transcribingAttachmentSite;
      }

    },

    {

      TRANSCRIPTION_VELOCITY: TRANSCRIPTION_VELOCITY

    } );


} );


