//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Class that represents the a ribosome in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Area = require( 'Area' ); //TODO
  var ShapeUtils = require( 'ShapeUtils' ); //TODO
  var Color = require( 'SCENERY/util/Color' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_BASICS/common/model/MobileBiomolecule' );
  var RibosomeAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/RibosomeAttachmentStateMachine' );

  //constants
  var WIDTH = 430;                  // In nanometers.
  var OVERALL_HEIGHT = 450;         // In nanometers.
  var TOP_SUBUNIT_HEIGHT_PROPORTION = 0.6;
  var TOP_SUBUNIT_HEIGHT = OVERALL_HEIGHT * TOP_SUBUNIT_HEIGHT_PROPORTION;
  var BOTTOM_SUBUNIT_HEIGHT = OVERALL_HEIGHT * ( 1 - TOP_SUBUNIT_HEIGHT_PROPORTION );

  // Offset from the center position to the entrance of the translation
  // channel.  May require some tweaking if the shape changes.
  var OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE = new Vector2( WIDTH / 2, -OVERALL_HEIGHT * 0.20 );

  // Offset from the center position to the point from which the protein
  // emerges.  May require some tweaking if the overall shape changes.
  var OFFSET_TO_PROTEIN_OUTPUT_CHANNEL = new Vector2( WIDTH * 0.4, OVERALL_HEIGHT * 0.55 );


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

  return inherit( MobileBiomolecule, Ribosome,

    {

      /**
       *
       * @returns {MessengerRna}
       */
      getMessengerRnaBeingTranslated: function() {
        return this.messengerRnaBeingTranslated;
      },

      /**
       * Scan for mRNA and propose attachments to any that are found.  It is up
       * to the mRNA to accept or refuse based on distance, availability, or
       * whatever.
       * <p/>
       * This method is called from the attachment state machine framework.
       * @Override
       * @return {AttachmentSite}
       */
      proposeAttachments: function() {
        var attachmentSite = null;
        var messengerRnaList = this.model.getMessengerRnaList();
        _.forEach( messengerRnaList, function( messengerRna ) {
          attachmentSite = messengerRna.considerProposalFrom( this );
          if ( attachmentSite !== null ) {

            // Proposal accepted.
            this.messengerRnaBeingTranslated = messengerRna;
            return false; //break;
          }
        } );
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

        // Draw the top portion, which in this sim is the larger subunit.  The
        // shape is essentially a lumpy ellipse, and is based on some drawings
        // seen on the web.
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
        var bottomSubunitPointList = [
          // Define the shape with a series of points.
          new Vector2( -WIDTH * 0.45, BOTTOM_SUBUNIT_HEIGHT * 0.5 ),
          new Vector2( 0, BOTTOM_SUBUNIT_HEIGHT * 0.45 ),
          new Vector2( WIDTH * 0.45, BOTTOM_SUBUNIT_HEIGHT * 0.5 ),
          new Vector2( WIDTH * 0.45, -BOTTOM_SUBUNIT_HEIGHT * 0.5 ),
          new Vector2( 0, -BOTTOM_SUBUNIT_HEIGHT * 0.45 ),
          new Vector2( -WIDTH * 0.45, -BOTTOM_SUBUNIT_HEIGHT * 0.5 )
        ];

        var bottomSubunitTranslation = Matrix3.getTranslateInstance( 0, -OVERALL_HEIGHT / 4 );
        var bottomSubunitShape = ShapeUtils.createRoundedShapeFromPoints( bottomSubunitPointList ).transformed( bottomSubunitTranslation );

        // Combine the two subunits into one shape.
        var combinedShape = new Area( topSubunitShape );
        combinedShape.add( new Area( bottomSubunitShape ) );
        return combinedShape;
      },

      /**
       *
       * @returns {Vector2}
       */
      getEntranceOfRnaChannelPos: function() {
        return new Vector2( this.getPosition() ).plus( OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE );
      },

      /**
       *
       * @returns {number}
       */
      getTranslationChannelLength: function() {
        return WIDTH;
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
       * Get the location in model space of the point at which a protein that is
       * being synthesized by this ribosome should be attached.
       *
       * @return {Vector2}
       */
      getProteinAttachmentPoint: function() {
        return this.getPosition().plus( OFFSET_TO_PROTEIN_OUTPUT_CHANNEL );
      },

      initiateTranslation: function() {
        if ( this.messengerRnaBeingTranslated !== null ) {
          this.messengerRnaBeingTranslated.initiateTranslation( this );
        }
      }

    },

    {

      OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE: OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE
    }
  );


} );
//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import java.awt.Color;
//import java.awt.Shape;
//import java.awt.geom.AffineTransform;
//import java.awt.geom.Area;
//import java.awt.geom.Point2D;
//import java.util.ArrayList;
//import java.util.List;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.view.util.ShapeUtils;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.AttachmentStateMachine;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.RibosomeAttachmentStateMachine;
//
///**
// * Class that represents the a ribosome in the model.
// *
// * @author John Blanco
// */
//public class Ribosome extends MobileBiomolecule {
//
//    private static final double WIDTH = 430;                  // In nanometers.
//    private static final double OVERALL_HEIGHT = 450;         // In nanometers.
//    private static final double TOP_SUBUNIT_HEIGHT_PROPORTION = 0.6;
//    private static final double TOP_SUBUNIT_HEIGHT = OVERALL_HEIGHT * TOP_SUBUNIT_HEIGHT_PROPORTION;
//    private static final double BOTTOM_SUBUNIT_HEIGHT = OVERALL_HEIGHT * ( 1 - TOP_SUBUNIT_HEIGHT_PROPORTION );
//
//    // Offset from the center position to the entrance of the translation
//    // channel.  May require some tweaking if the shape changes.
//    public static final Vector2D OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE = new Vector2D( WIDTH / 2, -OVERALL_HEIGHT * 0.20 );
//
//    // Offset from the center position to the point from which the protein
//    // emerges.  May require some tweaking if the overall shape changes.
//    private static final Vector2D OFFSET_TO_PROTEIN_OUTPUT_CHANNEL = new Vector2D( WIDTH * 0.4, OVERALL_HEIGHT * 0.55 );
//
//    // Messenger RNA being translated, null if no translation is in progress.
//    private MessengerRna messengerRnaBeingTranslated;
//
//    public Ribosome( GeneExpressionModel model ) {
//        this( model, new Vector2D( 0, 0 ) );
//    }
//
//    public Ribosome( final GeneExpressionModel model, Vector2D position ) {
//        super( model, createShape(), new Color( 205, 155, 29 ) );
//        setPosition( position );
//    }
//
//    public MessengerRna getMessengerRnaBeingTranslated() {
//        return messengerRnaBeingTranslated;
//    }
//
//    /**
//     * Scan for mRNA and propose attachments to any that are found.  It is up
//     * to the mRNA to accept or refuse based on distance, availability, or
//     * whatever.
//     * <p/>
//     * This method is called from the attachment state machine framework.
//     *
//     * @return
//     */
//    @Override public AttachmentSite proposeAttachments() {
//        AttachmentSite attachmentSite = null;
//        List<MessengerRna> messengerRnaList = model.getMessengerRnaList();
//        for ( MessengerRna messengerRna : messengerRnaList ) {
//            attachmentSite = messengerRna.considerProposalFrom( this );
//            if ( attachmentSite != null ) {
//                // Proposal accepted.
//                messengerRnaBeingTranslated = messengerRna;
//                break;
//            }
//        }
//        return attachmentSite;
//    }
//
//    public void releaseMessengerRna() {
//        messengerRnaBeingTranslated.releaseFromRibosome( this );
//        messengerRnaBeingTranslated = null;
//    }
//
//    // Overridden in order to hook up unique attachment state machine for this
//    // biomolecule.
//    @Override protected AttachmentStateMachine createAttachmentStateMachine() {
//        return new RibosomeAttachmentStateMachine( this );
//    }
//
//    private static Shape createShape() {
//        // Draw the top portion, which in this sim is the larger subunit.  The
//        // shape is essentially a lumpy ellipse, and is based on some drawings
//        // seen on the web.
//        List<Point2D> topSubunitPointList = new ArrayList<Point2D>() {{
//            // Define the shape with a series of points.  Starts at top left.
//            add( new Point2D.Double( -WIDTH * 0.3, TOP_SUBUNIT_HEIGHT * 0.9 ) );
//            add( new Point2D.Double( WIDTH * 0.3, TOP_SUBUNIT_HEIGHT ) );
//            add( new Point2D.Double( WIDTH * 0.5, 0 ) );
//            add( new Point2D.Double( WIDTH * 0.3, -TOP_SUBUNIT_HEIGHT * 0.4 ) );
//            add( new Point2D.Double( 0, -TOP_SUBUNIT_HEIGHT * 0.5 ) ); // Center bottom.
//            add( new Point2D.Double( -WIDTH * 0.3, -TOP_SUBUNIT_HEIGHT * 0.4 ) );
//            add( new Point2D.Double( -WIDTH * 0.5, 0 ) );
//        }};
//        Shape topSubunitShape = AffineTransform.getTranslateInstance( 0, OVERALL_HEIGHT / 4 ).createTransformedShape( ShapeUtils.createRoundedShapeFromPoints( topSubunitPointList ) );
//        // Draw the bottom portion, which in this sim is the smaller subunit.
//        List<Point2D> bottomSubunitPointList = new ArrayList<Point2D>() {{
//            // Define the shape with a series of points.
//            add( new Point2D.Double( -WIDTH * 0.45, BOTTOM_SUBUNIT_HEIGHT * 0.5 ) );
//            add( new Point2D.Double( 0, BOTTOM_SUBUNIT_HEIGHT * 0.45 ) );
//            add( new Point2D.Double( WIDTH * 0.45, BOTTOM_SUBUNIT_HEIGHT * 0.5 ) );
//            add( new Point2D.Double( WIDTH * 0.45, -BOTTOM_SUBUNIT_HEIGHT * 0.5 ) );
//            add( new Point2D.Double( 0, -BOTTOM_SUBUNIT_HEIGHT * 0.45 ) );
//            add( new Point2D.Double( -WIDTH * 0.45, -BOTTOM_SUBUNIT_HEIGHT * 0.5 ) );
//        }};
//        Shape bottomSubunitShape = AffineTransform.getTranslateInstance( 0, -OVERALL_HEIGHT / 4 ).createTransformedShape( ShapeUtils.createRoundedShapeFromPoints( bottomSubunitPointList ) );
//        // Combine the two subunits into one shape.
//        Area combinedShape = new Area( topSubunitShape );
//        combinedShape.add( new Area( bottomSubunitShape ) );
//        return combinedShape;
//    }
//
//    public Vector2D getEntranceOfRnaChannelPos() {
//        return new Vector2D( getPosition() ).plus( OFFSET_TO_TRANSLATION_CHANNEL_ENTRANCE );
//    }
//
//    public double getTranslationChannelLength() {
//        return WIDTH;
//    }
//
//    /**
//     * Advance the translation of the mRNA.
//     *
//     * @param amount
//     * @return - true if translation is complete, false if not.
//     */
//    public boolean advanceMessengerRnaTranslation( double amount ) {
//        assert messengerRnaBeingTranslated != null; // Verify expected state.
//        return messengerRnaBeingTranslated != null && messengerRnaBeingTranslated.advanceTranslation( this, amount );
//    }
//
//    /**
//     * Get the location in model space of the point at which a protein that is
//     * being synthesized by this ribosome should be attached.
//     *
//     * @return
//     */
//    public Vector2D getProteinAttachmentPoint() {
//        return getPosition().plus( OFFSET_TO_PROTEIN_OUTPUT_CHANNEL );
//    }
//
//    public void initiateTranslation() {
//        assert messengerRnaBeingTranslated != null;
//        if ( messengerRnaBeingTranslated != null ) {
//            messengerRnaBeingTranslated.initiateTranslation( this );
//        }
//    }
//}
