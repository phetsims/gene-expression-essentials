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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HorizontalSliderWithLabelsAtEnds = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/view/HorizontalSliderWithLabelsAtEnds' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_BASICS/common/view/MobileBiomoleculeNode' );
  var CommonConstants = require( 'GENE_EXPRESSION_BASICS/common/model/CommonConstants' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_BASICS/common/model/TranscriptionFactor' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var concentrationsString = require( 'string!GENE_EXPRESSION_BASICS/concentrations' );
  var noneString = require( 'string!GENE_EXPRESSION_BASICS/none' );
  var lowString = require( 'string!GENE_EXPRESSION_BASICS/low' );

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
    var thisNode = this;
    Node.call( thisNode );

    var captionNode = new Text( concentrationsString, new PhetFont( { size: 14, weight: 'bold' } ) );

    var molecule = new MobileBiomoleculeNode( CommonConstants.TRANSCRIPTION_FACTOR_MVT,
      new TranscriptionFactor( new StubGeneExpressionModel(), transcriptionFactorConfig ) );
//            molecule.setPickable( false );//TODO
//            molecule.setChildrenPickable( false ); TODO
    thisNode.addChild( new VBox( {
      spacing: 5, children: [ captionNode, molecule,
        new HorizontalSliderWithLabelsAtEnds( tfLevelProperty,
          min,
          max,
          noneString,
          lowString ) ]
    } ) );

  }

  return inherit( Node, ConcentrationController, {} );
} );


