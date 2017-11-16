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
  var MRnaDestroyerAttachedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/MRnaDestroyerAttachedState' );
  var UnattachedAndAvailableForMRnaAttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/UnattachedAndAvailableForMRnaAttachmentState' );

  /**
   * @param {MessengerRnaDestroyer} messengerRnaDestroyer
   * @constructor
   */
  function MRnaDestroyerAttachmentStateMachine( messengerRnaDestroyer ) {
    GenericAttachmentStateMachine.call( this, messengerRnaDestroyer );

    // @public {MessengerRnaDestroyer}
    this.mRnaDestroyer = messengerRnaDestroyer;

    // @override - override the unattached state, since attaching to mRNA is a little different versus the default behavior
    this.unattachedAndAvailableState = new UnattachedAndAvailableForMRnaAttachmentState( this );

    // @override - Set up a non-default "attached" state, since the behavior is different from the default.
    this.attachedState = new MRnaDestroyerAttachedState( this );
  }

  geneExpressionEssentials.register( 'MRnaDestroyerAttachmentStateMachine', MRnaDestroyerAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, MRnaDestroyerAttachmentStateMachine, {

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

