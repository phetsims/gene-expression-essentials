// Copyright 2017, University of Colorado Boulder

/**
 * One of the states used in RibosomeAttachmentStateMachine and MRnaDestroyerAttachmentStateMachine. This state
 * descends from the GenericMovingTowardsAttachment state, but it does a few things differently.  This state is only
 * used for attachments that are formed with messenger RNA (mRNA).
 *
 * For more information about why these behaviors are needed, please see:
 * It is set up like this due to https://github.com/phetsims/gene-expression-essentials/issues/24
 * It is set up like this due to https://github.com/phetsims/gene-expression-essentials/issues/91
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericMovingTowardsAttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericMovingTowardsAttachmentState' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @param  {AttachmentStateMachine} attachmentStateMachine
   */
  function MovingTowardMRnaAttachmentState( attachmentStateMachine ) {
    GenericMovingTowardsAttachmentState.call( this, attachmentStateMachine );
    this.attachmentStateMachine = attachmentStateMachine; //@public
  }

  geneExpressionEssentials.register( 'MovingTowardMRnaAttachmentState', MovingTowardMRnaAttachmentState );

  return inherit( GenericMovingTowardsAttachmentState, MovingTowardMRnaAttachmentState, {

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     * @public
     */
    step: function( enclosingStateMachine, dt ) {
      var gsm = enclosingStateMachine;

      // verify that state is consistent
      assert && assert( gsm.attachmentSite !== null );
      assert && assert(
        gsm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === this.genericAttachmentStateMachine.biomolecule
      );

      // If the messenger RNA is being synthesized, connect to it immediately, otherwise it can easily move away before
      // the attachment site can be reached.
      if ( gsm.attachmentSite.owner.beingSynthesizedProperty.get() ){
        gsm.setState( gsm.attachedState );
      }
      else{
        GenericMovingTowardsAttachmentState.prototype.step.call( this, enclosingStateMachine, dt );
      }
    }
  } );
} );