//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Class that represents RNA polymerase in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var RAND = require( 'DOT/Random' );// Random number generator. TODO System.currentTimeMillis() + 2
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_BASICS/common/model/MobileBiomolecule' );
  var RnaPolymeraseAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/RnaPolymeraseAttachmentStateMachine' );
  var GeneExpressionRnaPolymeraseConstant = require( 'GENE_EXPRESSION_BASICS/common/model/GeneExpressionRnaPolymeraseConstant' );
  var BioShapeUtils; //TODO
  var ColorUtils; //TODO
 // var ShapeUtils;// TODO
  var Shape = require( 'KITE/Shape' );




  // Set of points that outline the basic, non-distorted shape of this
  // molecule.  The shape is meant to look like illustrations in "The
  // Machinery of Life" by David Goodsell.
  var shapePoints = [ new Vector2( 0, GeneExpressionRnaPolymeraseConstant.HEIGHT / 2 ), // Middle top.
    new Vector2( GeneExpressionRnaPolymeraseConstant.WIDTH / 2, GeneExpressionRnaPolymeraseConstant.HEIGHT * 0.25 ),
    new Vector2( GeneExpressionRnaPolymeraseConstant.WIDTH * 0.35, -GeneExpressionRnaPolymeraseConstant.HEIGHT * 0.25 ),
    new Vector2( 0, -GeneExpressionRnaPolymeraseConstant.HEIGHT / 2 ), // Middle bottom.
    new Vector2( -GeneExpressionRnaPolymeraseConstant.WIDTH * 0.35, -GeneExpressionRnaPolymeraseConstant.HEIGHT * 0.25 ),
    new Vector2( -GeneExpressionRnaPolymeraseConstant.WIDTH / 2, GeneExpressionRnaPolymeraseConstant.HEIGHT * 0.25 )
  ];

  // Colors used by this molecule.
  var NOMINAL_COLOR = new Color( 0, 153, 210 );
  var CONFORMED_COLOR = Color.CYAN;

  /**
   * Default constructor, used mostly when instances are needed in places like control panels.
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function RnaPolymerase( model, position ) {
    model = model || new StubGeneExpressionModel();
    position = position || new Vector2( 0, 0 );
    MobileBiomolecule.call( this, model, this.createShape(), NOMINAL_COLOR );

    // Copy of the attachment state machine reference from base class, but
    // with the more specific type.
    this.rnaPolymeraseAttachmentStateMachine = this.attachmentStateMachine;
    this.setPosition( position );
  }

  return inherit( MobileBiomolecule, RnaPolymerase, {

    /**
     *  Overridden to provide attachment behavior that is unique to polymerase.
     * @returns {RnaPolymeraseAttachmentStateMachine}
     */
    createAttachmentStateMachine: function() {
      return new RnaPolymeraseAttachmentStateMachine( this );
    },

    /**
     *
     * @param {number} changeFactor
     */
    changeConformation: function( changeFactor ) {
      var newUntranslatedShape = BioShapeUtils.createdDistortedRoundedShapeFromPoints( shapePoints, changeFactor, 259 ); // Seed value chosen by trial and error.
      var translation = Matrix3.translation( this.getPosition().x, this.getPosition().y );
      var newTranslatedShape = newUntranslatedShape.transformed( translation );
      this.shapeProperty.set( newTranslatedShape );
      this.colorProperty.set( ColorUtils.interpolateRBGA( NOMINAL_COLOR, CONFORMED_COLOR, changeFactor ) );
    },

    /**
     *
     * @returns {AttachmentSite}
     */
    proposeAttachments: function() {
      // Propose attachment to the DNA.
      return this.model.getDnaMolecule().considerProposalFrom( this );
    },

    /**
     *
     * @returns {Vector2}
     */
    getDetachDirection: function() {
      // Randomly either up or down when detaching from DNA.
      return RAND.nextBoolean() ? new Vector2( 0, 1 ) : new Vector2( 0, -1 );
    },

    /**
     *
     * @param {boolean} recycleMode
     */
    setRecycleMode: function( recycleMode ) {
      this.rnaPolymeraseAttachmentStateMachine.setRecycleMode( recycleMode );
    },

    /**
     *
     * @param {Rectangle} recycleReturnZone
     */
    addRecycleReturnZone: function( recycleReturnZone ) {
      this.rnaPolymeraseAttachmentStateMachine.addRecycleReturnZone( recycleReturnZone );
    },

    /**
     *
     * @returns {Shape}
     */
    createShape: function() {
      // Shape is meant to look like illustrations in "The Machinery of
      // Life" by David Goodsell.
      //return ShapeUtils.createRoundedShapeFromPoints( shapePoints ); TODO

      return Shape.rectangle( 0, 0, 0, 0 ); //TODO fake shape to avoid  build error
    }

  } );


} );
//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import java.awt.Color;
//import java.awt.Shape;
//import java.awt.geom.AffineTransform;
//import java.awt.geom.Point2D;
//import java.awt.geom.Rectangle2D;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Random;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.view.util.ColorUtils;
//import edu.colorado.phet.common.phetcommon.view.util.ShapeUtils;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.AttachmentStateMachine;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.RnaPolymeraseAttachmentStateMachine;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model.StubGeneExpressionModel;
//
///**
// * Class that represents RNA polymerase in the model.
// *
// * @author John Blanco
// */
//public class RnaPolymerase extends MobileBiomolecule {
//
//    //-------------------------------------------------------------------------
//    // Class Data
//    //-------------------------------------------------------------------------
//
//    // Overall size of the polymerase molecule.
//    private static final double WIDTH = 340;   // picometers
//    private static final double HEIGHT = 480;  // picometers
//
//    // Offset from the center of the molecule to the location where mRNA
//    // should emerge when transcription is occurring.  This is determined
//    // empirically, and may need to change if the shape is changed.
//    public static final Vector2D MESSENGER_RNA_GENERATION_OFFSET = new Vector2D( -WIDTH * 0.4, HEIGHT * 0.4 );
//
//    // Set of points that outline the basic, non-distorted shape of this
//    // molecule.  The shape is meant to look like illustrations in "The
//    // Machinery of Life" by David Goodsell.
//    private static final List<Point2D> shapePoints = new ArrayList<Point2D>() {{
//        add( new Point2D.Double( 0, HEIGHT / 2 ) ); // Middle top.
//        add( new Point2D.Double( WIDTH / 2, HEIGHT * 0.25 ) );
//        add( new Point2D.Double( WIDTH * 0.35, -HEIGHT * 0.25 ) );
//        add( new Point2D.Double( 0, -HEIGHT / 2 ) ); // Middle bottom.
//        add( new Point2D.Double( -WIDTH * 0.35, -HEIGHT * 0.25 ) );
//        add( new Point2D.Double( -WIDTH / 2, HEIGHT * 0.25 ) );
//    }};
//
//    // Colors used by this molecule.
//    private static final Color NOMINAL_COLOR = new Color( 0, 153, 210 );
//    private static final Color CONFORMED_COLOR = Color.CYAN;
//
//    // Random number generator.
//    private static final Random RAND = new Random( System.currentTimeMillis() + 2 );
//
//    //-------------------------------------------------------------------------
//    // Instance Data
//    //-------------------------------------------------------------------------
//
//    // Copy of the attachment state machine reference from base class, but
//    // with the more specific type.
//    private final RnaPolymeraseAttachmentStateMachine rnaPolymeraseAttachmentStateMachine;
//
//    //-------------------------------------------------------------------------
//    // Constructor(s)
//    //-------------------------------------------------------------------------
//
//    /**
//     * Default constructor, used mostly when instances are needed in places like
//     * control panels.
//     */
//    public RnaPolymerase() {
//        this( new StubGeneExpressionModel(), new Vector2D( 0, 0 ) );
//    }
//
//    public RnaPolymerase( GeneExpressionModel model, Vector2D position ) {
//        super( model, createShape(), NOMINAL_COLOR );
//        rnaPolymeraseAttachmentStateMachine = (RnaPolymeraseAttachmentStateMachine) attachmentStateMachine;
//        setPosition( position );
//    }
//
//    //-------------------------------------------------------------------------
//    // Methods
//    //-------------------------------------------------------------------------
//
//    // Overridden to provide attachment behavior that is unique to polymerase.
//    @Override protected AttachmentStateMachine createAttachmentStateMachine() {
//        return new RnaPolymeraseAttachmentStateMachine( this );
//    }
//
//    @Override public void changeConformation( double changeFactor ) {
//        Shape newUntranslatedShape = BioShapeUtils.createdDistortedRoundedShapeFromPoints( shapePoints, changeFactor, 259 ); // Seed value chosen by trial and error.
//        Shape newTranslatedShape = AffineTransform.getTranslateInstance( getPosition().getX(), getPosition().getY() ).createTransformedShape( newUntranslatedShape );
//        shapeProperty.set( newTranslatedShape );
//        colorProperty.set( ColorUtils.interpolateRBGA( NOMINAL_COLOR, CONFORMED_COLOR, changeFactor ) );
//    }
//
//    @Override public AttachmentSite proposeAttachments() {
//        // Propose attachment to the DNA.
//        return model.getDnaMolecule().considerProposalFrom( this );
//    }
//
//    @Override public Vector2D getDetachDirection() {
//        // Randomly either up or down when detaching from DNA.
//        return RAND.nextBoolean() ? new Vector2D( 0, 1 ) : new Vector2D( 0, -1 );
//    }
//
//    public void setRecycleMode( boolean recycleMode ) {
//        rnaPolymeraseAttachmentStateMachine.setRecycleMode( recycleMode );
//    }
//
//    public void addRecycleReturnZone( Rectangle2D recycleReturnZone ) {
//        rnaPolymeraseAttachmentStateMachine.addRecycleReturnZone( recycleReturnZone );
//    }
//
//    private static Shape createShape() {
//        // Shape is meant to look like illustrations in "The Machinery of
//        // Life" by David Goodsell.
//        return ShapeUtils.createRoundedShapeFromPoints( shapePoints );
//    }
//}
