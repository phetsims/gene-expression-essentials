// Copyright 2015, University of Colorado Boulder

/**
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Protein = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Protein' );
  var Shape = require( 'KITE/Shape' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BASE_COLOR = new Color( 57, 255, 20 );
  var FULL_GROWN_WIDTH = 320;

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
     * @public
     */
    getUntranslatedShape: function( growthFactor ) {
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
     * @param {Vector2} attachmentPointLocation
     */
    setAttachmentPointPosition: function( attachmentPointLocation ) {
      // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
      // changes.
      this.setAttachmentPointPositionXY( attachmentPointLocation.x, attachmentPointLocation.y );
    },

    /**
     * @param {number} attachmentPointLocationX
     * @param {number} attachmentPointLocationY
     * @private
     */
    setAttachmentPointPositionXY: function( attachmentPointLocationX, attachmentPointLocationY ) {
      // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
      // changes.
      this.setPosition( new Vector2( attachmentPointLocationX + FULL_GROWN_WIDTH * 0.12 * this.getFullSizeProportion(),
        attachmentPointLocationY + FULL_GROWN_WIDTH * 0.45 * this.getFullSizeProportion() ) );
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
      var currentWidth = Util.clamp( growthFactor, 0.01, 1 ) * FULL_GROWN_WIDTH;
      var currentHeight = currentWidth * 1.4;
      var path = new Shape();
      var topAndBottomCurveMultiplier = 0.55;
      var sideCurvesMultiplier = 0.40;
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