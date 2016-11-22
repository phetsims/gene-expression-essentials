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
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );

  // constants
  var CONFORMATIONAL_CHANGE_RATE = 1; // Proportion per second

  /**
   *
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @constructor
   */
  function AttachedAndConformingState( rnaPolymeraseAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;
    this.conformationalChangeAmount = 0;
  }

  geneExpressionEssentials.register( 'AttachedAndConformingState', AttachedAndConformingState );
  return inherit( AttachmentState, AttachedAndConformingState, {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
        var attachedAndTranscribingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndTranscribingState;
        this.conformationalChangeAmount = Math.min( this.conformationalChangeAmount +
                                                    CONFORMATIONAL_CHANGE_RATE * dt, 1 );
        biomolecule.changeConformation( this.conformationalChangeAmount );
        dnaStrandSeparation.setProportionOfTargetAmount( this.conformationalChangeAmount );
        if ( this.conformationalChangeAmount === 1 ) {

          // Conformational change complete, time to start actual transcription.
          this.rnaPolymeraseAttachmentStateMachine.attachedState = attachedAndTranscribingState;
          this.rnaPolymeraseAttachmentStateMachine.setState( attachedAndTranscribingState );
        }
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
        var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;

        // Prevent user interaction.
        asm.biomolecule.movableByUserProperty.set( false );

        // Insert the DNA strand separator.
        dnaStrandSeparation.setXPos( rnaPolymerase.getPosition().x );
        rnaPolymerase.getModel().getDnaMolecule().addSeparation( dnaStrandSeparation );
        this.conformationalChangeAmount = 0;
      }

    },

    {

      CONFORMATIONAL_CHANGE_RATE: CONFORMATIONAL_CHANGE_RATE

    } );

} );


