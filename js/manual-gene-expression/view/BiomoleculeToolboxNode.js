// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class defines the box on the user interface from which the user can extract various biomolecules and put them
 * into action within the cell.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import inherit from '../../../../phet-core/js/inherit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Spacer from '../../../../scenery/js/nodes/Spacer.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import Panel from '../../../../sun/js/Panel.js';
import GEEConstants from '../../common/GEEConstants.js';
import geneExpressionEssentialsStrings from '../../gene-expression-essentials-strings.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import MessengerRnaDestroyerCreatorNode from './MessengerRnaDestroyerCreatorNode.js';
import RibosomeCreatorNode from './RibosomeCreatorNode.js';
import RnaPolymeraseCreatorNode from './RnaPolymeraseCreatorNode.js';
import TranscriptionFactorCreatorNode from './TranscriptionFactorCreatorNode.js';

// constants
const TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );

const biomoleculeToolboxString = geneExpressionEssentialsStrings.biomoleculeToolbox;
const mRnaDestroyerString = geneExpressionEssentialsStrings.mRnaDestroyer;
const negativeTranscriptionFactorHtmlString = geneExpressionEssentialsStrings.negativeTranscriptionFactorHtml;
const positiveTranscriptionFactorHtmlString = geneExpressionEssentialsStrings.positiveTranscriptionFactorHtml;
const ribosomeString = geneExpressionEssentialsStrings.ribosome;
const rnaPolymeraseString = geneExpressionEssentialsStrings.rnaPolymerase;

/**
 * Convenience function for creating row labels.
 */
function RowLabel( text ) {
  return new RichText( text, {
    font: new PhetFont( { size: 15 } ),
    maxWidth: 150,
    align: 'center'
  } );
}

/**
 * @param {ManualGeneExpressionModel} model
 * @param {ManualGeneExpressionScreenView} canvas
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Gene} gene
 * @constructor
 */
