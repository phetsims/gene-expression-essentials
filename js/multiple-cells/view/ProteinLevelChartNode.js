// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class defines a node that displays the average protein level for a population of cells. It in turns call Griddle
 * library for drawing the graph
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import Range from '../../../../dot/js/Range.js';
import DynamicSeries from '../../../../griddle/js/DynamicSeries.js';
import ScrollingChartNode from '../../../../griddle/js/ScrollingChartNode.js';
import inherit from '../../../../phet-core/js/inherit.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import Panel from '../../../../sun/js/Panel.js';
import GEEConstants from '../../common/GEEConstants.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import geneExpressionEssentialsStrings from '../../geneExpressionEssentialsStrings.js';
import ColorChangingCellNode from './ColorChangingCellNode.js';

// constants
const PLOT_WIDTH = 400;
const PLOT_HEIGHT = 120;
const COLOR_KEY_WIDTH = 20;
const TIME_SPAN = 30;

const averageProteinLevelString = geneExpressionEssentialsStrings.averageProteinLevel;
const averageProteinLevelVsTimeString = geneExpressionEssentialsStrings.averageProteinLevelVsTime;
const lotsString = geneExpressionEssentialsStrings.lots;
const noneString = geneExpressionEssentialsStrings.none;
const timeString = geneExpressionEssentialsStrings.time;

/**
 * @param {Property<number>} averageProteinLevelProperty
 * @constructor
 */
function ProteinLevelChartNode( averageProteinLevelProperty ) {

  const contentNode = new Node();
  this.simRunningTime = 0;
  this.timeOffset = 0;
  this.averageProteinLevelProperty = averageProteinLevelProperty;


  const verticalRange = new Range( 0, 170 );
  const plot = new ScrollingChartNode( {
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

  this.dataSeries = new DynamicSeries( {
    color: PhetColorScheme.RED_COLORBLIND,
    lineWidth: 2,
    lineJoin: 'round'
  } );

  plot.addDynamicSeries( this.dataSeries );

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

inherit( Panel, ProteinLevelChartNode, {

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
    this.dataSeries.addXYDataPoint( this.simRunningTime - this.timeOffset, this.averageProteinLevelProperty.get() );
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

export default ProteinLevelChartNode;