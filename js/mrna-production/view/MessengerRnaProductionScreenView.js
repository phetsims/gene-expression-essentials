// Copyright 2015-2022, University of Colorado Boulder

/**
 * Screen View for Messenger Rna Production Screen
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import DnaMoleculeNode from '../../common/view/DnaMoleculeNode.js';
import MessengerRnaNode from '../../common/view/MessengerRnaNode.js';
import MobileBiomoleculeNode from '../../common/view/MobileBiomoleculeNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import MessengerRnaProductionModel from '../model/MessengerRnaProductionModel.js';
import PolymeraseAffinityControlPanel from './PolymeraseAffinityControlPanel.js';
import TranscriptionFactorControlPanel from './TranscriptionFactorControlPanel.js';

// constants
const INSET = 10;  // Inset for several of the controls.

const negativeTranscriptionFactorString = GeneExpressionEssentialsStrings.negativeTranscriptionFactor;

class MessengerRnaProductionScreenView extends ScreenView {

  /**
   * @param {MessengerRnaProductionModel} model
   */
  constructor( model ) {

    // due to odd behavior of flickering on this screen, we run it with preventFit
    super( { preventFit: true } );
    this.model = model;
    this.negativeTranscriptionFactorEnabled = new Property( false );
    const viewPortPosition = new Vector2( this.layoutBounds.width * 0.48, this.layoutBounds.height * 0.4 );

    // Set up the model-view transform.
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      viewPortPosition,
      0.2  // "Zoom factor" - smaller zooms out, larger zooms in.
    );

    // Set up the root node for all model objects. Nodes placed under this one will scroll when the user moves along the
    // DNA strand.
    this.modelRootNode = new Node();
    this.addChild( this.modelRootNode );

    // Add some layers for enforcing some z-order relationships needed in order to keep things looking good.
    const dnaLayer = new Node();
    this.modelRootNode.addChild( dnaLayer );
    dnaLayer.setPickable( false );
    const messengerRnaLayer = new Node();
    messengerRnaLayer.setPickable( false );
    this.modelRootNode.addChild( messengerRnaLayer );
    const transcribingPolymeraseLayer = new Node();
    transcribingPolymeraseLayer.setPickable( false );
    this.modelRootNode.addChild( transcribingPolymeraseLayer );
    const topBiomoleculeLayer = new Node();
    topBiomoleculeLayer.setPickable( false );
    this.modelRootNode.addChild( topBiomoleculeLayer );
    const placementHintLayer = new Node();
    this.modelRootNode.addChild( placementHintLayer );
    const controlsNode = new Node();
    this.addChild( controlsNode );

    // Add the representation of the DNA strand.
    this.dnaMoleculeNode = new DnaMoleculeNode( model.getDnaMolecule(), this.modelViewTransform, 5, false );
    dnaLayer.addChild( this.dnaMoleculeNode );

    // Get a reference to the gene being controlled.
    const gene = model.getDnaMolecule().getGenes()[ 0 ];

    // Add the nodes that allow the user to control the concentrations and affinities.
    const positiveTranscriptionFactorControlPanel = new TranscriptionFactorControlPanel(
      model,
      MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
      gene.getTranscriptionFactorAffinityProperty( MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG )
    );
    controlsNode.addChild( positiveTranscriptionFactorControlPanel );

    const polymeraseAffinityControlPanel = new PolymeraseAffinityControlPanel(
      MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
      positiveTranscriptionFactorControlPanel.bounds.height,
      gene.getPolymeraseAffinityProperty()
    );
    controlsNode.addChild( polymeraseAffinityControlPanel );

    const negativeTranscriptionFactorControlPanel = new TranscriptionFactorControlPanel(
      model,
      MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG,
      gene.getTranscriptionFactorAffinityProperty( MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG )
    );
    controlsNode.addChild( negativeTranscriptionFactorControlPanel );

    // Add the checkbox for showing/hiding the control panel for the negative transcription factor.
    const negativeFactorEnabledCheckbox = new Checkbox( this.negativeTranscriptionFactorEnabled, new Text( negativeTranscriptionFactorString, { font: new PhetFont( 18 ), maxWidth: 275 } ), { boxWidth: 20 } );
    controlsNode.addChild( negativeFactorEnabledCheckbox );

    // Only show the control for the negative transcription factor if it is enabled.
    this.negativeTranscriptionFactorEnabled.link( enabled => {
      negativeTranscriptionFactorControlPanel.setVisible( enabled );
      if ( !enabled ) {
        // When the negative transcription factor control is hidden, there should be no negative factors.
        this.model.negativeTranscriptionFactorCountProperty.reset();
      }
    } );

    // Adds the node that has the buttons for controlling time and pausing and stepping forward
    const timeControlNode = new TimeControlNode( model.clockRunningProperty, {
      playPauseStepButtonOptions: {
        playPauseStepXSpacing: INSET,
        playPauseButtonOptions: {
          radius: 23,
          touchAreaDilation: 5
        },
        stepForwardButtonOptions: {
          listener: () => { model.stepInTime( 0.016 ); },
          radius: 15,
          touchAreaDilation: 5
        }
      }
    } );
    this.addChild( timeControlNode );

    // Add the Reset All button.
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel user interactions
        this.model.reset();
        this.negativeTranscriptionFactorEnabled.reset();
      },
      right: this.layoutBounds.maxX - INSET,
      bottom: this.layoutBounds.maxY - INSET
    } );
    controlsNode.addChild( resetAllButton );

    // Lay out the controls.

    positiveTranscriptionFactorControlPanel.left = INSET;
    positiveTranscriptionFactorControlPanel.bottom = this.layoutBounds.maxY - INSET;

    polymeraseAffinityControlPanel.left = positiveTranscriptionFactorControlPanel.right + INSET;
    polymeraseAffinityControlPanel.bottom = positiveTranscriptionFactorControlPanel.bottom;

    negativeTranscriptionFactorControlPanel.left = polymeraseAffinityControlPanel.right + INSET;
    negativeTranscriptionFactorControlPanel.bottom = polymeraseAffinityControlPanel.bottom;
    negativeFactorEnabledCheckbox.left = negativeTranscriptionFactorControlPanel.right + INSET;
    negativeFactorEnabledCheckbox.centerY = resetAllButton.centerY;

    timeControlNode.bottom = negativeFactorEnabledCheckbox.top - 2 * INSET;
    timeControlNode.centerX = negativeFactorEnabledCheckbox.centerX;

    // define a function for adding views of biomolecules
    const addBiomoleculeView = addedBiomolecule => {
      const biomoleculeNode = new MobileBiomoleculeNode( this.modelViewTransform, addedBiomolecule );

      // On this screen, users can't directly interact with individual biomolecules.
      biomoleculeNode.setPickable( false );
      topBiomoleculeLayer.addChild( biomoleculeNode );

      // Add a listener that moves the child on to a lower layer when it connects to the DNA so that we see the desired
      // overlap behavior.
      const positionBiomolecule = attachedToDna => {
        if ( attachedToDna ) {
          if ( topBiomoleculeLayer.hasChild( biomoleculeNode ) ) {
            topBiomoleculeLayer.removeChild( biomoleculeNode );
          }
          transcribingPolymeraseLayer.addChild( biomoleculeNode );
        }
        else {
          if ( transcribingPolymeraseLayer.hasChild( biomoleculeNode ) ) {
            transcribingPolymeraseLayer.removeChild( biomoleculeNode );
          }
          topBiomoleculeLayer.addChild( biomoleculeNode );
        }
      };
      addedBiomolecule.attachedToDnaProperty.lazyLink( positionBiomolecule );

      model.mobileBiomoleculeList.addItemRemovedListener( function removalListener( removedBiomolecule ) {
        if ( removedBiomolecule === addedBiomolecule ) {
          if ( topBiomoleculeLayer.hasChild( biomoleculeNode ) ) {
            topBiomoleculeLayer.removeChild( biomoleculeNode );
          }
          else if ( dnaLayer.hasChild( biomoleculeNode ) ) {
            dnaLayer.removeChild( biomoleculeNode );
          }
          addedBiomolecule.attachedToDnaProperty.unlink( positionBiomolecule );
          biomoleculeNode.dispose();
          model.mobileBiomoleculeList.removeItemRemovedListener( removalListener );
        }
      } );
    };

    model.mobileBiomoleculeList.forEach( bioMolecule => {
      addBiomoleculeView( bioMolecule );
    } );

    // Watch for and handle comings and goings of biomolecules in the model. Most, but not all, of the biomolecules are
    // handled by this. A few others are handled as special cases.
    model.mobileBiomoleculeList.addItemAddedListener( addedBiomolecule => {
      addBiomoleculeView( addedBiomolecule );
    } );

    // Watch for and handle comings and goings of messenger RNA.
    model.messengerRnaList.addItemAddedListener( addedMessengerRna => {

      const messengerRnaNode = new MessengerRnaNode( this.modelViewTransform, addedMessengerRna );
      messengerRnaLayer.addChild( messengerRnaNode );

      model.messengerRnaList.addItemRemovedListener( function removalListener( removedMessengerRna ) {
        if ( removedMessengerRna === addedMessengerRna ) {
          messengerRnaLayer.removeChild( messengerRnaNode );
          messengerRnaNode.dispose();
          model.messengerRnaList.removeItemRemovedListener( removalListener );
        }
      } );
    } );
  }

  /**
   * Step function for this view
   * @public
   */
  step() {
    this.dnaMoleculeNode.step();
  }
}

geneExpressionEssentials.register( 'MessengerRnaProductionScreenView', MessengerRnaProductionScreenView );
export default MessengerRnaProductionScreenView;