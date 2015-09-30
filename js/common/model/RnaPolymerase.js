//  Copyright 2002-2015, University of Colorado Boulder
/**
 *
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
  var Random = require( 'DOT/Random' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_BASICS/common/model/MobileBiomolecule' );
  var RnaPolymeraseAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/RnaPolymeraseAttachmentStateMachine' );
  var GeneExpressionRnaPolymeraseConstant = require( 'GENE_EXPRESSION_BASICS/common/model/GeneExpressionRnaPolymeraseConstant' );
  var BioShapeUtils = require( 'GENE_EXPRESSION_BASICS/common/model/BioShapeUtils' );
  var ShapeUtils = require( 'GENE_EXPRESSION_BASICS/common/model/ShapeUtils' );


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

  // Added  for per reasons, the Java code creates a new Vector instance every time getDetachDirection is called.
  var UP_VECTOR = new Vector2( 0, 1 );
  var DOWN_VECTOR = new Vector2( 0, -1 );

  /**
   * Default constructor, used mostly when instances are needed in places like control panels.
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function RnaPolymerase( model, position ) {
    model = model || new StubGeneExpressionModel();
    MobileBiomolecule.call( this, model, this.createShape(), NOMINAL_COLOR );
    position = position || new Vector2( 0, 0 );
    // Copy of the attachment state machine reference from base class, but
    // with the more specific type.
    this.rnaPolymeraseAttachmentStateMachine = this.attachmentStateMachine; // defined by Super class - Ashraf
    this.setPosition( position );
  }

  return inherit( MobileBiomolecule, RnaPolymerase, {

    /**
     * Overridden to provide attachment behavior that is unique to polymerase.
     *
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
      this.colorProperty.set( Color.interpolateRGBA( NOMINAL_COLOR, CONFORMED_COLOR, changeFactor ) );
    },

    /**
     *
     * @returns {AttachmentSite}
     */
    proposeAttachments: function() {
      // Propose attachment to the DNA.
      return this.model.getDnaMolecule().considerProposalFromByRnaPolymerase( this );
    },

    /**
     *
     * @returns {Vector2}
     */
    getDetachDirection: function() {
      // Randomly either up or down when detaching from DNA.
      return new Random().nextBoolean() ? UP_VECTOR : DOWN_VECTOR;
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
      // Shape is meant to look like illustrations in "The Machinery of  Life" by David Goodsell.
      return ShapeUtils.createRoundedShapeFromPoints( shapePoints );
    }

  } );
} );

