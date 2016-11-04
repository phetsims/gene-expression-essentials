// Copyright 2015, University of Colorado Boulder
define( function( require ) {
  'use strict';

  // modules
  var CellProteinSynthesisSimulator = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/model/CellProteinSynthesisSimulator' );
  var ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/ControllerNode' );
  var ControlPanelNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/ControlPanelNode' );
  var ColorChangingCellNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/ColorChangingCellNode' );
  var FluorescentCellsPictureDialog = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/FluorescentCellsPictureDialog' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MultipleCellsModel = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/model/MultipleCellsModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var ProteinLevelChartNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/ProteinLevelChartNode' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  //strings
  var showRealCellsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/showRealCells' );
  var highString = require( 'string!GENE_EXPRESSION_ESSENTIALS/high' );
  var lowString = require( 'string!GENE_EXPRESSION_ESSENTIALS/low' );
  var proteinString = require( 'string!GENE_EXPRESSION_ESSENTIALS/protein' );
  var slowString = require( 'string!GENE_EXPRESSION_ESSENTIALS/slow' );
  var fastString = require( 'string!GENE_EXPRESSION_ESSENTIALS/fast' );
  var degradationString = require( 'string!GENE_EXPRESSION_ESSENTIALS/degradation' );
  var positiveTranscriptionFactorString = require( 'string!GENE_EXPRESSION_ESSENTIALS/positiveTranscriptionFactor' );
  var mRnaDestroyerString = require( 'string!GENE_EXPRESSION_ESSENTIALS/mRnaDestroyer' );
  var oneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/one' );
  var manyString = require( 'string!GENE_EXPRESSION_ESSENTIALS/many' );
  var polymeraseString = require( 'string!GENE_EXPRESSION_ESSENTIALS/polymerase' );
  var concentrationsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/concentrations' );
  var affinitiesString = require( 'string!GENE_EXPRESSION_ESSENTIALS/affinities' );

  function MultipleCellsScreenView( model ) {
    ScreenView.call( this );
    var self = this;
    // Set up the model-canvas transform.
    // IMPORTANT NOTES: The multiplier factors for the 2nd point can be
    // adjusted to shift the center right or left, and the scale factor
    // can be adjusted to zoom in or out (smaller numbers zoom out, larger
    // ones zoom in).
    this.mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.width * 0.455, self.layoutBounds.height * 0.56 ),
      1E8 ); // "Zoom factor" - smaller zooms out, larger zooms in.

    var cellLayer = new Node();
    this.addChild( cellLayer );

    var cellNodes = [];

    for( var i = 0; i < model.cellList.length; i++  ){
      var cellNode = new ColorChangingCellNode( model.cellList[ i ], self.mvt );
      cellNodes.push( cellNode );
    }

    function addCellView( addedCellIndex ){
      cellLayer.addChild( cellNodes[ addedCellIndex ] );

      model.visibleCellList.addItemRemovedListener( function removalListener( removedCell ) {
        var removedCellIndex = model.cellList.indexOf( removedCell );
        if ( removedCellIndex === addedCellIndex ) {
          cellLayer.removeChild( cellNodes[ addedCellIndex ] );
          model.visibleCellList.removeItemRemovedListener( removalListener );
          cellLayer.setScaleMagnitude( 1 );
          var scaleFactor = Math.min( ( self.layoutBounds.width * 0.3 ) / cellLayer.width , 1 );
          cellLayer.setScaleMagnitude( scaleFactor );
          cellLayer.centerX = self.layoutBounds.width / 2;
          cellLayer.centerY = self.layoutBounds.height / 2;
        }
      } );
      cellLayer.setScaleMagnitude( 1 );
      var scaleFactor = Math.min( ( self.layoutBounds.width * 0.3 ) / cellLayer.width , 1 );
      cellLayer.setScaleMagnitude( scaleFactor );
      cellLayer.centerX = self.layoutBounds.width / 2;
      cellLayer.centerY = self.layoutBounds.height / 2;
    }

    // Set up an observer of the list of cells in the model so that the
    // view representations can come and go as needed.
    model.visibleCellList.addItemAddedListener( function( addedCell ) {
      addCellView( model.cellList.indexOf( addedCell ) );
    } );

    model.visibleCellList.forEach( function( cell ) {
      addCellView( model.cellList.indexOf( cell ) );
    } );



    this.createFluorescentCellsPictureDialog = function() {
      this.fluorescentCellsPictureDialog = new FluorescentCellsPictureDialog(); // @private
    };

    var buttonContent = new Text( showRealCellsString, { font: new PhetFont( 18 ) } );
    var showRealCellsButton = new RectangularPushButton( {
      content: buttonContent,
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      listener: function() {
        self.fluorescentCellsPictureDialog.show();
      }
    } );
    showRealCellsButton.left = this.layoutBounds.minX + 10;
    showRealCellsButton.top = this.layoutBounds.minY + 10;
    this.addChild( showRealCellsButton );

    var proteinLevelChartNode = new ProteinLevelChartNode();
    this.addChild( proteinLevelChartNode );
    proteinLevelChartNode.top = showRealCellsButton.top;
    proteinLevelChartNode.left = showRealCellsButton.right + 10;
    // Add play/pause button.
    var playPauseButton = new PlayPauseButton( model.clockRunningProperty, {
      radius: 23,
      touchAreaDilation: 5
    } );
    this.addChild( playPauseButton );

    var stepButton = new StepForwardButton( {
      playingProperty: model.clockRunningProperty,
      listener: function() {  },//TODO
      radius: 15,
      touchAreaDilation: 5
    } );
    this.addChild( stepButton );

    // Add the Reset All button.
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    playPauseButton.bottom = resetAllButton.bottom;
    stepButton.centerY = playPauseButton.centerY;
    //TODO X Position of these buttons

    var cellNumberController = new ControllerNode(
      model.numberOfVisibleCellsProperty,
      1,
      MultipleCellsModel.MaxCells,
      oneString,
      manyString
    );

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
      concentrationsString,
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

    var cellNumberControllerPanel = new Panel( cellNumberController );
    this.addChild( cellNumberControllerPanel );
    cellNumberControllerPanel.bottom = resetAllButton.bottom;
    cellNumberControllerPanel.centerX = cellLayer.centerX;


  }

  geneExpressionEssentials.register( 'MultipleCellsScreenView', MultipleCellsScreenView );
  return inherit( ScreenView, MultipleCellsScreenView, {
    /**
     * Step function for the view
     *
     * @param  {type} dt description
     * @return {type}    description
     */
    step: function( dt ) {

      // if the spectrum window hasn't been created yet, try to create it on this frame
      // spectrum window is only created once so that we don't have to draw the nodes in the dialog
      // every time it is shown, which takes a noticeable amount of time on tablets
      if( !this.fluorescentCellsPictureDialog ) {
        this.createFluorescentCellsPictureDialog();
      }
    }
  } );
} );
