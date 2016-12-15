// Copyright 2015, University of Colorado Boulder
/**
 * Class that represents the ribosome in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var ShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeUtils' );
  var Color = require( 'SCENERY/util/Color' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  var RibosomeAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/RibosomeAttachmentStateMachine' );
  var GeneExpressionRibosomeConstant = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GeneExpressionRibosomeConstant' );


  /**
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function Ribosome( model, position ) {
    position = position || new Vector2( 0, 0 );
    MobileBiomolecule.call( this, model, this.createShape(), new Color( 205, 155, 29 ) );
    this.setPosition( position );

    // Messenger RNA being translated, null if no translation is in progress.
    this.messengerRnaBeingTranslated = null; // private

  }

  geneExpressionEssentials.register( 'Ribosome', Ribosome );

  return inherit( MobileBiomolecule, Ribosome, {
      /**
       * @returns {MessengerRna}
       */
      getMessengerRnaBeingTranslated: function() {
        return this.messengerRnaBeingTranslated;
      },

      /**
       * Scan for mRNA and propose attachments to any that are found. It is up to the mRNA to accept or refuse based on
       * distance, availability, or whatever.
       *
       * This method is called from the attachment state machine framework.
       * @Override
       * @return {AttachmentSite}
       */
      proposeAttachments: function() {
        var attachmentSite = null;
        var messengerRnaList = this.model.getMessengerRnaList();
        for ( var i = 0; i < messengerRnaList.length; i++ ) {
          var messengerRna = messengerRnaList.get( i );
          attachmentSite = messengerRna.considerProposalFromByRibosome( this );
          if ( attachmentSite !== null ) {
            // Proposal accepted.
            this.messengerRnaBeingTranslated = messengerRna;
            break;
          }

        }
        return attachmentSite;
      },

      releaseMessengerRna: function() {
        this.messengerRnaBeingTranslated.releaseFromRibosome( this );
        this.messengerRnaBeingTranslated = null;
      },


      /**
       * Overridden in order to hook up unique attachment state machine for this biomolecule.
       * @returns {RibosomeAttachmentStateMachine}
       */
      createAttachmentStateMachine: function() {
        return new RibosomeAttachmentStateMachine( this );
      },

      /**
       * @private
       * @returns {Shape}
       */
      createShape: function() {

        // Draw the top portion, which in this sim is the larger subunit. The shape is essentially a lumpy ellipse, and
        // is based on some drawings seen on the web.
        var topSubunitPointList = [
          // Define the shape with a series of points.  Starts at top left.
          new Vector2( -GeneExpressionRibosomeConstant.WIDTH * 0.3, GeneExpressionRibosomeConstant.TOP_SUBUNIT_HEIGHT * 0.9 ),
          new Vector2( GeneExpressionRibosomeConstant.WIDTH * 0.3, GeneExpressionRibosomeConstant.TOP_SUBUNIT_HEIGHT ),
          new Vector2( GeneExpressionRibosomeConstant.WIDTH * 0.5, 0 ),
          new Vector2( GeneExpressionRibosomeConstant.WIDTH * 0.3, -GeneExpressionRibosomeConstant.TOP_SUBUNIT_HEIGHT * 0.4 ),
          new Vector2( 0, -GeneExpressionRibosomeConstant.TOP_SUBUNIT_HEIGHT * 0.5 ), // Center bottom.
          new Vector2( -GeneExpressionRibosomeConstant.WIDTH * 0.3, -GeneExpressionRibosomeConstant.TOP_SUBUNIT_HEIGHT * 0.4 ),
          new Vector2( -GeneExpressionRibosomeConstant.WIDTH * 0.5, 0 )
        ];

        var translation = Matrix3.translation( 0, GeneExpressionRibosomeConstant.OVERALL_HEIGHT / 4 );
        var topSubunitShape = ShapeUtils.createRoundedShapeFromPoints( topSubunitPointList ).transformed( translation );

        // Draw the bottom portion, which in this sim is the smaller subunit.
        var startPointY = topSubunitShape.bounds.minY;
        var bottomSubunitPointList = [
          // Define the shape with a series of points.
          new Vector2( -GeneExpressionRibosomeConstant.WIDTH * 0.45, startPointY ),
          new Vector2( 0, startPointY ),
          new Vector2( GeneExpressionRibosomeConstant.WIDTH * 0.45, startPointY ),
          new Vector2( GeneExpressionRibosomeConstant.WIDTH * 0.45, startPointY - GeneExpressionRibosomeConstant.BOTTOM_SUBUNIT_HEIGHT ),
          new Vector2( 0, startPointY - GeneExpressionRibosomeConstant.BOTTOM_SUBUNIT_HEIGHT ),
          new Vector2( -GeneExpressionRibosomeConstant.WIDTH * 0.45, startPointY - GeneExpressionRibosomeConstant.BOTTOM_SUBUNIT_HEIGHT )
        ];

        var bottomSubunitTranslation = Matrix3.translation( 0, -GeneExpressionRibosomeConstant.OVERALL_HEIGHT / 4 );
        var ribosomeShape = ShapeUtils.createRoundedShapeFromPoints( bottomSubunitPointList, topSubunitShape ).transformed( bottomSubunitTranslation );

        return ribosomeShape;
      },

      /**
       *
       * @returns {Vector2}
       */
      getEntranceOfRnaChannelPos: function() {
        return this.getPosition().plus( GeneExpressionRibosomeConstant.OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE );
      },

      /**
       *
       * @returns {number}
       */
      getTranslationChannelLength: function() {
        return GeneExpressionRibosomeConstant.WIDTH;
      },

      /**
       * Advance the translation of the mRNA.
       *
       * @param {number} amount
       * @return {boolean} - true if translation is complete, false if not.
       */
      advanceMessengerRnaTranslation: function( amount ) {
        return this.messengerRnaBeingTranslated !== null && this.messengerRnaBeingTranslated.advanceTranslation( this, amount );
      },

      /**
       * Get the location in model space of the point at which a protein that is being synthesized by this ribosome should
       * be attached.
       *
       * @param {Vector2} newAttachmentPoint // optional output Vector - Added to avoid creating excessive vector2 instances
       * @return {Vector2}
       */
      getProteinAttachmentPoint: function( newAttachmentPoint ) {
        newAttachmentPoint = newAttachmentPoint || new Vector2();
        newAttachmentPoint.x = this.getPosition().x + GeneExpressionRibosomeConstant.OFFSET_TO_PROTEIN_OUTPUT_CHANNEL.x;
        newAttachmentPoint.y = this.getPosition().y + GeneExpressionRibosomeConstant.OFFSET_TO_PROTEIN_OUTPUT_CHANNEL.y;
        return newAttachmentPoint;
      },

      initiateTranslation: function() {
        if ( this.messengerRnaBeingTranslated !== null ) {
          this.messengerRnaBeingTranslated.initiateTranslation( this );
        }
      },

      /**
       *
       * @param {Shape} shape
       * @param {ModelViewTransform2} mvt
       * @returns {*}
       */
      centerShapePart: function( shape, mvt ) {
        var viewShape = mvt.modelToViewShape( shape );
        var shapeBounds = viewShape.bounds;
        var xOffset = shapeBounds.getCenterX();
        var yOffset = shapeBounds.getCenterY();
        var transform = Matrix3.translation( -xOffset, -yOffset );
        return viewShape.transformed( transform );
      }
    }
  );
} );