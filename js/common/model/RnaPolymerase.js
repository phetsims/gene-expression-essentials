// Copyright 2015-2019, University of Colorado Boulder

/**
 * Class that represents RNA polymerase in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const BioShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BioShapeUtils' );
  const Color = require( 'SCENERY/util/Color' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  const RnaPolymeraseAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/RnaPolymeraseAttachmentStateMachine' );
  const ShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeUtils' );
  const StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  const Vector2 = require( 'DOT/Vector2' );

  // Overall size of the polymerase molecule.
  const WIDTH = 340;   // picometers
  const HEIGHT = 480;  // picometers

  // Offset from the center of the molecule to the location where mRNA should emerge when transcription is occurring.
  // This is determined empirically, and may need to change if the shape is changed.
  const MESSENGER_RNA_GENERATION_OFFSET = new Vector2( -WIDTH * 0.4, HEIGHT * 0.4 );

  // Set of points that outline the basic, non-distorted shape of this molecule. The shape is meant to look like
  // illustrations in "The Machinery of Life" by David Goodsell.
  const SHAPE_POINTS = [ new Vector2( 0, HEIGHT / 2 ), // Middle top.
    new Vector2( WIDTH / 2, HEIGHT * 0.25 ),
    new Vector2( WIDTH * 0.35, -HEIGHT * 0.25 ),
    new Vector2( 0, -HEIGHT / 2 ), // Middle bottom.
    new Vector2( -WIDTH * 0.35, -HEIGHT * 0.25 ),
    new Vector2( -WIDTH / 2, HEIGHT * 0.25 )
  ];

  // Colors used by this molecule.
  const NOMINAL_COLOR = new Color( 0, 153, 210 );
  const CONFORMED_COLOR = Color.CYAN;

  // Direction vectors when polymerase detaches from DNA
  const UP_VECTOR = new Vector2( 0, 1 );
  const DOWN_VECTOR = new Vector2( 0, -1 );

  /**
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function RnaPolymerase( model, position ) {
    model = model || new StubGeneExpressionModel();
    MobileBiomolecule.call( this, model, this.createShape(), NOMINAL_COLOR );
    position = position || new Vector2( 0, 0 );
    this.messengerRnaGenerationOffset = MESSENGER_RNA_GENERATION_OFFSET; // @public

    // Copy of the attachment state machine reference from base class, but with the more specific type.
    this.rnaPolymeraseAttachmentStateMachine = this.attachmentStateMachine; // @public
    this.setPosition( position );
  }

  geneExpressionEssentials.register( 'RnaPolymerase', RnaPolymerase );

  return inherit( MobileBiomolecule, RnaPolymerase, {

    /**
     * @override
     * Overridden to provide attachment behavior that is unique to polymerase.
     * @returns {RnaPolymeraseAttachmentStateMachine}
     * @public
     */
    createAttachmentStateMachine: function() {
      return new RnaPolymeraseAttachmentStateMachine( this );
    },

    /**
     * @override
     * @param {number} changeFactor
     * @public
     */
    changeConformation: function( changeFactor ) {

      // seed value chosen empirically through trial and error
      const newUntranslatedShape = BioShapeUtils.createdDistortedRoundedShapeFromPoints( SHAPE_POINTS, changeFactor, 45 );
      this.shapeProperty.set( newUntranslatedShape );
      this.colorProperty.set( Color.interpolateRGBA( NOMINAL_COLOR, CONFORMED_COLOR, changeFactor ) );
    },

    /**
     * @override
     * @returns {AttachmentSite}
     * @public
     */
    proposeAttachments: function() {

      // propose attachments to the DNA strand
      return this.model.getDnaMolecule().considerProposalFromRnaPolymerase( this );
    },

    /**
     * @override
     * @returns {Vector2}
     */
    getDetachDirection: function() {

      // Randomly either up or down when detaching from DNA.
      return phet.joist.random.nextBoolean() ? UP_VECTOR : DOWN_VECTOR;
    },

    /**
     * @param {boolean} recycleMode
     * @public
     */
    setRecycleMode: function( recycleMode ) {
      this.rnaPolymeraseAttachmentStateMachine.setRecycleMode( recycleMode );
    },

    /**
     * @param {Bounds2} recycleReturnZone
     * @public
     */
    addRecycleReturnZone: function( recycleReturnZone ) {
      this.rnaPolymeraseAttachmentStateMachine.addRecycleReturnZone( recycleReturnZone );
    },

    /**
     * @returns {Shape}
     * @public
     */
    createShape: function() {
      // Shape is meant to look like illustrations in "The Machinery of Life" by David Goodsell.
      return ShapeUtils.createRoundedShapeFromPoints( SHAPE_POINTS );
    }
  } );
} );

