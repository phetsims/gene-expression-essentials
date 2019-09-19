// Copyright 2015-2017, University of Colorado Boulder

/**
 * Attachment state machine for all protein molecules. This class controls how protein molecules behave with respect to
 * attachments.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericAttachmentStateMachine' );
  const inherit = require( 'PHET_CORE/inherit' );
  const StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/StillnessMotionStrategy' );

  //------------------------------------------
  //States for this attachment state machine
  //------------------------------------------
  var ProteinAttachedToRibosomeState = inherit( AttachmentState,

    /**
     * @param {ProteinAttachmentStateMachine} proteinAttachmentStateMachine
     */
    function( proteinAttachmentStateMachine ) {
      this.proteinAttachmentStateMachine = proteinAttachmentStateMachine;
    },
    {
      /**
       * @override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var biomolecule = this.proteinAttachmentStateMachine.biomolecule;
        biomolecule.setMotionStrategy( new StillnessMotionStrategy() );

        // Prevent user interaction while the protein is growing.
        asm.biomolecule.movableByUserProperty.set( false );
      }
    } );

  /**
   * @param biomolecule {MobileBiomolecule}
   * @constructor
   */
  function ProteinAttachmentStateMachine( biomolecule ) {
    GenericAttachmentStateMachine.call( this, biomolecule );
    // Set up a new "attached" state, since the behavior is different from the default.
    this.attachedState = new ProteinAttachedToRibosomeState( this ); //@public
    this.setState( this.attachedState );
  }

  geneExpressionEssentials.register( 'ProteinAttachmentStateMachine', ProteinAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, ProteinAttachmentStateMachine, {} );
} );

