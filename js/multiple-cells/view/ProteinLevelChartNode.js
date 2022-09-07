// Copyright 2015-2022, University of Colorado Boulder

/**
 * This class defines a node that displays the average protein level for a population of cells. It in turns call Griddle
 * library for drawing the graph
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import Range from '../../../../dot/js/Range.js';
import DynamicSeries from '../../../../griddle/js/DynamicSeries.js';
import XYChartNode from '../../../../griddle/js/XYChartNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import GEEConstants from '../../common/GEEConstants.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import ColorChangingCellNode from './ColorChangingCellNode.js';

// constants
const PLOT_WIDTH = 400;
const PLOT_HEIGHT = 120;
const COLOR_KEY_WIDTH = 20;
const TIME_SPAN = 30;

const averageProteinLevelString = GeneExpressionEssentialsStrings.averageProteinLevel;
const averageProteinLevelVsTimeString = GeneExpressionEssentialsStrings.averageProteinLevelVsTime;
const lotsString = GeneExpressionEssentialsStrings.lots;
const noneString = GeneExpressionEssentialsStrings.none;
const timeString = GeneExpressionEssentialsStrings.time;

class ProteinLevelChartNode extends Panel {

  /**
   * @param {Property.<number>} averageProteinLevelProperty
   */
  constructor( averageProteinLevelProperty ) {

    const contentNode = new Node();

    const verticalRange = new Range( 0, 170 );
    const chart = new XYChartNode( {
      width: PLOT_WIDTH,
      height: PLOT_HEIGHT,
      cornerRadius: 0,

      defaultModelXRange: new Range( 0, 30 ),
      defaultModelYRange: verticalRange,

      majorHorizontalLineSpacing: verticalRange.max / 7,
      majorVerticalLineSpacing: 2,

      gridNodeOptions: {
        majorLineOptions: {
          lineDash: [ 2, 1 ],
          stroke: 'grey'
        }
      },

      showVerticalGridLabels: false,
      gridLabelOptions: {
        font: new PhetFont( 12 )
      }
    } );

    const dataSeries = new DynamicSeries( {
      color: PhetColorScheme.RED_COLORBLIND,
      lineWidth: 2,
      lineJoin: 'round'
    } );

    chart.addDynamicSeries( dataSeries );

    contentNode.addChild( chart );

    // graph title
    const titleNode = new Text( averageProteinLevelVsTimeString, {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      maxWidth: PLOT_WIDTH
    } );

    contentNode.addChild( titleNode );
    titleNode.centerX = chart.centerX;
    titleNode.bottom = chart.top - 10;

    // x axis label
    const xLabel = new Text( timeString, {
      font: new PhetFont( { size: 12 } ),
      maxWidth: PLOT_WIDTH
    } );

    contentNode.addChild( xLabel );
    xLabel.centerX = chart.centerX;
    xLabel.top = chart.bottom + 10;

    // y axis label
    const proteinLevelColorKey = new Rectangle( chart.left, chart.top, COLOR_KEY_WIDTH, PLOT_HEIGHT, {
      fill: new LinearGradient( chart.left, chart.top, chart.left + COLOR_KEY_WIDTH, chart.top + PLOT_HEIGHT )
        .addColorStop( 0, ColorChangingCellNode.FlorescentFillColor )
        .addColorStop( 1, ColorChangingCellNode.NominalFillColor ),
      stroke: '#000',
      lineWidth: 1
    } );

    contentNode.addChild( proteinLevelColorKey );

    proteinLevelColorKey.top = chart.top;
    proteinLevelColorKey.right = chart.left - 5;

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
    super( contentNode, {
      cornerRadius: GEEConstants.CORNER_RADIUS,
      fill: 'lightgrey',
      xMargin: 10,
      yMargin: 10
    } );

    // @private
    this.simRunningTime = 0;
    this.timeOffset = 0;
    this.averageProteinLevelProperty = averageProteinLevelProperty;
    this.dataSeries = dataSeries;
  }

  /**
   * @param {number} dt
   * @public
   */
  addDataPoint( dt ) {
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
    this.dataSeries.addXYDataPoint( this.simRunningTime - this.timeOffset, this.averageProteinLevelProperty.get() );
  }

  /**
   * @public
   */
  reset() {
    this.simRunningTime = 0;
    this.timeOffset = 0;
    this.dataSeries.clear();
  }
}

geneExpressionEssentials.register( 'ProteinLevelChartNode', ProteinLevelChartNode );
export default ProteinLevelChartNode;