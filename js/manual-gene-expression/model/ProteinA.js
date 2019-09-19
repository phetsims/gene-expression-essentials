// Copyright 2015-2017, University of Colorado Boulder

/**
 * Specific instance of protein
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  //modules
  const Color = require( 'SCENERY/util/Color' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Protein = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Protein' );
  const Shape = require( 'KITE/Shape' );
  const StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  var BASE_COLOR = new Color( 255, 99, 71 );
  var FULL_GROWN_WIDTH = 450;

  /**
   * @param {GeneExpressionModel} model
   * @constructor
   */
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
     * @protected
     */
    getScaledShape: function( growthFactor ) {
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
     * @param {Vector2} attachmentPointPosition
     * @public
     */
    setAttachmentPointPosition: function( attachmentPointPosition ) {
      // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
      // changes.
      this.setAttachmentPointPositionXY( attachmentPointPosition.x, attachmentPointPosition.y );
    },

    /**
     *
     * @param {number} attachmentPointPositionX
     * @param {number} attachmentPointPositionY
     * @private
     */
    setAttachmentPointPositionXY: function( attachmentPointPositionX, attachmentPointPositionY ) {
      // Note: This is specific to this protein's shape, and will need to be adjusted if the protein's shape algorithm
      // changes.
      this.setPosition( new Vector2( attachmentPointPositionX, attachmentPointPositionY +
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