// Copyright 2015-2022, University of Colorado Boulder

/**
 * Control panel that present a user interface for controlling the affinity of RNA polymerase to DNA plus a
 * transcription factor.
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Spacer, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import GEEConstants from '../../common/GEEConstants.js';
import DnaMolecule from '../../common/model/DnaMolecule.js';
import RnaPolymerase from '../../common/model/RnaPolymerase.js';
import TranscriptionFactor from '../../common/model/TranscriptionFactor.js';
import DnaMoleculeNode from '../../common/view/DnaMoleculeNode.js';
import MobileBiomoleculeNode from '../../common/view/MobileBiomoleculeNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import AffinityController from './AffinityController.js';

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
const rnaPolymeraseString = GeneExpressionEssentialsStrings.rnaPolymerase;

class PolymeraseAffinityControlPanel extends Panel {

  /**
   * @param {TranscriptionFactorConfig} tfConfig
   * @param {number} minHeight
   * @param {Property} polymeraseAffinityProperty
   */
  constructor( tfConfig, minHeight, polymeraseAffinityProperty ) {
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
        children: [
          titleNode,
          new AffinityController( polymeraseNode, dnaFragmentNode, new Property( 0 ) )
        ],
        spacing: 20
      }
    );
    const dummyControlPanel = new Panel( dummyContents, panelOptions );
    const growthAmount = minHeight - dummyControlPanel.height - 40;
    dummyControlPanel.dispose();
    dummyContents.dispose();

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

    super( contents, panelOptions );
  }
}

geneExpressionEssentials.register( 'PolymeraseAffinityControlPanel', PolymeraseAffinityControlPanel );
export default PolymeraseAffinityControlPanel;