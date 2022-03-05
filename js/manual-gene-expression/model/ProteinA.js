// Copyright 2015-2022, University of Colorado Boulder

/**
 * Specific instance of protein
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


//modules
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import Protein from '../../common/model/Protein.js';
import StubGeneExpressionModel from '../../common/model/StubGeneExpressionModel.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants
const BASE_COLOR = new Color( 255, 99, 71 );
const FULL_GROWN_WIDTH = 450;

class ProteinA extends Protein {

  /**
   * @param {GeneExpressionModel} model
   */
  constructor( model ) {
    model = model || new StubGeneExpressionModel();
    super( model, createShape( 0 ), BASE_COLOR );
  }

  /**
   * @override
   * @param {number} growthFactor
   * @returns {Shape}
   * @protected
   */
  getScaledShape( growthFactor ) {
    return this.createShape( growthFactor );
  }

  /**
   * @override
   * @returns {ProteinA}
   * @public
   */
  createInstance() {
    return new ProteinA( this.model );
  }

  /**
   * @override
   * @param {Vector2} attachmentPointPosition
   * @public
   */
  setAttachmentPointPosition( attachmentPointPosition ) {

    // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
    // changes.
    this.setAttachmentPointPositionXY( attachmentPointPosition.x, attachmentPointPosition.y );
  }

  /**
   *
   * @param {number} attachmentPointPositionX
   * @param {number} attachmentPointPositionY
   * @private
   */
  setAttachmentPointPositionXY( attachmentPointPositionX, attachmentPointPositionY ) {

    // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
    // changes.
    this.setPosition( new Vector2( attachmentPointPositionX, attachmentPointPositionY +
                                                             ( FULL_GROWN_WIDTH / 2 * this.getFullSizeProportion() ) ) );
  }

  /**
   * @param {number} growthFactor
   * @returns {Shape}
   * @private
   */
  createShape( growthFactor ) {
    return createShape( growthFactor );
  }
}

// function to create the shape
const createShape = growthFactor => {
  const currentWidth = Utils.clamp( growthFactor, 0.01, 1 ) * FULL_GROWN_WIDTH;
  const shape = new Shape();
  shape.moveTo( -currentWidth / 2, 0 );
  shape.lineTo( 0, -currentWidth / 2 );
  shape.lineTo( currentWidth / 2, 0 );
  shape.lineTo( 0, currentWidth / 2 );
  shape.lineTo( -currentWidth / 2, 0 );
  shape.close();

  return shape;
};

geneExpressionEssentials.register( 'ProteinA', ProteinA );

export default ProteinA;