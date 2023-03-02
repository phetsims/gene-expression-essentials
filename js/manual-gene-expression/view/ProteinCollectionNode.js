// Copyright 2015-2023, University of Colorado Boulder

/**
 * A Node that represents a labeled box where the user can collect protein molecules.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, HBox, Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import GEEConstants from '../../common/GEEConstants.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import ProteinCollectionArea from './ProteinCollectionArea.js';

// constants
const NUM_PROTEIN_TYPES = 3;  // Total number of protein types that can be collected.

// attributes of various aspects of the box
const TITLE_FONT = new PhetFont( { size: 18, weight: 'bold' } );
const READOUT_FONT = new PhetFont( { size: 18, weight: 'bold' } );
const BACKGROUND_COLOR = new Color( 255, 250, 205 );
const INTEGER_BOX_BACKGROUND_COLOR = new Color( 240, 240, 240 );

const collectionCompleteString = GeneExpressionEssentialsStrings.collectionComplete;
const proteinCountCaptionPart1String = GeneExpressionEssentialsStrings.proteinCountCaptionPart1;
const proteinCountCaptionPart2String = GeneExpressionEssentialsStrings.proteinCountCaptionPart2;
const yourProteinCollectionString = GeneExpressionEssentialsStrings.yourProteinCollection;

class ProteinCollectionNode extends Node {

  /**
   * @param {ManualGeneExpressionModel} model
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( model, modelViewTransform ) {
    super();

    // Create the title and scale it if needed.
    const title = new RichText( yourProteinCollectionString, {
      fill: Color.BLACK,
      font: TITLE_FONT,
      maxWidth: 120,
      align: 'center'
    } );

    // create the collection area
    const collectionArea = new ProteinCollectionArea( model, modelViewTransform );

    // create the panel
    this.addChild( new Panel(
      new VBox( { children: [ title, collectionArea, createCollectionCountIndicator( model ) ], spacing: 5 } ),
      {
        cornerRadius: GEEConstants.CORNER_RADIUS,
        fill: BACKGROUND_COLOR,
        resize: false
      }
    ) );
  }
}

/**
 * helper function to create a node that indicates the number of proteins that the user has collected so far. This
 * monitors the model and updates automatically.
 * @param {ManualGeneExpressionModel}model
 */
function createCollectionCountIndicator( model ) {
  const contentNode = new Node();

  const collectionCompleteNode = new Text( collectionCompleteString, {
    font: new PhetFont( 20 ),
    maxWidth: 200
  } );
  contentNode.addChild( collectionCompleteNode );

  const countReadoutText = new Text( 0, {
    font: READOUT_FONT
  } );
  const countReadoutPanel = new Panel( countReadoutText, {
    minWidth: countReadoutText.width,
    resize: false,
    cornerRadius: GEEConstants.CORNER_RADIUS,
    lineWidth: 1,
    align: 'center',
    fill: INTEGER_BOX_BACKGROUND_COLOR
  } );
  const countIndicatorNode = new HBox( {
    children: [ new Text( proteinCountCaptionPart1String, {
      font: READOUT_FONT,
      maxWidth: 100
    } ),
      countReadoutPanel ],
    spacing: 4
  } );

  const children = [ countIndicatorNode, new Text( proteinCountCaptionPart2String, {
    font: READOUT_FONT,
    maxWidth: 200
  } ) ];
  const collectedQuantityIndicator = new VBox( {
    children: children, spacing: 10
  } );

  contentNode.addChild( collectedQuantityIndicator );
  collectedQuantityIndicator.center = collectionCompleteNode.center;

  function countChangeUpdater() {
    let numProteinTypesCollected = 0;
    if ( model.proteinACollectedProperty.get() > 0 ) {
      numProteinTypesCollected++;
    }
    if ( model.proteinBCollectedProperty.get() > 0 ) {
      numProteinTypesCollected++;
    }
    if ( model.proteinCCollectedProperty.get() > 0 ) {
      numProteinTypesCollected++;
    }
    countReadoutText.setString( numProteinTypesCollected );
    // Set the visibility.
    collectedQuantityIndicator.setVisible( numProteinTypesCollected !== NUM_PROTEIN_TYPES );
    collectionCompleteNode.setVisible( numProteinTypesCollected === NUM_PROTEIN_TYPES );
  }

  model.proteinACollectedProperty.link( countChangeUpdater );
  model.proteinBCollectedProperty.link( countChangeUpdater );
  model.proteinCCollectedProperty.link( countChangeUpdater );

  return contentNode;
}

geneExpressionEssentials.register( 'ProteinCollectionNode', ProteinCollectionNode );

export default ProteinCollectionNode;