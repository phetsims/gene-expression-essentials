// Copyright 2015-2022, University of Colorado Boulder

/**
 * Class that represents the small ribosomal subunit in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import MRnaDestroyerAttachmentStateMachine from './attachment-state-machines/MRnaDestroyerAttachmentStateMachine.js';
import MobileBiomolecule from './MobileBiomolecule.js';

// constants
const WIDTH = 250;   // In nanometers.

/**
 * helper function
 * @returns {Shape}
 */
function createShape() {
  const mouthShape = new Shape().moveTo( 0, 0 ).arc( 0, 0, WIDTH / 2, Math.PI / 6, 2 * Math.PI - Math.PI / 6 ).close();
  return mouthShape;
}

class MessengerRnaDestroyer extends MobileBiomolecule {

  /**
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   */
  constructor( model, position ) {
    position = position || new Vector2( 0, 0 );
    super( model, createShape(), new Color( 255, 150, 66 ) );
    this.setPosition( position );

    // Reference to the messenger RNA being destroyed.
    this.messengerRnaBeingDestroyed = null; // @private
  }

  /**
   * @override
   * @returns {MRnaDestroyerAttachmentStateMachine}
   * @public
   */
  createAttachmentStateMachine() {
    return new MRnaDestroyerAttachmentStateMachine( this );
  }

  /**
   * @param {number} amountToDestroy
   * @returns {boolean}
   * @public
   */
  advanceMessengerRnaDestruction( amountToDestroy ) {
    return this.messengerRnaBeingDestroyed.advanceDestruction( amountToDestroy );
  }

  /**
   * @override
   * Scan for mRNA and propose attachments to any that are found. It is up to the mRNA to accept or refuse based on
   * distance, availability, or whatever.
   * This method is called by the attachment state machine framework.
   * @returns {AttachmentSite}
   * @public
   */
  proposeAttachments() {
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
  }

  /**
   * @returns {number}
   * @public
   */
  getDestructionChannelLength() {

    // since this looks like a circle with a slice out of it, the channel is half of the width
    return this.bounds.getWidth() / 2;
  }

  /**
   * @public
   */
  initiateMessengerRnaDestruction() {
    this.messengerRnaBeingDestroyed.initiateDestruction( this );
  }

  /**
   * If destruction was planned but not yet initiated, it can be canceled using this method.  This can happen when
   * the mRNA and the destroyer are moving towards one another and one of them is grabbed before the actual
   * destruction process starts.
   * @public
   */
  cancelMessengerRnaDestruction() {
    this.messengerRnaBeingDestroyed = null;
    this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
  }

  /**
   * @returns {MessengerRna}
   * @public
   */
  getMessengerRnaBeingDestroyed() {
    return this.messengerRnaBeingDestroyed;
  }

  /**
   * @public
   */
  clearMessengerRnaBeingDestroyed() {
    this.messengerRnaBeingDestroyed = null;
  }
}

geneExpressionEssentials.register( 'MessengerRnaDestroyer', MessengerRnaDestroyer );

export default MessengerRnaDestroyer;