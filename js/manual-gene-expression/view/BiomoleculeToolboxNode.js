// Copyright 2015-2022, University of Colorado Boulder

/**
 * BiomoleculeToolboxNode is a Scenery node that portrays a box from which the user can extract various biomolecules and
 * put them into action within the cell.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, HBox, Node, RichText, Spacer, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import GEEConstants from '../../common/GEEConstants.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import MessengerRnaDestroyerCreatorNode from './MessengerRnaDestroyerCreatorNode.js';
import RibosomeCreatorNode from './RibosomeCreatorNode.js';
import RnaPolymeraseCreatorNode from './RnaPolymeraseCreatorNode.js';
import TranscriptionFactorCreatorNode from './TranscriptionFactorCreatorNode.js';

// constants
const TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );

const biomoleculeToolboxString = GeneExpressionEssentialsStrings.biomoleculeToolbox;
const mRnaDestroyerString = GeneExpressionEssentialsStrings.mRnaDestroyer;
const negativeTranscriptionFactorHtmlString = GeneExpressionEssentialsStrings.negativeTranscriptionFactorHtml;
const positiveTranscriptionFactorHtmlString = GeneExpressionEssentialsStrings.positiveTranscriptionFactorHtml;
const ribosomeString = GeneExpressionEssentialsStrings.ribosome;
const rnaPolymeraseString = GeneExpressionEssentialsStrings.rnaPolymerase;

class BiomoleculeToolboxNode extends Node {

  /**
   * @param {ManualGeneExpressionModel} model
   * @param {ManualGeneExpressionScreenView} screenView
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Gene} gene
   */
  constructor( model, screenView, modelViewTransform, gene ) {

    super();

    // @public {ManualGeneExpressionModel} - used by the creator nodes to add new biomolecules to the model
    this.model = model;

    // @public {ManualGeneExpressionScreenView} - used by the creator nodes to add new biomolecule nodes to the view
    this.screenView = screenView;

    // @public {ModelViewTransform2} - used by the creator nodes to add new biomolecule nodes to the view
    this.modelViewTransform = modelViewTransform;

    // @private
    this.biomoleculeCreatorNodeList = [];

    // title
    const toolboxTitleNode = new Text( biomoleculeToolboxString, {
      font: TITLE_FONT,
      maxWidth: 200
    } );

    // labels for the rows
    const positiveTranscriptionFactorLabel = BiomoleculeToolboxNode.createRowLabel( positiveTranscriptionFactorHtmlString );
    const positiveTranscriptionFactorLabelWidth = positiveTranscriptionFactorLabel.width;
    const rnaPolymeraseLabel = BiomoleculeToolboxNode.createRowLabel( rnaPolymeraseString );
    const rnaPolymeraseLabelWidth = rnaPolymeraseLabel.width;
    const ribosomeLabel = BiomoleculeToolboxNode.createRowLabel( ribosomeString );
    const ribosomeLabelWidth = ribosomeLabel.width;
    const mrnaDestroyerLabel = BiomoleculeToolboxNode.createRowLabel( mRnaDestroyerString );
    const mrnaDestroyerLabelWidth = mrnaDestroyerLabel.width;
    const negativeTranscriptionFactorLabel = BiomoleculeToolboxNode.createRowLabel( negativeTranscriptionFactorHtmlString );
    const negativeTranscriptionFactorLabelWidth = negativeTranscriptionFactorLabel.width;

    const maxWidth = _.max( [
      positiveTranscriptionFactorLabelWidth,
      rnaPolymeraseLabelWidth,
      ribosomeLabelWidth,
      mrnaDestroyerLabelWidth,
      negativeTranscriptionFactorLabelWidth
    ] );

    // transcription factor(s)
    const transcriptionFactors = gene.getTranscriptionFactorConfigs();
    const positiveTranscriptBoxNodes = [];
    const negativeTranscriptBoxNodes = [];
    transcriptionFactors.forEach( tfConfig => {
      const creatorNode = this.addCreatorNode( new TranscriptionFactorCreatorNode( this, tfConfig ) );
      if ( tfConfig.isPositive ) {
        const positiveTranscriptionBox = new HBox( {
          children: [
            new Node( { children: [ positiveTranscriptionFactorLabel ] } ),
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
            new Node( { children: [ negativeTranscriptionFactorLabel ] } ),
            new Spacer( maxWidth - negativeTranscriptionFactorLabelWidth, 0 ),
            creatorNode
          ],
          spacing: 10
        } );
        negativeTranscriptBoxNodes.push( negativeTranscriptionBox );
      }
    } );

    // polymerase
    const polymeraseBox = new HBox( {
      children: [
        rnaPolymeraseLabel,
        new Spacer( maxWidth - rnaPolymeraseLabelWidth, 0 ),
        this.addCreatorNode( new RnaPolymeraseCreatorNode( this ) ),
        this.addCreatorNode( new RnaPolymeraseCreatorNode( this ) )
      ],
      spacing: 10
    } );

    // ribosomes
    const ribosomeBox = new HBox( {
      children: [
        ribosomeLabel,
        new Spacer( maxWidth - ribosomeLabelWidth, 0 ),
        this.addCreatorNode( new RibosomeCreatorNode( this ) ),
        this.addCreatorNode( new RibosomeCreatorNode( this ) )
      ],
      spacing: 10
    } );

    // mRNA destroyer
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

    // create the content of the panel
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

    // add the panel
    this.addChild( new Panel( contentNode, {
      cornerRadius: GEEConstants.CORNER_RADIUS,
      xMargin: 10,
      yMargin: 10,
      fill: new Color( 250, 250, 250 ),
      lineWidth: 1,
      align: 'center',
      resize: false
    } ) );
  }

  /**
   * convenience function to push a creator node on to the creator node list and return a reference to it
   * @param {BiomoleculeCreatorNode} creatorNode
   * @returns {BiomoleculeCreatorNode}
   * @private
   */
  addCreatorNode( creatorNode ) {
    this.biomoleculeCreatorNodeList.push( creatorNode );
    return creatorNode;
  }

  /**
   * reset the toolbox by resetting each of the biomolecule creator nodes
   * @public
   */
  reset() {
    const bioMoleculeCreatorNodeLength = this.biomoleculeCreatorNodeList.length;
    for ( let i = 0; i < bioMoleculeCreatorNodeLength; i++ ) {
      this.biomoleculeCreatorNodeList[ i ].reset();
    }
  }

  /**
   * convenience function for creating row labels
   * @private
   */
  static createRowLabel( text ) {
    return new RichText( text, {
      font: new PhetFont( { size: 15 } ),
      maxWidth: 150,
      align: 'center'
    } );
  }
}

geneExpressionEssentials.register( 'BiomoleculeToolboxNode', BiomoleculeToolboxNode );
export default BiomoleculeToolboxNode;