// Copyright 2015-2018, University of Colorado Boulder

/**
 * Control panel that present a user interface for controlling the affinity of RNA polymerase to DNA plus a
 * transcription factor.
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AffinityController = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/AffinityController' );
  const Color = require( 'SCENERY/util/Color' );
  const DnaMolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaMolecule' );
  const DnaMoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeNode' );
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const RnaPolymerase = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/RnaPolymerase' );
  const Spacer = require( 'SCENERY/nodes/Spacer' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  const POLYMERASE_SCALE = 0.08;
  const POLYMERASE_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
    new Vector2( 0, 0 ),
    new Vector2( 0, 0 ),
    POLYMERASE_SCALE
  );
  const DNA_AND_TF_SCALE = 0.08;
  const DNA_AND_TF_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
    new Vector2( 0, 0 ),
    new Vector2( 0, 0 ),
    DNA_AND_TF_SCALE
  );

  //strings
  const rnaPolymeraseString = require( 'string!GENE_EXPRESSION_ESSENTIALS/rnaPolymerase' );

  /**
   * @param {TranscriptionFactorConfig} tfConfig
   * @param {number} minHeight
   * @param {Property} polymeraseAffinityProperty
   * @constructor
   */
  function PolymeraseAffinityControlPanel( tfConfig, minHeight, polymeraseAffinityProperty ) {
    const titleNode = new Text( rnaPolymeraseString, {
      font: TITLE_FONT,
      maxWidth: 180
    } );

    // Create the affinity control node.
    const polymeraseNode = new MobileBiomoleculeNode( POLYMERASE_MVT, new RnaPolymerase() );
    const dnaFragmentNode = new DnaMoleculeNode(
      new DnaMolecule(
        null,
        GEEConstants.BASE_PAIRS_PER_TWIST * 2 + 1,
        0.0,
        true
      ),
      DNA_AND_TF_MVT,
      2,
      false
    ).toDataURLNodeSynchronous(); // make this into an image in the control panel so another canvas isn't created
    const transcriptionFactorNode = new MobileBiomoleculeNode( DNA_AND_TF_MVT, new TranscriptionFactor( null, tfConfig ) );

    // Set position to be on top of the dna, values empirically determined.
    transcriptionFactorNode.x = 25;
    transcriptionFactorNode.y = 0;

    dnaFragmentNode.addChild( transcriptionFactorNode );

    const panelOptions = {
      cornerRadius: GEEConstants.CORNER_RADIUS,
      fill: new Color( 250, 250, 250 ),
      lineWidth: 2,
      xMargin: 10,
      yMargin: 10,
      minWidth: 200,
      align: 'center',
      resize: false
    };

    // In order to size the control panel correctly, make one first, see how far off it is, and then make one of the
    // correct size.
    const dummyContents = new VBox( {
        children: [ titleNode,
          new AffinityController( polymeraseNode, dnaFragmentNode, new Property( 0 ) )
        ],
        spacing: 20
      }
    );
    const dummyControlPanel = new Panel( dummyContents, panelOptions );
    const growthAmount = minHeight - dummyControlPanel.height - 40;

    // Create the spacers used to make the panel meet the min size.
    const topSpacer = new Spacer( 0, growthAmount * 0.25 );
    const bottomSpacer = new Spacer( 0, growthAmount * 0.75 );

    const contents = new VBox( {
      children: [
        titleNode,
        topSpacer,
          new AffinityController( polymeraseNode, dnaFragmentNode, polymeraseAffinityProperty ),
          bottomSpacer
        ],
        spacing: 20
      }
    );

    Panel.call( this, contents, panelOptions );
  }

  geneExpressionEssentials.register( 'PolymeraseAffinityControlPanel', PolymeraseAffinityControlPanel );

  return inherit( Panel, PolymeraseAffinityControlPanel );
} );