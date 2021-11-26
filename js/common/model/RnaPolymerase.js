// Copyright 2015-2021, University of Colorado Boulder

/**
 * Class that represents RNA polymerase in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Color } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import RnaPolymeraseAttachmentStateMachine from './attachment-state-machines/RnaPolymeraseAttachmentStateMachine.js';
import BioShapeUtils from './BioShapeUtils.js';
import MobileBiomolecule from './MobileBiomolecule.js';
import ShapeUtils from './ShapeUtils.js';
import StubGeneExpressionModel from './StubGeneExpressionModel.js';

// Overall size of the polymerase molecule.
const WIDTH = 340;   // picometers
const HEIGHT = 480;  // picometers

// Offset from the center of the molecule to the position where mRNA should emerge when transcription is occurring.
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

class RnaPolymerase extends MobileBiomolecule {

  /**
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   */
  constructor( model, position ) {
    model = model || new StubGeneExpressionModel();
    super( model, RnaPolymerase.createShape(), NOMINAL_COLOR );
    position = position || new Vector2( 0, 0 );
    this.messengerRnaGenerationOffset = MESSENGER_RNA_GENERATION_OFFSET; // @public

    // Copy of the attachment state machine reference from base class, but with the more specific type.
    this.rnaPolymeraseAttachmentStateMachine = this.attachmentStateMachine; // @public
    this.setPosition( position );
  }

  /**
   * @override
   * Overridden to provide attachment behavior that is unique to polymerase.
   * @returns {RnaPolymeraseAttachmentStateMachine}
   * @public
   */
  createAttachmentStateMachine() {
    return new RnaPolymeraseAttachmentStateMachine( this );
  }

  /**
   * @override
   * @param {number} changeFactor
   * @public
   */
  changeConformation( changeFactor ) {

    // seed value chosen empirically through trial and error
    const newUntranslatedShape = BioShapeUtils.createdDistortedRoundedShapeFromPoints( SHAPE_POINTS, changeFactor, 45 );
    this.shapeProperty.set( newUntranslatedShape );
    this.colorProperty.set( Color.interpolateRGBA( NOMINAL_COLOR, CONFORMED_COLOR, changeFactor ) );
  }

  /**
   * @override
   * @returns {AttachmentSite}
   * @public
   */
  proposeAttachments() {

    // propose attachments to the DNA strand
    return this.model.getDnaMolecule().considerProposalFromRnaPolymerase( this );
  }

  /**
   * @override
   * @returns {Vector2}
   * @public
   */
  getDetachDirection() {

    // Randomly either up or down when detaching from DNA.
    return dotRandom.nextBoolean() ? UP_VECTOR : DOWN_VECTOR;
  }

  /**
   * @param {boolean} recycleMode
   * @public
   */
  setRecycleMode( recycleMode ) {
    this.rnaPolymeraseAttachmentStateMachine.setRecycleMode( recycleMode );
  }

  /**
   * @param {Bounds2} recycleReturnZone
   * @public
   */
  addRecycleReturnZone( recycleReturnZone ) {
    this.rnaPolymeraseAttachmentStateMachine.addRecycleReturnZone( recycleReturnZone );
  }

  /**
   * @returns {Shape}
   * @public
   */
  static createShape() {

    // Shape is meant to look like illustrations in "The Machinery of Life" by David Goodsell.
    return ShapeUtils.createRoundedShapeFromPoints( SHAPE_POINTS );
  }
}

geneExpressionEssentials.register( 'RnaPolymerase', RnaPolymerase );

export default RnaPolymerase;
