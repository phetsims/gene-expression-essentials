// Copyright 2015, University of Colorado Boulder
/**
 * Class that represents a transcription factor in the model. There are multiple transcription factors, and some are
 * positive (in the sense that they increase the likelihood of transcription) and some are negative (i.e. the reduce the
 * likelihood of transcription).
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  var TranscriptionFactorConfig = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactorConfig' );
  var BioShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BioShapeUtils' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/StubGeneExpressionModel' );
  var Vector2 = require( 'DOT/Vector2' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var TranscriptionFactorAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/TranscriptionFactorAttachmentStateMachine' );

  // constants
  var WIDTH = 325;   // In nanometers.
  var HEIGHT = 240;  // In nanometers.
  var SIZE = new Dimension2( WIDTH, HEIGHT );

  /**
   *
   * @param {GeneExpressionModel} model
   * @param {TranscriptionFactorConfig} config
   * @param {Vector2} initialPosition
   * @constructor
   */
  function TranscriptionFactor( model, config, initialPosition ) {
    model = model || new StubGeneExpressionModel();
    initialPosition = initialPosition || new Vector2( 0, 0 );
    MobileBiomolecule.call( this, model, config.shape, config.baseColor );

    // Configuration used to create this transcription factor, used when comparing factors and creating copies.
    this.config = config; // private
    this.setPosition( initialPosition );
  }

  geneExpressionEssentials.register( 'TranscriptionFactor', TranscriptionFactor );

  return inherit( MobileBiomolecule, TranscriptionFactor, {

    /**
     * Get an indication of whether this transcription factor is positive (enhances transcription) or negative
     * (prevents or decreases likelihood of transcription).
     *
     * @return {boolean}
     */
    isPositive: function() {
      return this.config.isPositive;
    },


    /**
     * Overridden in order to provide some unique behavior for transcription factors.
     * @returns {TranscriptionFactorAttachmentStateMachine}
     */
    createAttachmentStateMachine: function() {
      return new TranscriptionFactorAttachmentStateMachine( this );
    },

    handleReleasedByUser: function() {
      MobileBiomolecule.prototype.handleReleasedByUser.call( this );

      // A case that is unique to transcription factors: If released on top of another biomolecule on the DNA strand, go
      // directly into the detaching state so that this drifts away from the DNA. This makes it clear the you can't have
      // two transcription factors in the same place on the DNA.

      var moleculesShapes = this.model.getOverlappingBiomolecules( this.getShape() );

      for ( var i = 0; i < moleculesShapes.length; i++ ) {
        var biomolecule = moleculesShapes[ i ];
        if ( biomolecule !== this && biomolecule.attachedToDnaProperty.get() ) {
          this.attachmentStateMachine.forceImmediateUnattachedButUnavailable();
          break;
        }
      }

    },

    /**
     *
     * @returns {Vector2}
     */
    getDetachDirection: function() {
      // Randomly either up or down when detaching from DNA.
      return phet.joist.random.nextBoolean() ? new Vector2( 0, 1 ) : new Vector2( 0, -1 );
    },

    /**
     *
     * @returns {AttachmentSite}
     */
    proposeAttachments: function() {
      // Transcription factors only attach to DNA.
      return this.model.getDnaMolecule().considerProposalFromByTranscriptionFactor( this );
    },

    /**
     *
     * @returns {TranscriptionFactorConfig}
     */
    getConfig: function() {
      return this.config;
    }


  }, {

    // Static definitions of all the transcription factor configurations that
    // are used by this sim.
    TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS: new TranscriptionFactorConfig( BioShapeUtils.createRandomShape( SIZE, 1000 ), true, Color.yellow ),
    TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG: new TranscriptionFactorConfig( BioShapeUtils.createRandomShape( SIZE, 2000 ), false, Color.red ),
    TRANSCRIPTION_FACTOR_CONFIG_GENE_2_POS_1: new TranscriptionFactorConfig( BioShapeUtils.createRandomShape( SIZE, 3001 ), true, Color.orange ),
    TRANSCRIPTION_FACTOR_CONFIG_GENE_2_POS_2: new TranscriptionFactorConfig( BioShapeUtils.createRandomShape( SIZE, 125 ), true, new Color( 0, 255, 127 ) ),
    TRANSCRIPTION_FACTOR_CONFIG_GENE_2_NEG: new TranscriptionFactorConfig( BioShapeUtils.createRandomShape( SIZE, 4000 ), false, new Color( 255, 255, 255 ) ),
    TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_1: new TranscriptionFactorConfig( BioShapeUtils.createRandomShape( SIZE, 57 ), true, new Color( 255, 127, 0 ) ),
    TRANSCRIPTION_FACTOR_CONFIG_GENE_3_POS_2: new TranscriptionFactorConfig( BioShapeUtils.createRandomShape( SIZE, 88 ), true, new Color( 255, 99, 71 ) ),
    TRANSCRIPTION_FACTOR_CONFIG_GENE_3_NEG: new TranscriptionFactorConfig( BioShapeUtils.createRandomShape( SIZE, 40 ), false, Color.magenta )
  } );
} );