// Copyright 2015-2017, University of Colorado Boulder

/**
 * Class that represents the small ribosomal subunit in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  const MRnaDestroyerAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/MRnaDestroyerAttachmentStateMachine' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const WIDTH = 250;   // In nanometers.

  /**
   * helper function
   * @returns {Shape}
   */
  function createShape() {
    const mouthShape = new Shape().moveTo( 0, 0 ).
    arc( 0, 0, WIDTH / 2, Math.PI / 6, 2 * Math.PI - Math.PI / 6 ).
    close();
    return mouthShape;
  }

  /**
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function MessengerRnaDestroyer( model, position ) {
    position = position || new Vector2( 0, 0 );
    MobileBiomolecule.call( this, model, createShape(), new Color( 255, 150, 66 ) );
    this.setPosition( position );

    // Reference to the messenger RNA being destroyed.
    this.messengerRnaBeingDestroyed = null; // @private
  }

  geneExpressionEssentials.register( 'MessengerRnaDestroyer', MessengerRnaDestroyer );

  return inherit( MobileBiomolecule, MessengerRnaDestroyer, {

    /**
     * @override
     * @returns {MRnaDestroyerAttachmentStateMachine}
     * @public
     */
    createAttachmentStateMachine: function() {
      return new MRnaDestroyerAttachmentStateMachine( this );
    },

    /**
     * @param {number} amountToDestroy
     * @returns {boolean}
     * @public
     */
    advanceMessengerRnaDestruction: function( amountToDestroy ) {
      return this.messengerRnaBeingDestroyed.advanceDestruction( amountToDestroy );
    },

    /**
     * @override
     * Scan for mRNA and propose attachments to any that are found. It is up to the mRNA to accept or refuse based on
     * distance, availability, or whatever.
     * This method is called by the attachment state machine framework.
     * @returns {AttachmentSite}
     * @public
     */
    proposeAttachments: function() {
      let attachmentSite = null;
      const messengerRnaList = this.model.getMessengerRnaList();
      for ( let i = 0; i < messengerRnaList.length; i++ ) {
        const messengerRna = messengerRnaList.get( i );
        attachmentSite = messengerRna.considerProposalFromMessengerRnaDestroyer( this );
        if ( attachmentSite !== null ) {
          // Proposal accepted.
          this.messengerRnaBeingDestroyed = messengerRna;
          break;
        }
      }
      return attachmentSite;
    },

    /**
     * @returns {number}
     * @public
     */
    getDestructionChannelLength: function() {

      // since this looks like a circle with a slice out of it, the channel is half of the width
      return this.bounds.getWidth() / 2;
    },

    /**
     * @public
     */
    initiateMessengerRnaDestruction: function() {
      this.messengerRnaBeingDestroyed.initiateDestruction( this );
    },

    /**
     * If destruction was planned but not yet initiated, it can be canceled using this method.  This can happen when
     * the mRNA and the destroyer are moving towards one another and one of them is grabbed before the actual
     * destruction process starts.
     * @public
     */
    cancelMessengerRnaDestruction: function() {
      this.messengerRnaBeingDestroyed = null;
      this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
    },

    /**
     * @returns {MessengerRna}
     * @public
     */
    getMessengerRnaBeingDestroyed: function() {
      return this.messengerRnaBeingDestroyed;
    },

    /**
     * @public
     */
    clearMessengerRnaBeingDestroyed: function() {
      this.messengerRnaBeingDestroyed = null;
    }
  } );
} );
