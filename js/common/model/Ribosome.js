// Copyright 2015, University of Colorado Boulder

/**
 * Class that represents the ribosome in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  //modules
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  var RibosomeAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/RibosomeAttachmentStateMachine' );
  var ShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var WIDTH = 430;                  // In nanometers.
  var OVERALL_HEIGHT = 450;         // In nanometers.
  var TOP_SUBUNIT_HEIGHT_PROPORTION = 0.6;
  var TOP_SUBUNIT_HEIGHT = OVERALL_HEIGHT * TOP_SUBUNIT_HEIGHT_PROPORTION;
  var BOTTOM_SUBUNIT_HEIGHT = OVERALL_HEIGHT * ( 1 - TOP_SUBUNIT_HEIGHT_PROPORTION );

  // Offset from the center position to the entrance of the translation channel. May require some tweaking if the shape
  // changes.
  var OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE = new Vector2( WIDTH / 2, -OVERALL_HEIGHT * 0.23 );

  // Offset from the center position to the point from which the protein emerges. May require some tweaking if the overall
  // shape changes.
  var OFFSET_TO_PROTEIN_OUTPUT_CHANNEL = new Vector2( WIDTH * 0.4, OVERALL_HEIGHT * 0.55 );

  // a counter used to create a unique ID for each instance
  var instanceCounter = 0;

  /**
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function Ribosome( model, position ) {
    this.offsetToTranslationChannelEntrance = OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE; // @public
    position = position || new Vector2( 0, 0 );
    MobileBiomolecule.call( this, model, this.createShape(), new Color( 205, 155, 29 ) );
    this.setPosition( position );

    // @private {MessengerRna} messenger RNA being translated, null if no translation is in progress
    this.messengerRnaBeingTranslated = null; // @private

    // @public (read-only) {String} - unique ID for this instance
    this.id = 'ribosome-' + instanceCounter++;
  }

  geneExpressionEssentials.register( 'Ribosome', Ribosome );

  return inherit( MobileBiomolecule, Ribosome, {

    /**
     * @returns {MessengerRna}
     * @public
     */
    getMessengerRnaBeingTranslated: function() {
      return this.messengerRnaBeingTranslated;
    },

    /**
     * @override
     * Scan for mRNA and propose attachments to any that are found. It is up to the mRNA to accept or refuse based on
     * distance, availability, or whatever.
     *
     * This method is called from the attachment state machine framework.
     * @returns {AttachmentSite}
     * @public
     */
    proposeAttachments: function() {
      var attachmentSite = null;
      var messengerRnaList = this.model.getMessengerRnaList();
      for ( var i = 0; i < messengerRnaList.length; i++ ) {
        var messengerRna = messengerRnaList.get( i );
        attachmentSite = messengerRna.considerProposalFromRibosome( this );
        if ( attachmentSite !== null ) {
          // Proposal accepted.
          this.messengerRnaBeingTranslated = messengerRna;
          break;
        }
      }
      return attachmentSite;
    },

    /**
     * Release the messenger RNA
     * @public
     */
    releaseMessengerRna: function() {
      this.messengerRnaBeingTranslated.releaseFromRibosome( this );
      this.messengerRnaBeingTranslated = null;
    },

    /**
     * @override
     * Overridden in order to hook up unique attachment state machine for this biomolecule.
     * @returns {RibosomeAttachmentStateMachine}
     * @public
     */
    createAttachmentStateMachine: function() {
      return new RibosomeAttachmentStateMachine( this );
    },

    /**
     * @returns {Shape}
     * @private
     */
    createShape: function() {

      // Draw the top portion, which in this sim is the larger subunit. The shape is essentially a lumpy ellipse, and
      // is based on some drawings seen on the web.
      var topSubunitPointList = [
        // Define the shape with a series of points.  Starts at top left.
        new Vector2( -WIDTH * 0.3, TOP_SUBUNIT_HEIGHT * 0.9 ),
        new Vector2( WIDTH * 0.3, TOP_SUBUNIT_HEIGHT ),
        new Vector2( WIDTH * 0.5, 0 ),
        new Vector2( WIDTH * 0.3, -TOP_SUBUNIT_HEIGHT * 0.4 ),
        new Vector2( 0, -TOP_SUBUNIT_HEIGHT * 0.5 ), // Center bottom.
        new Vector2( -WIDTH * 0.3, -TOP_SUBUNIT_HEIGHT * 0.4 ),
        new Vector2( -WIDTH * 0.5, 0 )
      ];

      var translation = Matrix3.translation( 0, OVERALL_HEIGHT / 4 );
      var topSubunitShape = ShapeUtils.createRoundedShapeFromPoints( topSubunitPointList ).transformed( translation );

      // Draw the bottom portion, which in this sim is the smaller subunit.
      var startPointY = topSubunitShape.bounds.minY;
      var bottomSubunitPointList = [
        // Define the shape with a series of points.
        new Vector2( -WIDTH * 0.45, startPointY ),
        new Vector2( 0, startPointY ),
        new Vector2( WIDTH * 0.45, startPointY ),
        new Vector2( WIDTH * 0.45, startPointY - BOTTOM_SUBUNIT_HEIGHT ),
        new Vector2( 0, startPointY - BOTTOM_SUBUNIT_HEIGHT ),
        new Vector2( -WIDTH * 0.45, startPointY - BOTTOM_SUBUNIT_HEIGHT )
      ];

      var bottomSubunitTranslation = Matrix3.translation( 0, -OVERALL_HEIGHT / 4 );
      var ribosomeShape = ShapeUtils.createRoundedShapeFromPoints( bottomSubunitPointList, topSubunitShape ).transformed( bottomSubunitTranslation );

      return ribosomeShape;
    },

    /**
     * @returns {Vector2}
     * @public
     */
    getEntranceOfRnaChannelPos: function() {
      return this.getPosition().plus( OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE );
    },

    /**
     * @returns {number}
     * @public
     */
    getTranslationChannelLength: function() {
      return WIDTH;
    },

    /**
     * Advance the translation of the mRNA.
     * @param {number} amount
     * @returns {boolean} - true if translation is complete, false if not.
     * @public
     */
    advanceMessengerRnaTranslation: function( amount ) {
      return this.messengerRnaBeingTranslated !== null && this.messengerRnaBeingTranslated.advanceTranslation( this, amount );
    },

    /**
     * Get the location in model space of the point at which a protein that is being synthesized by this ribosome should
     * be attached.
     *
     * @param {Vector2} newAttachmentPoint // optional output Vector - Added to avoid creating excessive vector2 instances
     * @returns {Vector2}
     * @public
     */
    getProteinAttachmentPoint: function( newAttachmentPoint ) {
      newAttachmentPoint = newAttachmentPoint || new Vector2();
      newAttachmentPoint.x = this.getPosition().x + OFFSET_TO_PROTEIN_OUTPUT_CHANNEL.x;
      newAttachmentPoint.y = this.getPosition().y + OFFSET_TO_PROTEIN_OUTPUT_CHANNEL.y;
      return newAttachmentPoint;
    },

    /**
     * Initiate translation of Messenger Rna
     * @public
     */
    initiateTranslation: function() {
      if ( this.messengerRnaBeingTranslated !== null ) {
        this.messengerRnaBeingTranslated.initiateTranslation( this );
      }
    }
  } );
} );