// Copyright 2015, University of Colorado Boulder
/**
 * Attachment state machine for all protein molecules.  This class controls
 * how protein molecules behave with respect to attachments.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/GenericAttachmentStateMachine' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/StillnessMotionStrategy' );

  // private classes
  // Subclass of the "attached" state.
  var ProteinAttachedToRibosomeState = inherit( AttachmentState,

    /**
     * @param {ProteinAttachmentStateMachine} proteinAttachmentStateMachine
     */
    function( proteinAttachmentStateMachine ) {
      this.proteinAttachmentStateMachine = proteinAttachmentStateMachine;
    },

    {

      /**
       * @Override
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


    // Set up a new "attached" state, since the behavior is different from
    // the default.
    this.attachedState = new ProteinAttachedToRibosomeState( this );
    this.setState( this.attachedState );

  }

  geneExpressionEssentials.register( 'ProteinAttachmentStateMachine', ProteinAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, ProteinAttachmentStateMachine, {} );

} );

