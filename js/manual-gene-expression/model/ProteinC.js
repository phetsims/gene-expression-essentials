// Copyright 2015-2022, University of Colorado Boulder

/**
 * Specific instance of protein
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import Protein from '../../common/model/Protein.js';
import StubGeneExpressionModel from '../../common/model/StubGeneExpressionModel.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants
const BASE_COLOR = new Color( 57, 255, 20 );
const FULL_GROWN_WIDTH = 320;

class ProteinC extends Protein {

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
   * @returns {ProteinC}
   * @public
   */
  createInstance() {
    return new ProteinC( this.model );
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
   * @param {number} attachmentPointPositionX
   * @param {number} attachmentPointPositionY
   * @private
   */
  setAttachmentPointPositionXY( attachmentPointPositionX, attachmentPointPositionY ) {

    // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
    // changes.
    this.setPosition( new Vector2( attachmentPointPositionX + FULL_GROWN_WIDTH * 0.12 * this.getFullSizeProportion(),
      attachmentPointPositionY + FULL_GROWN_WIDTH * 0.45 * this.getFullSizeProportion() ) );
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

const createShape = growthFactor => {
  const currentWidth = Utils.clamp( growthFactor, 0.01, 1 ) * FULL_GROWN_WIDTH;
  const currentHeight = currentWidth * 1.4;
  const path = new Shape();
  const topAndBottomCurveMultiplier = 0.55;
  const sideCurvesMultiplier = 0.40;

  // Start in the upper left and proceed clockwise in adding segments.
  path.moveTo( -currentWidth * 0.45, currentHeight * 0.45 );
  path.cubicCurveTo( -currentWidth * 0.33, currentHeight * topAndBottomCurveMultiplier, currentWidth * 0.3, currentHeight * topAndBottomCurveMultiplier, currentWidth * 0.45, currentHeight * 0.45 );
  path.cubicCurveTo( currentWidth * sideCurvesMultiplier, currentHeight * 0.33, currentWidth * sideCurvesMultiplier, -currentHeight * 0.33, currentWidth * 0.45, -currentHeight * 0.45 );
  path.cubicCurveTo( currentWidth * 0.33, -currentHeight * topAndBottomCurveMultiplier, -currentWidth * 0.3, -currentHeight * topAndBottomCurveMultiplier, -currentWidth * 0.45, -currentHeight * 0.45 );
  path.cubicCurveTo( -currentWidth * sideCurvesMultiplier, -currentHeight * 0.33, -currentWidth * sideCurvesMultiplier, currentHeight * 0.33, -currentWidth * 0.45, currentHeight * 0.45 );
  return path;
};

geneExpressionEssentials.register( 'ProteinC', ProteinC );

export default ProteinC;