function BiomoleculeToolboxNode( model, canvas, modelViewTransform, gene ) {

  const self = this;
  this.model = model; //@private
  this.canvas = canvas; //@private
  this.modelViewTransform = modelViewTransform; //@private
  this.biomoleculeCreatorNodeList = [];

  // Add the title.
  const toolboxTitleNode = new Text( biomoleculeToolboxString, {
    font: TITLE_FONT,
    maxWidth: 200
  } );

  const positiveTranscriptionFactorLabel = new RowLabel( positiveTranscriptionFactorHtmlString );
  const positiveTranscriptionFactorLabelWidth = positiveTranscriptionFactorLabel.width;
  const rnaPolymeraseLabel = new RowLabel( rnaPolymeraseString );
  const rnaPolymeraseLabelWidth = rnaPolymeraseLabel.width;
  const ribosomeLabel = new RowLabel( ribosomeString );
  const ribosomeLabelWidth = ribosomeLabel.width;
  const mrnaDestroyerLabel = new RowLabel( mRnaDestroyerString );
  const mrnaDestroyerLabelWidth = mrnaDestroyerLabel.width;
  const negativeTranscriptionFactorLabel = new RowLabel( negativeTranscriptionFactorHtmlString );
  const negativeTranscriptionFactorLabelWidth = negativeTranscriptionFactorLabel.width;

  const maxWidth = _.max( [
    positiveTranscriptionFactorLabelWidth,
    rnaPolymeraseLabelWidth,
    ribosomeLabelWidth,
    mrnaDestroyerLabelWidth,
    negativeTranscriptionFactorLabelWidth
  ] );

  // Transcription factor(s).
  const transcriptionFactors = gene.getTranscriptionFactorConfigs();
  const positiveTranscriptBoxNodes = [];
  const negativeTranscriptBoxNodes = [];
  transcriptionFactors.forEach( function( tfConfig ) {
    const creatorNode = self.addCreatorNode( new TranscriptionFactorCreatorNode( self, tfConfig ) );
    if ( tfConfig.isPositive ) {
      const positiveTranscriptionBox = new HBox( {
        children: [
          positiveTranscriptionFactorLabel,
          new Spacer( maxWidth - positiveTranscriptionFactorLabelWidth, 0 ),
          creatorNode
        ],
        spacing: 10
      } );
      positiveTranscriptBoxNodes.push( positiveTranscriptionBox );
    }
    else {
      const negativeTranscriptionBox = new HBox( {
        children: [
          negativeTranscriptionFactorLabel,
          new Spacer( maxWidth - negativeTranscriptionFactorLabelWidth, 0 ),
          creatorNode
        ],
        spacing: 10
      } );
      negativeTranscriptBoxNodes.push( negativeTranscriptionBox );
    }
  } );

  // Polymerase.
  const polymeraseBox = new HBox( {
    children: [
      rnaPolymeraseLabel,
      new Spacer( maxWidth - rnaPolymeraseLabelWidth, 0 ),
      this.addCreatorNode( new RnaPolymeraseCreatorNode( this ) ),
      this.addCreatorNode( new RnaPolymeraseCreatorNode( this ) )
    ],
    spacing: 10
  } );

  // Ribosomes.
  const ribosomeBox = new HBox( {
    children: [
      ribosomeLabel,
      new Spacer( maxWidth - ribosomeLabelWidth, 0 ),
      this.addCreatorNode( new RibosomeCreatorNode( this ) ),
      this.addCreatorNode( new RibosomeCreatorNode( this ) )
    ],
    spacing: 10
  } );

  // mRNA destroyer.
  const mRnaDestroyerBox = new HBox( {
    children: [
      mrnaDestroyerLabel,
      new Spacer( maxWidth - mrnaDestroyerLabelWidth, 0 ),
      this.addCreatorNode( new MessengerRnaDestroyerCreatorNode( this ) ),
      this.addCreatorNode( new MessengerRnaDestroyerCreatorNode( this ) )
    ],
    spacing: 10
  } );

  let childrenNodesArray = [];
  childrenNodesArray = childrenNodesArray.concat( positiveTranscriptBoxNodes );
  childrenNodesArray.push( polymeraseBox );
  childrenNodesArray.push( ribosomeBox );
  childrenNodesArray.push( mRnaDestroyerBox );
  childrenNodesArray = childrenNodesArray.concat( negativeTranscriptBoxNodes );
  // Create the content of this control panel.
  const contentNode = new Node();
  contentNode.addChild( toolboxTitleNode );
  const childrenNode = new VBox( {
    children: childrenNodesArray,
    spacing: 10,
    align: 'left'
  } );
  contentNode.addChild( childrenNode );
  childrenNode.top = toolboxTitleNode.bottom + 10;
  toolboxTitleNode.centerX = childrenNode.centerX;

  Panel.call( this, contentNode, {
    cornerRadius: GEEConstants.CORNER_RADIUS,
    xMargin: 10,
    yMargin: 10,
    fill: new Color( 250, 250, 250 ),
    lineWidth: 1,
    align: 'center',
    resize: false
  } );
}

geneExpressionEssentials.register( 'BiomoleculeToolboxNode', BiomoleculeToolboxNode );

export default inherit( Panel, BiomoleculeToolboxNode, {

  /**
   * @public reset the toolbox
   */
  reset: function() {
    const bioMoleculeCreatorNodeLength = this.biomoleculeCreatorNodeList.length;
    for ( let i = 0; i < bioMoleculeCreatorNodeLength; i++ ) {
      this.biomoleculeCreatorNodeList[ i ].reset();
    }
  },

  /**
   * Convenience function for making it easy to create a biomolecule creator node and add it to the content panel at
   * the same time.
   * @param {BiomoleculeCreatorNode} biomoleculeCreatorNode
   * @returns BiomoleculeCreatorNode
   * @private
   */
  addCreatorNode: function( biomoleculeCreatorNode ) {
    this.biomoleculeCreatorNodeList.push( biomoleculeCreatorNode );
    return biomoleculeCreatorNode;
  }
} );