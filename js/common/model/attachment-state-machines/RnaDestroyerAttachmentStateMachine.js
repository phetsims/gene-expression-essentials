// Copyright 2015-2017, University of Colorado Boulder

/**
 * This class defined the attachment state machine for the biomolecules that destroy the messenger RNA molecules.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericAttachmentStateMachine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovingTowardMRnaAttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/MovingTowardMRnaAttachmentState' );
  var MRnaDestroyerAttachedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/MRnaDestroyerAttachedState' );

  /**
   * @param {MessengerRnaDestroyer} messengerRnaDestroyer
   * @constructor
   */
  function RnaDestroyerAttachmentStateMachine( messengerRnaDestroyer ) {
    GenericAttachmentStateMachine.call( this, messengerRnaDestroyer );

    // @public {MessengerRnaDestroyer}
    this.mRnaDestroyer = messengerRnaDestroyer;

    // Set up a non-default "attached" state, since the behavior is different from the default.
    this.attachedState = new MRnaDestroyerAttachedState( this ); //@public

    // Set up a non-default "moving toward attachment" state, since the behavior is slightly different from the default.
    this.movingTowardsAttachmentState = new MovingTowardMRnaAttachmentState( this ); //@public
  }

  geneExpressionEssentials.register( 'RnaDestroyerAttachmentStateMachine', RnaDestroyerAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, RnaDestroyerAttachmentStateMachine, {

    /**
     * @override
     * @public
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

