// Copyright 2015-2017, University of Colorado Boulder

/**
 * Class that represents the small ribosomal subunit in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  var RnaDestroyerAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/RnaDestroyerAttachmentStateMachine' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var WIDTH = 250;   // In nanometers.

  /**
   * helper function
   * @returns {Shape}
   */
  function createShape() {
    var mouthShape = new Shape().moveTo( 0, 0 ).
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
     * @returns {RnaDestroyerAttachmentStateMachine}
     * @public
     */
    createAttachmentStateMachine: function() {
      return new RnaDestroyerAttachmentStateMachine( this );
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
      var attachmentSite = null;
      var messengerRnaList = this.model.getMessengerRnaList();
      for ( var i = 0; i < messengerRnaList.length; i++ ) {
        var messengerRna = messengerRnaList.get( i );
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
      // Since this looks like a circle with a slice out of it, the channel is half of the width.
      return this.bounds.getWidth() / 2;
    },

    /**
     * @public
     */
    initiateMessengerRnaDestruction: function() {
      this.messengerRnaBeingDestroyed.initiateDestruction( this );
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
