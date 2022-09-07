// Copyright 2015-2022, University of Colorado Boulder

/**
 * Screen view for the Multiple Cells screen.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import { Color, Node, Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import GEEConstants from '../../common/GEEConstants.js';
import ControllerNode from '../../common/view/ControllerNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import CellProteinSynthesisSimulator from '../model/CellProteinSynthesisSimulator.js';
import MultipleCellsModel from '../model/MultipleCellsModel.js';
import ColorChangingCellNode from './ColorChangingCellNode.js';
import FluorescentCellsPictureDialog from './FluorescentCellsPictureDialog.js';
import ParameterControlAccordionBox from './ParameterControlAccordionBox.js';
import ProteinLevelChartNode from './ProteinLevelChartNode.js';

const affinitiesString = GeneExpressionEssentialsStrings.affinities;
const cellsString = GeneExpressionEssentialsStrings.cells;
const concentrationString = GeneExpressionEssentialsStrings.concentration;
const degradationString = GeneExpressionEssentialsStrings.degradation;
const fastString = GeneExpressionEssentialsStrings.fast;
const highString = GeneExpressionEssentialsStrings.high;
const lowString = GeneExpressionEssentialsStrings.low;
const manyString = GeneExpressionEssentialsStrings.many;
const mRnaDestroyerString = GeneExpressionEssentialsStrings.mRnaDestroyer;
const oneString = GeneExpressionEssentialsStrings.one;
const polymeraseString = GeneExpressionEssentialsStrings.polymerase;
const positiveTranscriptionFactorString = GeneExpressionEssentialsStrings.positiveTranscriptionFactor;
const proteinString = GeneExpressionEssentialsStrings.protein;
const showRealCellsString = GeneExpressionEssentialsStrings.showRealCells;
const slowString = GeneExpressionEssentialsStrings.slow;

class MultipleCellsScreenView extends ScreenView {

  /**
   * @param {MultipleCellsModel} model
   */
  constructor( model ) {
    super();
    const self = this;
    this.model = model;

    // Set up the model-view transform. The multiplier factors for the 2nd point can be adjusted to shift the center
    // right or left, and the scale factor can be adjusted to zoom in or out (smaller numbers zoom out, larger ones zoom
    // in).
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.width * 0.455, this.layoutBounds.height * 0.56 ),
      1E8 // "zoom factor" - smaller zooms out, larger zooms in
    );

    // dialog constructed lazily because Dialog requires Sim bounds during construction
    let dialog = null;

    const buttonContent = new Text( showRealCellsString, {
      font: new PhetFont( 18 ),
      maxWidth: 140
    } );
    const showRealCellsButton = new RectangularPushButton( {
      content: buttonContent,
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      baseColor: 'yellow',
      cornerRadius: GEEConstants.CORNER_RADIUS,
      listener: () => {
        if ( !dialog ) {
          dialog = new FluorescentCellsPictureDialog();
        }
        dialog.show();
      }
    } );

    showRealCellsButton.left = this.layoutBounds.minX + 10;
    showRealCellsButton.top = this.layoutBounds.minY + 10;
    this.addChild( showRealCellsButton );

    this.proteinLevelChartNode = new ProteinLevelChartNode( model.averageProteinLevelProperty );
    this.addChild( this.proteinLevelChartNode );
    this.proteinLevelChartNode.top = showRealCellsButton.top;
    this.proteinLevelChartNode.left = showRealCellsButton.right + 10;

    // Add the Reset All button.
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel user interactions
        model.reset();
        concentrationControlPanel.expandedProperty.reset();
        affinityControlPanel.expandedProperty.reset();
        degradationControlPanel.expandedProperty.reset();
        this.proteinLevelChartNode.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    // Add a time control node
    const timeControlNode = new TimeControlNode( model.clockRunningProperty, {
      playPauseStepButtonOptions: {
        playPauseButtonOptions: {
          radius: 23,
          touchAreaDilation: 5
        },
        stepForwardButtonOptions: {
          listener: () => {
            model.stepInTime( 0.016 );
            this.proteinLevelChartNode.addDataPoint( 0.016 );
          },
          radius: 15,
          touchAreaDilation: 5
        }
      }
    } );
    this.addChild( timeControlNode );

    const cellLayer = new Node();
    const invisibleCellLayer = new Node(); // for performance improvement load all cells at start of the sim
    this.addChild( cellLayer );

    const cellNumberController = new ControllerNode(
      model.numberOfVisibleCellsProperty,
      1,
      MultipleCellsModel.MaxCells,
      oneString,
      manyString
    );

    const cellNumberControllerNode = new Node();
    cellNumberControllerNode.addChild( cellNumberController );

    const cellNumberLabel = new Text( cellsString, {
      font: new PhetFont( { size: 15, weight: 'bold' } ),
      maxWidth: 100
    } );

    cellNumberControllerNode.addChild( cellNumberLabel );
    cellNumberLabel.centerX = cellNumberController.centerX;
    cellNumberLabel.bottom = cellNumberController.top - 5;

    const cellNumberControllerPanel = new Panel( cellNumberControllerNode, {
      cornerRadius: GEEConstants.CORNER_RADIUS,
      xMargin: 10,
      yMargin: 10,
      fill: new Color( 220, 236, 255 )
    } );

    this.addChild( cellNumberControllerPanel );
    cellNumberControllerPanel.bottom = resetAllButton.bottom;
    cellNumberControllerPanel.centerX = this.proteinLevelChartNode.centerX;

    const cellNodes = [];

    for ( let i = 0; i < model.cellList.length; i++ ) {
      const cellNode = new ColorChangingCellNode( model.cellList[ i ], this.modelViewTransform );
      cellNodes.push( cellNode );
      invisibleCellLayer.addChild( cellNode );
    }

    function addCellView( addedCellIndex ) {
      cellLayer.addChild( cellNodes[ addedCellIndex ] );

      model.visibleCellList.addItemRemovedListener( function removalListener( removedCell ) {
        const removedCellIndex = model.cellList.indexOf( removedCell );
        if ( removedCellIndex === addedCellIndex ) {
          cellLayer.removeChild( cellNodes[ addedCellIndex ] );
          model.visibleCellList.removeItemRemovedListener( removalListener );
          cellLayer.setScaleMagnitude( 1 );
          const scaleFactor = Math.min( ( cellNumberControllerPanel.top - self.proteinLevelChartNode.bottom ) / cellLayer.height, 1 );
          cellLayer.setScaleMagnitude( scaleFactor * 0.9 );
          cellLayer.centerX = self.proteinLevelChartNode.centerX;
          cellLayer.centerY = self.proteinLevelChartNode.bottom +
                              ( cellNumberControllerPanel.top - self.proteinLevelChartNode.bottom ) / 2;
        }
      } );
      cellLayer.setScaleMagnitude( 1 );
      const scaleFactor = Math.min( ( cellNumberControllerPanel.top - self.proteinLevelChartNode.bottom ) / cellLayer.height, 1 );
      cellLayer.setScaleMagnitude( scaleFactor * 0.9 );
      cellLayer.centerX = self.proteinLevelChartNode.centerX;
      cellLayer.centerY = self.proteinLevelChartNode.bottom +
                          ( cellNumberControllerPanel.top - self.proteinLevelChartNode.bottom ) / 2;

    }

    // Set up an observer of the list of cells in the model so that the view representations can come and go as needed.
    model.visibleCellList.addItemAddedListener( addedCell => {
      addCellView( model.cellList.indexOf( addedCell ) );
    } );

    model.visibleCellList.forEach( cell => {
      addCellView( model.cellList.indexOf( cell ) );
    } );

    const concentrationControllers = [
      {
        label: positiveTranscriptionFactorString,
        controlProperty: model.transcriptionFactorLevelProperty,
        minValue: CellProteinSynthesisSimulator.TranscriptionFactorCountRange.min,
        maxValue: CellProteinSynthesisSimulator.TranscriptionFactorCountRange.max,
        minLabel: lowString,
        maxLabel: highString,
        logScale: true
      },
      {
        label: mRnaDestroyerString,
        controlProperty: model.mRnaDegradationRateProperty,
        minValue: CellProteinSynthesisSimulator.MRNADegradationRateRange.min,
        maxValue: CellProteinSynthesisSimulator.MRNADegradationRateRange.max,
        minLabel: lowString,
        maxLabel: highString,
        logScale: true
      }
    ];

    const concentrationControlPanel = new ParameterControlAccordionBox(
      concentrationString,
      concentrationControllers
    );

    const affinityControllers = [
      {
        label: positiveTranscriptionFactorString,
        controlProperty: model.transcriptionFactorAssociationProbabilityProperty,
        minValue: CellProteinSynthesisSimulator.TFAssociationProbabilityRange.min,
        maxValue: CellProteinSynthesisSimulator.TFAssociationProbabilityRange.max,
        minLabel: lowString,
        maxLabel: highString,
        logScale: true
      },
      {
        label: polymeraseString,
        controlProperty: model.polymeraseAssociationProbabilityProperty,
        minValue: CellProteinSynthesisSimulator.PolymeraseAssociationProbabilityRange.min,
        maxValue: CellProteinSynthesisSimulator.PolymeraseAssociationProbabilityRange.max,
        minLabel: lowString,
        maxLabel: highString,
        logScale: false
      }
    ];

    const affinityControlPanel = new ParameterControlAccordionBox(
      affinitiesString,
      affinityControllers
    );

    const degradationControllers = [
      {
        label: proteinString,
        controlProperty: model.proteinDegradationRateProperty,
        minValue: CellProteinSynthesisSimulator.ProteinDegradationRange.min,
        maxValue: CellProteinSynthesisSimulator.ProteinDegradationRange.max,
        minLabel: slowString,
        maxLabel: fastString,
        logScale: false
      }
    ];

    const degradationControlPanel = new ParameterControlAccordionBox(
      degradationString,
      degradationControllers
    );

    this.addChild( concentrationControlPanel );
    this.addChild( affinityControlPanel );
    this.addChild( degradationControlPanel );

    concentrationControlPanel.right = this.layoutBounds.maxX - 10;
    concentrationControlPanel.top = this.layoutBounds.minY + 10;

    affinityControlPanel.right = concentrationControlPanel.right;
    affinityControlPanel.top = concentrationControlPanel.bottom + 10;

    degradationControlPanel.right = affinityControlPanel.right;
    degradationControlPanel.top = affinityControlPanel.bottom + 10;

    timeControlNode.bottom = resetAllButton.bottom;
    timeControlNode.right = degradationControlPanel.left - 20;
  }

  /**
   * Step function for the view
   * @param  {number} dt
   * @public
   */
  step( dt ) {
    if ( this.model.clockRunningProperty.get() ) {
      this.proteinLevelChartNode.addDataPoint( dt );
    }
  }
}

geneExpressionEssentials.register( 'MultipleCellsScreenView', MultipleCellsScreenView );
export default MultipleCellsScreenView;