// Copyright 2015, University of Colorado Boulder
/**
 /**
 * This class defined the attachment state machine for the biomolecules that destroy the messenger RNA molecules.
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
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var MRnaDestroyerAttachedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/MRnaDestroyerAttachedState' );
  var MRnaDestroyerMovingTowardAttachmentState= require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/MRnaDestroyerMovingTowardAttachmentState' );

  /**
   *
   * @param biomolecule {MobileBiomolecule}
   * @constructor
   */
  function RnaDestroyerAttachmentStateMachine( biomolecule ) {
    GenericAttachmentStateMachine.call( this, biomolecule );

    // Set up a local reference of the needed type.
    this.mRnaDestroyer = biomolecule;

    // Set up a non-default "attached" state, since the behavior is
    // different from the default.
    this.attachedState = new MRnaDestroyerAttachedState( this );

    // Set up a non-default "moving toward attachment" state, since the
    // behavior is slightly different from the default.
    this.movingTowardsAttachmentState = new MRnaDestroyerMovingTowardAttachmentState( this );

  }

  geneExpressionEssentials.register( 'RnaDestroyerAttachmentStateMachine', RnaDestroyerAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, RnaDestroyerAttachmentStateMachine, {

    /**
     * @Override
     */
    forceImmediateUnattachedAndAvailable: function() {
      if ( this.mRnaDestroyer.getMessengerRnaBeingDestroyed() !== null ) {

        // Abort a pending attachment to mRNA.
        this.mRnaDestroyer.getMessengerRnaBeingDestroyed().abortDestruction();
        this.mRnaDestroyer.clearMessengerRnaBeingDestroyed();
      }
      GenericAttachmentStateMachine.prototype.forceImmediateUnattachedAndAvailable.call( this );
    }

  } );


} );

