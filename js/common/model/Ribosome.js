// Copyright 2015-2021, University of Colorado Boulder

/**
 * Class that represents the ribosome in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


//modules
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Color } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import RibosomeAttachmentStateMachine from './attachment-state-machines/RibosomeAttachmentStateMachine.js';
import MobileBiomolecule from './MobileBiomolecule.js';
import ShapeUtils from './ShapeUtils.js';

// constants
const WIDTH = 430;                  // In nanometers.
const OVERALL_HEIGHT = 450;         // In nanometers.
const TOP_SUBUNIT_HEIGHT_PROPORTION = 0.6;
const TOP_SUBUNIT_HEIGHT = OVERALL_HEIGHT * TOP_SUBUNIT_HEIGHT_PROPORTION;
const BOTTOM_SUBUNIT_HEIGHT = OVERALL_HEIGHT * ( 1 - TOP_SUBUNIT_HEIGHT_PROPORTION );

// Offset from the center position to the entrance of the translation channel. May require some tweaking if the shape
// changes.
const OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE = new Vector2( WIDTH * 0.45, -OVERALL_HEIGHT * 0.23 );

// Offset from the center position to the point from which the protein emerges. May require some tweaking if the overall
// shape changes.
const OFFSET_TO_PROTEIN_OUTPUT_CHANNEL = new Vector2( WIDTH * 0.4, OVERALL_HEIGHT * 0.55 );

// a counter used to create a unique ID for each instance
let instanceCounter = 0;

class Ribosome extends MobileBiomolecule {

  /**
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   */
  constructor( model, position ) {
    super( model, Ribosome.createShape(), new Color( 205, 155, 29 ) );
    this.offsetToTranslationChannelEntrance = OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE; // @public
    position = position || new Vector2( 0, 0 );
    this.setPosition( position );

    // @private {MessengerRna} messenger RNA being translated, null if no translation is in progress
    this.messengerRnaBeingTranslated = null; // @private

    // @public (read-only) {String} - unique ID for this instance
    this.id = `ribosome-${instanceCounter++}`;
  }

  /**
   * @returns {MessengerRna}
   * @public
   */
  getMessengerRnaBeingTranslated() {
    return this.messengerRnaBeingTranslated;
  }

  /**
   * Scan for mRNA and propose attachments to any that are found. It is up to the mRNA to accept or refuse based on
   * distance, availability, or whatever.
   *
   * This method is called from the attachment state machine framework.
   * @override
   * @public
   */
  proposeAttachments() {
    let attachmentSite = null;
    const messengerRnaList = this.model.getMessengerRnaList();
    for ( let i = 0; i < messengerRnaList.length; i++ ) {
      const messengerRna = messengerRnaList.get( i );
      attachmentSite = messengerRna.considerProposalFromRibosome( this );
      if ( attachmentSite !== null ) {

        // Proposal accepted.
        this.messengerRnaBeingTranslated = messengerRna;
        break;
      }
    }
    return attachmentSite;
  }

  /**
   * Release the messenger RNA
   * @public
   */
  releaseMessengerRna() {
    this.messengerRnaBeingTranslated.releaseFromRibosome( this );
    this.messengerRnaBeingTranslated = null;
  }

  /**
   * @override
   * Overridden in order to hook up unique attachment state machine for this biomolecule.
   * @returns {RibosomeAttachmentStateMachine}
   * @public
   */
  createAttachmentStateMachine() {
    return new RibosomeAttachmentStateMachine( this );
  }

  /**
   * @returns {Shape}
   * @private
   */
  static createShape() {

    // Draw the top portion, which in this sim is the larger subunit. The shape is essentially a lumpy ellipse, and
    // is based on some drawings seen on the web.
    const topSubunitPointList = [

      // Define the shape with a series of points.  Starts at top left.
      new Vector2( -WIDTH * 0.3, TOP_SUBUNIT_HEIGHT * 0.9 ),
      new Vector2( WIDTH * 0.3, TOP_SUBUNIT_HEIGHT ),
      new Vector2( WIDTH * 0.5, 0 ),
      new Vector2( WIDTH * 0.3, -TOP_SUBUNIT_HEIGHT * 0.4 ),
      new Vector2( 0, -TOP_SUBUNIT_HEIGHT * 0.5 ), // Center bottom.
      new Vector2( -WIDTH * 0.3, -TOP_SUBUNIT_HEIGHT * 0.4 ),
      new Vector2( -WIDTH * 0.5, 0 )
    ];

    const translation = Matrix3.translation( 0, OVERALL_HEIGHT / 4 );
    const topSubunitShape = ShapeUtils.createRoundedShapeFromPoints( topSubunitPointList ).transformed( translation );

    // Draw the bottom portion, which in this sim is the smaller subunit.
    const startPointY = topSubunitShape.bounds.minY;
    const bottomSubunitPointList = [

      // Define the shape with a series of points.
      new Vector2( -WIDTH * 0.45, startPointY ),
      new Vector2( 0, startPointY ),
      new Vector2( WIDTH * 0.45, startPointY ),
      new Vector2( WIDTH * 0.45, startPointY - BOTTOM_SUBUNIT_HEIGHT ),
      new Vector2( 0, startPointY - BOTTOM_SUBUNIT_HEIGHT ),
      new Vector2( -WIDTH * 0.45, startPointY - BOTTOM_SUBUNIT_HEIGHT )
    ];

    const bottomSubunitTranslation = Matrix3.translation( 0, -OVERALL_HEIGHT / 4 );
    return ShapeUtils.createRoundedShapeFromPoints( bottomSubunitPointList, topSubunitShape ).transformed( bottomSubunitTranslation );
  }

  /**
   * @returns {Vector2}
   * @public
   */
  getEntranceOfRnaChannelPosition() {
    return this.getPosition().plus( OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE );
  }

  /**
   * @returns {number}
   * @public
   */
  getTranslationChannelLength() {
    return WIDTH * 0.95;
  }

  /**
   * Advance the translation of the mRNA.
   * @param {number} amount
   * @returns {boolean} - true if translation is complete, false if not.
   * @public
   */
  advanceMessengerRnaTranslation( amount ) {
    return this.messengerRnaBeingTranslated !== null &&
           this.messengerRnaBeingTranslated.advanceTranslation( this, amount );
  }

  /**
   * Get the position in model space of the point at which a protein that is being synthesized by this ribosome should
   * be attached.
   *
   * @param {Vector2} newAttachmentPoint // optional output Vector - Added to avoid creating excessive vector2 instances
   * @returns {Vector2}
   * @public
   */
  getProteinAttachmentPoint( newAttachmentPoint ) {
    newAttachmentPoint = newAttachmentPoint || new Vector2( 0, 0 );
    newAttachmentPoint.x = this.getPosition().x + OFFSET_TO_PROTEIN_OUTPUT_CHANNEL.x;
    newAttachmentPoint.y = this.getPosition().y + OFFSET_TO_PROTEIN_OUTPUT_CHANNEL.y;
    return newAttachmentPoint;
  }

  /**
   * Initiate translation of Messenger Rna
   * @public
   */
  initiateTranslation() {
    if ( this.messengerRnaBeingTranslated !== null ) {
      this.messengerRnaBeingTranslated.initiateTranslation( this );
    }
  }

  /**
   * returns true if this ribosome is currently translating mRNA, false otherwise
   * @public
   * @returns {boolean}
   */
  isTranslating() {
    return this.attachmentStateMachine.isTranslating();
  }

  /**
   * cancel a translation that was going to happen but something occured to prevent it
   * @public
   */
  cancelTranslation() {

    // make sure we're in a state that supports this operation
    assert && assert( !this.attachmentStateMachine.isTranslating() );

    this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
  }
}

// statics
Ribosome.OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE = OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE;

geneExpressionEssentials.register( 'Ribosome', Ribosome );

export default Ribosome;
