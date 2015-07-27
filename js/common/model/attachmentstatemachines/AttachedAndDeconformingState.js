//  Copyright 2002-2014, University of Colorado Boulder
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
   var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var BeingRecycledState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/BeingRecycledState' );


  // constants
  var CONFORMATIONAL_CHANGE_RATE = 1;// Proportion per second.
  /**
   *
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @constructor
   */
  function AttachedAndDeconformingState(rnaPolymeraseAttachmentStateMachine) {
    AttachmentState.call( this );
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;
    this.conformationalChangeAmount = 0;
  }


  return inherit( AttachmentState, AttachedAndDeconformingState,{
    /**
     * @param  {AttachmentStateMachine} asm
     * @param {number} dt
     */

    stepInTime: function( asm, dt ) {
      var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
      var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
      var rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
      var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;
      var recycleMode = this.rnaPolymeraseAttachmentStateMachine.recycleMode;
      var recycleReturnZones = this.rnaPolymeraseAttachmentStateMachine.recycleReturnZones;
      var attachedAndWanderingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndWanderingState;
      this.conformationalChangeAmount = Math.max( this.conformationalChangeAmount -
                                                  CONFORMATIONAL_CHANGE_RATE * dt, 0 );
      biomolecule.changeConformation( this.conformationalChangeAmount );
      dnaStrandSeparation.setProportionOfTargetAmount( this.conformationalChangeAmount );
      if ( this.conformationalChangeAmount === 0 ) {

        // Remove the DNA separator, which makes the DNA close back up.
        rnaPolymerase.getModel().getDnaMolecule().removeSeparation( dnaStrandSeparation );

        // Update externally visible state indication.
        asm.biomolecule.attachedToDna = false;

        // Make sure that we enter the correct initial state upon the
        // next attachment.
        this.rnaPolymeraseAttachmentStateMachine.attachedState = attachedAndWanderingState;

        // Detach from the DNA.
        attachmentSite.attachedOrAttachingMolecule = null;
        attachmentSite = null;
        if ( recycleMode ) {
          this.rnaPolymeraseAttachmentStateMachine.setState(
            new BeingRecycledState( this.rnaPolymeraseAttachmentStateMachine, recycleReturnZones ) );
        }
        else {
          this.rnaPolymeraseAttachmentStateMachine.prototype.forceImmediateUnattachedButUnavailable.call( this );
        }
      }
    },

    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {

      // Prevent user interaction.
      asm.biomolecule.movableByUser =  false;
      this.conformationalChangeAmount = 1;
    }

  },

  {

    CONFORMATIONAL_CHANGE_RATE:CONFORMATIONAL_CHANGE_RATE

  }
  );

} );