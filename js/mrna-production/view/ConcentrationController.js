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
  var ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/ControllerNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var concentrationsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/concentrations' );
  var noneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/none' );
  var highString = require( 'string!GENE_EXPRESSION_ESSENTIALS/high' );

  /**
   *
   * @param {TranscriptionFactorConfig} transcriptionFactorConfig
   * @param {Property} tfLevelProperty
   * @param {number} min
   * @param {number} max
   *
   * @constructor
   */
  function ConcentrationController( transcriptionFactorConfig, tfLevelProperty, min, max ) {
    var self = this;
    Node.call( self );

    var captionNode = new Text( concentrationsString, {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: 180
    } );

    var molecule = new MobileBiomoleculeNode( GEEConstants.TRANSCRIPTION_FACTOR_MVT,
      new TranscriptionFactor( new StubGeneExpressionModel(), transcriptionFactorConfig ) );
    molecule.setPickable( false );

    self.addChild( new VBox( {
      spacing: 5, children: [ captionNode, molecule,
        new ControllerNode( tfLevelProperty,
          min,
          max,
          noneString,
          highString, {
            trackSize: new Dimension2( 130, 5 )
          } ) ]
    } ) );

  }

  geneExpressionEssentials.register( 'ConcentrationController', ConcentrationController );

  return inherit( Node, ConcentrationController, {} );
} );