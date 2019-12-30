// Copyright 2015-2019, University of Colorado Boulder

/**
 * Specific instance of protein
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Protein = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Protein' );
  const Shape = require( 'KITE/Shape' );
  const StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BASE_COLOR = new Color( 57, 255, 20 );
  const FULL_GROWN_WIDTH = 320;

  /**
   * @param {GeneExpressionModel} model
   * @constructor
   */
  function ProteinC( model ) {
    model = model || new StubGeneExpressionModel();
    Protein.call( this, model, this.createInitialShape(), BASE_COLOR );
  }

  geneExpressionEssentials.register( 'ProteinC', ProteinC );

  return inherit( Protein, ProteinC, {

    /**
     * @override
     * @param {number} growthFactor
     * @returns {Shape}
     * @protected
     */
    getScaledShape: function( growthFactor ) {
      return this.createShape( growthFactor );
    },

    /**
     * @override
     * @returns {ProteinC}
     * @public
     */
    createInstance: function() {
      return new ProteinC( this.model );
    },

    /**
     * @override
     * @param {Vector2} attachmentPointPosition
     */
    setAttachmentPointPosition: function( attachmentPointPosition ) {
      // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
      // changes.
      this.setAttachmentPointPositionXY( attachmentPointPosition.x, attachmentPointPosition.y );
    },

    /**
     * @param {number} attachmentPointPositionX
     * @param {number} attachmentPointPositionY
     * @private
     */
    setAttachmentPointPositionXY: function( attachmentPointPositionX, attachmentPointPositionY ) {
      // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
      // changes.
      this.setPosition( new Vector2( attachmentPointPositionX + FULL_GROWN_WIDTH * 0.12 * this.getFullSizeProportion(),
        attachmentPointPositionY + FULL_GROWN_WIDTH * 0.45 * this.getFullSizeProportion() ) );
    },

    /**
     * @returns {Shape}
     * @private
     */
    createInitialShape: function() {
      return this.createShape( 0 );
    },

    /**
     * @param {number} growthFactor
     * @returns {Shape}
     * @private
     */
    createShape: function( growthFactor ) {
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
    }
  } );
} );