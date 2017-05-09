// Copyright 2015, University of Colorado Boulder
define( function( require ) {
  'use strict';

  // modules
  var ColorChangingCellNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/ColorChangingCellNode' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var XYDataSeries = require( 'GRIDDLE/XYDataSeries' );
  var XYPlot = require( 'GRIDDLE/XYPlot' );

  // constants
  var PLOT_WIDTH = 400;
  var PLOT_HEIGHT = 120;
  var COLOR_KEY_WIDTH = 20;
  var TIME_SPAN = 30;

  // strings
  var lotsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/lots' );
  var noneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/none' );
  var averageProteinLevelString = require( 'string!GENE_EXPRESSION_ESSENTIALS/averageProteinLevel' );
  var averageProteinLevelVsTimeString = require( 'string!GENE_EXPRESSION_ESSENTIALS/averageProteinLevelVsTime' );
  var timeString = require( 'string!GENE_EXPRESSION_ESSENTIALS/time' );

  function ProteinLevelChartNode( averageProteinLevelProperty ) {

    var contentNode = new Node();
    this.simRunningTime = 0;
    this.timeOffset = 0;
    this.averageProteinLevelProperty = averageProteinLevelProperty;
    var plot = new XYPlot( {
      width: PLOT_WIDTH,
      height: PLOT_HEIGHT,
      minX: 0,
      maxX: 30,
      minY: 0,
      maxY: 170,
      showVerticalIntermediateLines: false,
      showXAxisTickMarkLabels: true,
      showHorizontalIntermediateLines: false,
      showYAxisTickMarkLabels: false,
      stepX: 2,
      stepY: 25,
      tickLabelFont: new PhetFont( 12 ),
      lineDash: [ 2, 1 ],
      showAxis: false
    } );

    this.dataSeries = new XYDataSeries( {
      color: PhetColorScheme.RED_COLORBLIND,
      stroke: PhetColorScheme.RED_COLORBLIND,
      lineWidth: 2,
      initialSize: 1800
    } );

    plot.addSeries( this.dataSeries, true );

    contentNode.addChild( plot );

    // graph title
    var titleNode = new Text( averageProteinLevelVsTimeString, {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      maxWidth: PLOT_WIDTH
    } );

    contentNode.addChild( titleNode );
    titleNode.centerX = plot.centerX;
    titleNode.bottom = plot.top - 10;

    // x axis label
    var xLabel = new Text( timeString, {
      font: new PhetFont( { size: 12 } ),
      maxWidth: PLOT_WIDTH
    } );

    contentNode.addChild( xLabel );
    xLabel.centerX = plot.centerX;
    xLabel.top = plot.bottom + 10;

    // y axis label
    var proteinLevelColorKey = new Rectangle( plot.left, plot.top, COLOR_KEY_WIDTH, PLOT_HEIGHT, {
      fill: new LinearGradient( plot.left, plot.top, plot.left + COLOR_KEY_WIDTH, plot.top + PLOT_HEIGHT )
        .addColorStop( 0, ColorChangingCellNode.FlorescentFillColor )
        .addColorStop( 1, ColorChangingCellNode.NominalFillColor ),
      stroke: '#000',
      lineWidth: 1
    } );

    contentNode.addChild( proteinLevelColorKey );

    proteinLevelColorKey.top = plot.top;
    proteinLevelColorKey.right = plot.left - 5;

    var lotsNode = new Text( lotsString, {
      font: new PhetFont( 12 ),
      maxWidth: 50
    } );
    contentNode.addChild( lotsNode );
    lotsNode.centerY = proteinLevelColorKey.top;
    lotsNode.right = proteinLevelColorKey.left - 5;

    var noneNode = new Text( noneString, {
      font: new PhetFont( 12 ),
      maxWidth: 50
    } );
    contentNode.addChild( noneNode );
    noneNode.centerY = proteinLevelColorKey.bottom;
    noneNode.right = proteinLevelColorKey.left - 5;

    var yLabelNode = new Text( averageProteinLevelString, {
      font: new PhetFont( 13 ),
      maxWidth: PLOT_HEIGHT + 10
    } );
    yLabelNode.setRotation( 3 * Math.PI / 2 );

    yLabelNode.centerY = proteinLevelColorKey.centerY;
    yLabelNode.right = contentNode.left - 5;

    contentNode.addChild( yLabelNode );
    Panel.call( this, contentNode, {
      cornerRadius: GEEConstants.CORNER_RADIUS,
      fill: 'lightgrey',
      xMargin: 10,
      yMargin: 10
    } );
  }

  geneExpressionEssentials.register( 'ProteinLevelChartNode', ProteinLevelChartNode );

  return inherit( Panel, ProteinLevelChartNode, {

    /**
     * @param {number} dt
     * @public
     */
    addDataPoint: function( dt ) {
      this.simRunningTime = this.simRunningTime + dt;
      if ( this.simRunningTime - this.timeOffset > TIME_SPAN ) {
        // If the end of the chart has been reached, clear it.
        this.dataSeries.clear();
      }
      if ( this.dataSeries.getLength() === 0 ) {
        // This is the first data added after the most recent clear, so record the time offset.
        this.timeOffset = this.simRunningTime;
      }
      // Add the data to the chart.
      this.dataSeries.addPoint( this.simRunningTime - this.timeOffset, this.averageProteinLevelProperty.get() );
    },

    /**
     * @public
     */
    reset: function() {
      this.simRunningTime = 0;
      this.timeOffset = 0;
      this.dataSeries.clear();
    }
  } );
} );
