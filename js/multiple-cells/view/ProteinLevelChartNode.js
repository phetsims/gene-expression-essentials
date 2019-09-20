// Copyright 2015-2019, University of Colorado Boulder

/**
 * This class defines a node that displays the average protein level for a population of cells. It in turns call Griddle
 * library for drawing the graph
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const ColorChangingCellNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/ColorChangingCellNode' );
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const XYDataSeries = require( 'GRIDDLE/XYDataSeries' );
  const XYPlot = require( 'GRIDDLE/XYPlot' );

  // constants
  const PLOT_WIDTH = 400;
  const PLOT_HEIGHT = 120;
  const COLOR_KEY_WIDTH = 20;
  const TIME_SPAN = 30;

  // strings
  const averageProteinLevelString = require( 'string!GENE_EXPRESSION_ESSENTIALS/averageProteinLevel' );
  const averageProteinLevelVsTimeString = require( 'string!GENE_EXPRESSION_ESSENTIALS/averageProteinLevelVsTime' );
  const lotsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/lots' );
  const noneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/none' );
  const timeString = require( 'string!GENE_EXPRESSION_ESSENTIALS/time' );

  /**
   * @param {Property<number>} averageProteinLevelProperty
   * @constructor
   */
  function ProteinLevelChartNode( averageProteinLevelProperty ) {

    const contentNode = new Node();
    this.simRunningTime = 0;
    this.timeOffset = 0;
    this.averageProteinLevelProperty = averageProteinLevelProperty;
    const plot = new XYPlot( {
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
    const titleNode = new Text( averageProteinLevelVsTimeString, {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      maxWidth: PLOT_WIDTH
    } );

    contentNode.addChild( titleNode );
    titleNode.centerX = plot.centerX;
    titleNode.bottom = plot.top - 10;

    // x axis label
    const xLabel = new Text( timeString, {
      font: new PhetFont( { size: 12 } ),
      maxWidth: PLOT_WIDTH
    } );

    contentNode.addChild( xLabel );
    xLabel.centerX = plot.centerX;
    xLabel.top = plot.bottom + 10;

    // y axis label
    const proteinLevelColorKey = new Rectangle( plot.left, plot.top, COLOR_KEY_WIDTH, PLOT_HEIGHT, {
      fill: new LinearGradient( plot.left, plot.top, plot.left + COLOR_KEY_WIDTH, plot.top + PLOT_HEIGHT )
        .addColorStop( 0, ColorChangingCellNode.FlorescentFillColor )
        .addColorStop( 1, ColorChangingCellNode.NominalFillColor ),
      stroke: '#000',
      lineWidth: 1
    } );

    contentNode.addChild( proteinLevelColorKey );

    proteinLevelColorKey.top = plot.top;
    proteinLevelColorKey.right = plot.left - 5;

    const lotsNode = new Text( lotsString, {
      font: new PhetFont( 12 ),
      maxWidth: 50
    } );
    contentNode.addChild( lotsNode );
    lotsNode.centerY = proteinLevelColorKey.top;
    lotsNode.right = proteinLevelColorKey.left - 5;

    const noneNode = new Text( noneString, {
      font: new PhetFont( 12 ),
      maxWidth: 50
    } );
    contentNode.addChild( noneNode );
    noneNode.centerY = proteinLevelColorKey.bottom;
    noneNode.right = proteinLevelColorKey.left - 5;

    const yLabelNode = new Text( averageProteinLevelString, {
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
      this.simRunningTime += dt;
      if ( this.simRunningTime - this.timeOffset > TIME_SPAN ) {

        // if the end of the chart has been reached, clear it
        this.dataSeries.clear();
      }
      if ( this.dataSeries.getLength() === 0 ) {

        // This is the first data added after the most recent clear, so record the time offset.
        this.timeOffset = this.simRunningTime;
      }

      // add the data to the chart
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
