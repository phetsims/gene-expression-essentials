// Copyright 2015-2017, University of Colorado Boulder

/**
 * Screen view for the Multiple Cells screen.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var CellProteinSynthesisSimulator = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/model/CellProteinSynthesisSimulator' );
  var Color = require( 'SCENERY/util/Color' );
  var ColorChangingCellNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/ColorChangingCellNode' );
  var ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/ControllerNode' );
  var ControlPanelNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/ControlPanelNode' );
  var FluorescentCellsPictureDialog = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/FluorescentCellsPictureDialog' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MultipleCellsModel = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/model/MultipleCellsModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var ProteinLevelChartNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/ProteinLevelChartNode' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var affinitiesString = require( 'string!GENE_EXPRESSION_ESSENTIALS/affinities' );
  var cellsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/cells' );
  var concentrationString = require( 'string!GENE_EXPRESSION_ESSENTIALS/concentration' );
  var degradationString = require( 'string!GENE_EXPRESSION_ESSENTIALS/degradation' );
  var fastString = require( 'string!GENE_EXPRESSION_ESSENTIALS/fast' );
  var highString = require( 'string!GENE_EXPRESSION_ESSENTIALS/high' );
  var lowString = require( 'string!GENE_EXPRESSION_ESSENTIALS/low' );
  var manyString = require( 'string!GENE_EXPRESSION_ESSENTIALS/many' );
  var mRnaDestroyerString = require( 'string!GENE_EXPRESSION_ESSENTIALS/mRnaDestroyer' );
  var oneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/one' );
  var polymeraseString = require( 'string!GENE_EXPRESSION_ESSENTIALS/polymerase' );
  var positiveTranscriptionFactorString = require( 'string!GENE_EXPRESSION_ESSENTIALS/positiveTranscriptionFactor' );
  var proteinString = require( 'string!GENE_EXPRESSION_ESSENTIALS/protein' );
  var showRealCellsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/showRealCells' );
  var slowString = require( 'string!GENE_EXPRESSION_ESSENTIALS/slow' );

  /**
   * @param {MultipleCellsModel} model
   * @constructor
   */
  function MultipleCellsScreenView( model ) {
    ScreenView.call( this );
    var self = this;
    this.model = model;

    // Set up the model-canvas transform. The multiplier factors for the 2nd point can be adjusted to shift the center
    // right or left, and the scale factor can be adjusted to zoom in or out (smaller numbers zoom out, larger ones zoom
    // in).
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.width * 0.455, this.layoutBounds.height * 0.56 ),
      1E8 // "zoom factor" - smaller zooms out, larger zooms in
    );

    // dialog constructed lazily because Dialog requires Sim bounds during construction
    var dialog = null;

    var buttonContent = new Text( showRealCellsString, {
      font: new PhetFont( 18 ),
      maxWidth: 140
    } );
    var showRealCellsButton = new RectangularPushButton( {
      content: buttonContent,
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      baseColor: 'yellow',
      cornerRadius: GEEConstants.CORNER_RADIUS,
      listener: function() {
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
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        concentrationControlPanel.expandedProperty.reset();
        affinityControlPanel.expandedProperty.reset();
        degradationControlPanel.expandedProperty.reset();
        self.proteinLevelChartNode.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    // Add play/pause button.
    var playPauseButton = new PlayPauseButton( model.clockRunningProperty, {
      radius: 23,
      touchAreaDilation: 5
    } );
    this.addChild( playPauseButton );

    var stepButton = new StepForwardButton( {
      playingProperty: model.clockRunningProperty,
      listener: function() {
        model.stepInTime( 0.016 );
        self.proteinLevelChartNode.addDataPoint( 0.016 );
      },
      radius: 15,
      touchAreaDilation: 5
    } );
    this.addChild( stepButton );

    playPauseButton.bottom = resetAllButton.bottom;
    stepButton.centerY = playPauseButton.centerY;

    var cellLayer = new Node();
    var invisibleCellLayer = new Node(); // for performance improvement load all cells at start of the sim
    this.addChild( cellLayer );

    var cellNumberController = new ControllerNode(
      model.numberOfVisibleCellsProperty,
      1,
      MultipleCellsModel.MaxCells,
      oneString,
      manyString
    );

    var cellNumberControllerNode = new Node();
    cellNumberControllerNode.addChild( cellNumberController );

    var cellNumberLabel = new Text( cellsString, {
      font: new PhetFont( { size: 15, weight: 'bold' } ),
      maxWidth: 100
    } );

    cellNumberControllerNode.addChild( cellNumberLabel );
    cellNumberLabel.centerX = cellNumberController.centerX;
    cellNumberLabel.bottom = cellNumberController.top - 5;

    var cellNumberControllerPanel = new Panel( cellNumberControllerNode, {
      cornerRadius: GEEConstants.CORNER_RADIUS,
      xMargin: 10,
      yMargin: 10,
      fill: new Color( 220, 236, 255 )
    } );

    this.addChild( cellNumberControllerPanel );
    cellNumberControllerPanel.bottom = resetAllButton.bottom;
    cellNumberControllerPanel.centerX = this.proteinLevelChartNode.centerX;

    var cellNodes = [];

    for ( var i = 0; i < model.cellList.length; i++ ) {
      var cellNode = new ColorChangingCellNode( model.cellList[ i ], this.modelViewTransform );
      cellNodes.push( cellNode );
      invisibleCellLayer.addChild( cellNode );
    }

    function addCellView( addedCellIndex ) {
      cellLayer.addChild( cellNodes[ addedCellIndex ] );

      model.visibleCellList.addItemRemovedListener( function removalListener( removedCell ) {
        var removedCellIndex = model.cellList.indexOf( removedCell );
        if ( removedCellIndex === addedCellIndex ) {
          cellLayer.removeChild( cellNodes[ addedCellIndex ] );
          model.visibleCellList.removeItemRemovedListener( removalListener );
          cellLayer.setScaleMagnitude( 1 );
          var scaleFactor = Math.min( ( cellNumberControllerPanel.top - self.proteinLevelChartNode.bottom ) / cellLayer.height, 1 );
          cellLayer.setScaleMagnitude( scaleFactor * 0.9 );
          cellLayer.centerX = self.proteinLevelChartNode.centerX;
          cellLayer.centerY = self.proteinLevelChartNode.bottom +
                              ( cellNumberControllerPanel.top - self.proteinLevelChartNode.bottom ) / 2;
        }
      } );
      cellLayer.setScaleMagnitude( 1 );
      var scaleFactor = Math.min( ( cellNumberControllerPanel.top - self.proteinLevelChartNode.bottom ) / cellLayer.height, 1 );
      cellLayer.setScaleMagnitude( scaleFactor * 0.9 );
      cellLayer.centerX = self.proteinLevelChartNode.centerX;
      cellLayer.centerY = self.proteinLevelChartNode.bottom +
                          ( cellNumberControllerPanel.top - self.proteinLevelChartNode.bottom ) / 2;

    }

    // Set up an observer of the list of cells in the model so that the view representations can come and go as needed.
    model.visibleCellList.addItemAddedListener( function( addedCell ) {
      addCellView( model.cellList.indexOf( addedCell ) );
    } );

    model.visibleCellList.forEach( function( cell ) {
      addCellView( model.cellList.indexOf( cell ) );
    } );

    var concentrationControllers = [
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

    var concentrationControlPanel = new ControlPanelNode(
      concentrationString,
      concentrationControllers
    );

    var affinityControllers = [
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

    var affinityControlPanel = new ControlPanelNode(
      affinitiesString,
      affinityControllers
    );

    var degradationControllers = [
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

    var degradationControlPanel = new ControlPanelNode(
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

    playPauseButton.bottom = resetAllButton.bottom;
    stepButton.centerY = playPauseButton.centerY;
    stepButton.right = degradationControlPanel.left - 20;
    playPauseButton.right = stepButton.left - 10;
  }

  geneExpressionEssentials.register( 'MultipleCellsScreenView', MultipleCellsScreenView );

  return inherit( ScreenView, MultipleCellsScreenView, {

    /**
     * Step function for the view
     * @param  {number} dt
     * @public
     */
    step: function( dt ) {
      if ( this.model.clockRunningProperty.get() ) {
        this.proteinLevelChartNode.addDataPoint( dt );
      }
    }
  } );
} );
