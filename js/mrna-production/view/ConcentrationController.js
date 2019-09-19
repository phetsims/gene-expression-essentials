// Copyright 2015-2017, University of Colorado Boulder

/**
 * Class definition for slider that controls the concentration of a transcription factor.
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/ControllerNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const concentrationString = require( 'string!GENE_EXPRESSION_ESSENTIALS/concentration' );
  const highString = require( 'string!GENE_EXPRESSION_ESSENTIALS/high' );
  const noneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/none' );

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
    Node.call( this );

    const captionNode = new Text( concentrationString, {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: 180
    } );

    const molecule = new MobileBiomoleculeNode( GEEConstants.TRANSCRIPTION_FACTOR_MVT,
      new TranscriptionFactor( new StubGeneExpressionModel(), transcriptionFactorConfig ) );
    molecule.setPickable( false );

    this.addChild( new VBox( {
      spacing: 5,
      children: [
        captionNode,
        molecule,
        new ControllerNode(
          tfLevelProperty,
          min,
          max,
          noneString,
          highString,
          { trackSize: new Dimension2( 130, 5 ) }
        )
      ]
    } ) );
  }

  geneExpressionEssentials.register( 'ConcentrationController', ConcentrationController );

  return inherit( Node, ConcentrationController, {} );
} );