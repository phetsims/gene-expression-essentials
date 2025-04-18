// Copyright 2015-2025, University of Colorado Boulder

/**
 * Specific instance of protein
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Color from '../../../../scenery/js/util/Color.js';
import Protein from '../../common/model/Protein.js';
import StubGeneExpressionModel from '../../common/model/StubGeneExpressionModel.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants
const BASE_COLOR = new Color( 255, 99, 71 );
const FULL_GROWN_WIDTH = 450;

class ProteinB extends Protein {

  /**
   * @param {GeneExpressionModel} model
   */
  constructor( model ) {
    model = model || new StubGeneExpressionModel();
    super( model, createShape( 0 ), BASE_COLOR );
  }

  /**
   * @override
   * @returns {ProteinB}
   * @public
   */
  createInstance() {
    return new ProteinB( this.model );
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
  const path = new Shape();
  const vector = new Vector2( -currentWidth / 2, 0 );
  path.moveTo( vector.x, vector.y );
  for ( let i = 0; i < 6; i++ ) {
    vector.rotate( Math.PI / 3 );
    path.lineTo( vector.x, vector.y );
  }
  path.close();
  return path;
};

geneExpressionEssentials.register( 'ProteinB', ProteinB );

export default ProteinB;