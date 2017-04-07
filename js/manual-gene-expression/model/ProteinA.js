// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Protein = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Protein' );
  var Shape = require( 'KITE/Shape' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BASE_COLOR = new Color( 255, 99, 71 );
  var FULL_GROWN_WIDTH = 450;

  function ProteinA( model ) {
    model = model || new StubGeneExpressionModel();
    Protein.call( this, model, this.createInitialShape(), BASE_COLOR );
  }

  geneExpressionEssentials.register( 'ProteinA', ProteinA );

  return inherit( Protein, ProteinA, {

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
     * @returns {ProteinA}
     * @public
     */
    createInstance: function() {
      return new ProteinA( this.model );
    },

    /**
     * @override
     * @param {Vector2} attachmentPointLocation
     * @public
     */
    setAttachmentPointPosition: function( attachmentPointLocation ) {
      // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
      // changes.
      this.setAttachmentPointPositionXY( attachmentPointLocation.x, attachmentPointLocation.y );
    },

    /**
     *
     * @param {number} attachmentPointLocationX
     * @param {number} attachmentPointLocationY
     * @private
     */
    setAttachmentPointPositionXY: function( attachmentPointLocationX, attachmentPointLocationY ) {
      // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
      // changes.
      this.setPosition( new Vector2( attachmentPointLocationX, attachmentPointLocationY +
                                                               ( FULL_GROWN_WIDTH / 2 * this.getFullSizeProportion() ) ) );
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
      var shape = new Shape();
      shape.moveTo( -currentWidth / 2, 0 );
      shape.lineTo( 0, -currentWidth / 2 );
      shape.lineTo( currentWidth / 2, 0 );
      shape.lineTo( 0, currentWidth / 2 );
      shape.lineTo( -currentWidth / 2, 0 );
      shape.close();

      return shape;
    }
  } );
} );