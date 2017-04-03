// Copyright 2015, University of Colorado Boulder

/**
 * One of sub-states for the attached site
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var BeingRecycledState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/BeingRecycledState' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @constructor
   */
  function AttachedAndDeconformingState( rnaPolymeraseAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine; // @public
    this.conformationalChangeAmount = 0; // @public
  }

  geneExpressionEssentials.register( 'AttachedAndDeconformingState', AttachedAndDeconformingState );

  return inherit( AttachmentState, AttachedAndDeconformingState, {

    /**
     * @param  {AttachmentStateMachine} asm
     * @param {number} dt
     */
    stepInTime: function( asm, dt ) {
      var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;

      // Verify that state is consistent.
      assert && assert( asm.attachmentSite !== null );
      assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === biomolecule );

      var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
      var rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
      var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;
      var recycleMode = this.rnaPolymeraseAttachmentStateMachine.recycleMode;
      var recycleReturnZones = this.rnaPolymeraseAttachmentStateMachine.recycleReturnZones;
      var attachedAndWanderingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndWanderingState;

      this.conformationalChangeAmount = Math.max(
        this.conformationalChangeAmount - GEEConstants.CONFORMATIONAL_CHANGE_RATE * dt,
        0
      );
      biomolecule.changeConformation( this.conformationalChangeAmount );
      dnaStrandSeparation.setProportionOfTargetAmount( this.conformationalChangeAmount );
      if ( this.conformationalChangeAmount === 0 ) {

        // Remove the DNA separator, which makes the DNA close back up.
        rnaPolymerase.getModel().getDnaMolecule().removeSeparation( dnaStrandSeparation );

        // Update externally visible state indication.
        asm.biomolecule.attachedToDnaProperty.set( false );

        // Make sure that we enter the correct initial state upon the next attachment.
        this.rnaPolymeraseAttachmentStateMachine.attachedState = attachedAndWanderingState;

        // Detach from the DNA.
        attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
        attachmentSite = null;
        this.rnaPolymeraseAttachmentStateMachine.attachmentSite = attachmentSite;
        if ( recycleMode ) {
          this.rnaPolymeraseAttachmentStateMachine.setState(
            new BeingRecycledState( this.rnaPolymeraseAttachmentStateMachine, recycleReturnZones ) );
        }
        else {
          this.rnaPolymeraseAttachmentStateMachine.forceImmediateUnattachedButUnavailable();
        }
      }
    },

    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {

      // Prevent user interaction.
      asm.biomolecule.movableByUserProperty.set( false );
      this.conformationalChangeAmount = 1;
    }
  } );
} );