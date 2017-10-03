// Copyright 2015-2017, University of Colorado Boulder

/**
 * Specific instance of protein
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
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
  var BASE_COLOR = new Color( 255, 99, 71 );
  var FULL_GROWN_WIDTH = 450;

  /**
   * @param {GeneExpressionModel} model
   * @constructor
   */
  function ProteinB( model ) {
    model = model || new StubGeneExpressionModel();
    Protein.call( this, model, this.createInitialShape(), BASE_COLOR );
  }

  geneExpressionEssentials.register( 'ProteinB', ProteinB );

  return inherit( Protein, ProteinB, {

    /**
     * @override
     * @returns {ProteinB}
     * @public
     */
    createInstance: function() {
      return new ProteinB( this.model );
    },

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
     * @param {Vector2} attachmentPointLocation
     * @public
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
      var path = new Shape();
      var vector = new Vector2( -currentWidth / 2, 0 );
      path.moveTo( vector.x, vector.y );
      for ( var i = 0; i < 6; i++ ) {
        vector.rotate( Math.PI / 3 );
        path.lineTo( vector.x, vector.y );
      }
      path.close();
      return path;
    }
  } );
} );
