// Copyright 2015, University of Colorado Boulder

/**
 * Class definition for slider that controls the concentration of a transcription factor.
 *
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HorizontalSliderWithLabelsAtEnds = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/view/HorizontalSliderWithLabelsAtEnds' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/StubGeneExpressionModel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var concentrationsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/concentrations' );
  var noneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/none' );
  var lowString = require( 'string!GENE_EXPRESSION_ESSENTIALS/low' );

  /**
   *
   * @param {TranscriptionFactorConfig} transcriptionFactorConfig
   * @param {Property} tfLevelProperty
   * @param {Number} min
   * @param {Number} max
   *
   * @constructor
   */
  function ConcentrationController( transcriptionFactorConfig, tfLevelProperty, min, max ) {
    var self = this;
    Node.call( self );

    var captionNode = new Text( concentrationsString, new PhetFont( { size: 14, weight: 'bold' } ) );

    var molecule = new MobileBiomoleculeNode( CommonConstants.TRANSCRIPTION_FACTOR_MVT,
      new TranscriptionFactor( new StubGeneExpressionModel(), transcriptionFactorConfig ) );
    molecule.setPickable( false );

    self.addChild( new VBox( {
      spacing: 5, children: [ captionNode, molecule,
        new HorizontalSliderWithLabelsAtEnds( tfLevelProperty,
          min,
          max,
          noneString,
          lowString ) ]
    } ) );

  }

  geneExpressionEssentials.register( 'ConcentrationController', ConcentrationController );

  return inherit( Node, ConcentrationController, {} );
} );


