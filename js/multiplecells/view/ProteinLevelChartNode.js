// Copyright 2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var ColorChangingCellNode = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/ColorChangingCellNode' );
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
    var plot = new XYPlot({
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
      lineWidth: 2
    } );

    plot.addSeries( this.dataSeries, true );

    contentNode.addChild( plot );

    // graph title
    var titleNode = new Text( averageProteinLevelVsTimeString, {
      font: new PhetFont( { size: 16, weight: 'bold' } )
    } );

    contentNode.addChild( titleNode );
    titleNode.centerX = plot.centerX;
    titleNode.bottom = plot.top - 10;

    // x axis label
    var xLabel = new Text( timeString, {
      font: new PhetFont( { size: 12 } )
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
      font: new PhetFont( 12 )
    } );
    contentNode.addChild( lotsNode );
    lotsNode.centerY = proteinLevelColorKey.top;
    lotsNode.right = proteinLevelColorKey.left - 5;

    var noneNode = new Text( noneString, {
      font: new PhetFont( 12 )
    } );
    contentNode.addChild( noneNode );
    noneNode.centerY = proteinLevelColorKey.bottom;
    noneNode.right = proteinLevelColorKey.left - 5;

    var yLabelNode = new Text( averageProteinLevelString, {
      font: new PhetFont( 13 )
    } );
    yLabelNode.setRotation( 3 * Math.PI / 2 );

    yLabelNode.centerY = proteinLevelColorKey.centerY;
    yLabelNode.right = contentNode.left - 5;

    contentNode.addChild( yLabelNode );
    Panel.call( this, contentNode, {
      fill: 'gray',
      xMargin: 10,
      yMargin: 10

    } );
  }

  geneExpressionEssentials.register( 'ProteinLevelChartNode', ProteinLevelChartNode );
  return inherit( Panel, ProteinLevelChartNode, {
    addDataPoint: function( dt ) {
      this.simRunningTime = this.simRunningTime + dt;
      if ( this.simRunningTime - this.timeOffset > TIME_SPAN ) {
        // If the end of the chart has been reached, clear it.
        this.dataSeries.clear();
      }
      if ( this.dataSeries.getLength() === 0 ) {
        // This is the first data added after the most recent
        // clear, so record the time offset.
        this.timeOffset = this.simRunningTime;
      }
      // Add the data to the chart.
      this.dataSeries.addPoint( this.simRunningTime - this.timeOffset, this.averageProteinLevelProperty.get() );

    }
  } );
} );
//package edu.colorado.phet.geneexpressionbasics.multiplecells.view;
//
//import java.awt.BasicStroke;
//import java.awt.GradientPaint;
//import java.awt.geom.Dimension2D;
//import java.awt.geom.Rectangle2D;
//import java.text.DecimalFormat;
//import java.text.MessageFormat;
//
//import org.jfree.chart.ChartFactory;
//import org.jfree.chart.JFreeChart;
//import org.jfree.chart.axis.NumberAxis;
//import org.jfree.chart.plot.PlotOrientation;
//import org.jfree.chart.plot.XYPlot;
//import org.jfree.chart.renderer.xy.XYItemRenderer;
//import org.jfree.data.xy.XYDataset;
//import org.jfree.data.xy.XYSeries;
//import org.jfree.data.xy.XYSeriesCollection;
//
//import edu.colorado.phet.common.jfreechartphet.piccolo.JFreeChartNode;
//import edu.colorado.phet.common.phetcommon.model.clock.ClockAdapter;
//import edu.colorado.phet.common.phetcommon.model.clock.ClockEvent;
//import edu.colorado.phet.common.phetcommon.model.clock.IClock;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.IntegerRange;
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.colorado.phet.common.piccolophet.nodes.ControlPanelNode;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.common.piccolophet.nodes.kit.ZeroOffsetNode;
//import edu.colorado.phet.common.piccolophet.nodes.layout.VBox;
//import edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PPath;
//import edu.umd.cs.piccolo.nodes.PText;
//import edu.umd.cs.piccolo.util.PDimension;
//
//import static edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources.Strings.*;
//
///**
// * This class defines a PNode that displays the average protein level for a
// * population of cells.
// * <p/>
// * This wouldn't be too hard to generalize to make it work for any
// * Property<Double>, but it wasn't worth it at the time of the original
// * creation.
// *
// * @author John Blanco
// */
//public class ProteinLevelChartNode extends PNode {
//
//    private static final Dimension2D SIZE = new PDimension( 400, 200 );  // In screen coordinates, which is close to pixels.
//    private static final double TIME_SPAN = 30; // In seconds.
//    private static final IntegerRange PROTEIN_LEVEL_RANGE = new IntegerRange( 0, 170 );
//
//    private final XYSeries dataSeries = new XYSeries( "0" );
//    private double timeOffset = 0;
//
//    public ProteinLevelChartNode( final Property<Double> averageProteinLevelProperty, final IClock clock ) {
//        XYDataset dataSet = new XYSeriesCollection( dataSeries );
//        // Create the chart itself, i.e. the place where data will be shown.
//        JFreeChart chart = createXYLineChart( AVERAGE_PROTEIN_LEVEL_VS_TIME, TIME, null, dataSet, PlotOrientation.VERTICAL );
//
//        // Create and configure the x axis.
//        NumberAxis xAxis = new NumberAxis( MessageFormat.format( PATTERN__0VALUE__1UNITS, TIME, UNITS__S ) );
//        xAxis.setRange( 0, TIME_SPAN );
//        xAxis.setNumberFormatOverride( new DecimalFormat( "##" ) );
//        xAxis.setLabelFont( new PhetFont( 12 ) );
//        chart.getXYPlot().setDomainAxis( xAxis );
//
//        // Make the Y axis, and have it be essentially blank, since we are
//        // going to create our own custom label.
//        NumberAxis yAxis = new NumberAxis();
//        yAxis.setRange( PROTEIN_LEVEL_RANGE.getMin(), PROTEIN_LEVEL_RANGE.getMax() );
//        yAxis.setTickLabelsVisible( false ); // Y axis label is provided elsewhere.
//        yAxis.setTickMarksVisible( false );
//        chart.getXYPlot().setRangeAxis( yAxis );
//
//        // Embed the chart in a PNode.
//        JFreeChartNode jFreeChartNode = new JFreeChartNode( chart, false );
//        jFreeChartNode.setBounds( 0, 0, SIZE.getWidth(), SIZE.getHeight() );
//        jFreeChartNode.updateChartRenderingInfo();
//
//        // Create the Y axis label, which includes a key to the colors used to
//        // indicate the protein level in the cells.  The size an position are
//        // empirically determined and may need to change if the chart size
//        // changes.
//        PNode yAxisLabelNode = new YAxisLabel( jFreeChartNode.getFullBoundsReference().height * 0.65 );
//        yAxisLabelNode.setOffset( 0, 29 );
//
//        // Lay out the chart and the Y axis label in parent PNode.
//        PNode contents = new PNode();
//        contents.addChild( yAxisLabelNode );
//        jFreeChartNode.setOffset( yAxisLabelNode.getFullBoundsReference().width, 0 );
//        contents.addChild( jFreeChartNode );
//
//        // Put the content in a control panel node in order to give it a decent
//        // looking border.
//        addChild( new ControlPanelNode( contents ) );
//
//        clock.addClockListener( new ClockAdapter() {
//            @Override public void clockTicked( ClockEvent clockEvent ) {
//                if ( clock.getSimulationTime() - timeOffset > TIME_SPAN ) {
//                    // If the end of the chart has been reached, clear it.
//                    clear();
//                }
//                if ( dataSeries.getItemCount() == 0 ) {
//                    // This is the first data added after the most recent
//                    // clear, so record the time offset.
//                    timeOffset = clock.getSimulationTime();
//                }
//                // Add the data to the chart.
//                dataSeries.add( clock.getSimulationTime() - timeOffset, averageProteinLevelProperty.get() );
//            }
//        } );
//    }
//
//    /**
//     * Create the JFreeChart chart that will show the data and that will be
//     * contained by this node.
//     *
//     * @param title
//     * @param xAxisLabel
//     * @param yAxisLabel
//     * @param dataSet
//     * @param orientation
//     * @return
//     */
//    private static JFreeChart createXYLineChart( String title, String xAxisLabel, String yAxisLabel,
//                                                 XYDataset dataSet, PlotOrientation orientation ) {
//
//        if ( orientation == null ) {
//            throw new IllegalArgumentException( "Null 'orientation' argument." );
//        }
//
//        JFreeChart chart = ChartFactory.createXYLineChart(
//                title,
//                xAxisLabel,
//                yAxisLabel,
//                dataSet,
//                PlotOrientation.VERTICAL,
//                false, // legend
//                false, // tooltips
//                false // urls
//        );
//
//        // Set the stroke for the data line to be larger than the default.
//        XYPlot plot = chart.getXYPlot();
//        XYItemRenderer renderer = plot.getRenderer();
//        renderer.setStroke( new BasicStroke( 2f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_BEVEL ) );
//
//        return chart;
//    }
//
//    public void clear() {
//        // Clear the data series, which clears the chart.
//        dataSeries.clear();
//    }
//
//    // Convenience class for combining the elements of the label for the
//    // chart's y axis.
//
//    /**
//     * Convenience class for combining the elements of the label for the
//     * chart's y axis.
//     */
//    public static class YAxisLabel extends PNode {
//        public YAxisLabel( final double height ) {
//            // Labels for the top and bottom of the gradient key.
//            PText lotsLabel = new PText( GeneExpressionBasicsResources.Strings.LOTS );
//            lotsLabel.setFont( new PhetFont( 12 ) );
//            PText noneLabel = new PText( GeneExpressionBasicsResources.Strings.NONE );
//            noneLabel.setFont( new PhetFont( 12 ) );
//
//            // Create an invisible rectangle that will serve as a spacer for
//            // positioning the "None" and "Lots" labels.
//            PPath spacerRect = new PhetPPath( new Rectangle2D.Double( 0,
//                                                                      0,
//                                                                      Math.max( lotsLabel.getFullBoundsReference().width, noneLabel.getFullBoundsReference().width ) * 1.1,
//                                                                      height - lotsLabel.getFullBoundsReference().height / 2 - noneLabel.getFullBoundsReference().height / 2 ) );
//            spacerRect.setStroke( null );
//
//            // Box up the "Lots" and "None" labels with the spacer rect.
//            PNode tickLabelsNode = new VBox( 0, lotsLabel, spacerRect, noneLabel );
//
//            // Create a rectangle with a gradient that maps the amount of
//            // protein to a color.  Width is arbitrarily chosen.
//            PPath proteinLevelColorKey = new PhetPPath( new Rectangle2D.Double( 0, 0, 20, height ) );
//            proteinLevelColorKey.setStroke( new BasicStroke( 1 ) );
//            proteinLevelColorKey.setPaint( new GradientPaint( 0, (float) height, ColorChangingCellNode.NOMINAL_FILL_COLOR, 0, 0, ColorChangingCellNode.FLORESCENT_FILL_COLOR ) );
//
//            // Create the main label.
//            PNode mainLabel = new ZeroOffsetNode( new PText( GeneExpressionBasicsResources.Strings.AVERAGE_PROTEIN_LEVEL ) {{
//                setFont( new PhetFont( 14 ) );
//                rotate( -Math.PI / 2 );
//            }} );
//
//            // Add all the parts to the parent node.  Set this up so that the
//            // upper Y coordinate is based on the gradient rectangle and NOT
//            // the label.  This is done so that translation of the labels
//            // doesn't mess up the layout of the overall chart.
//            mainLabel.setOffset( 0, height / 2 - mainLabel.getFullBoundsReference().height / 2 );
//            addChild( mainLabel );
//            tickLabelsNode.setOffset( mainLabel.getFullBoundsReference().getMaxX(), height / 2 - tickLabelsNode.getFullBoundsReference().height / 2 );
//            addChild( tickLabelsNode );
//            proteinLevelColorKey.setOffset( tickLabelsNode.getFullBoundsReference().getMaxX() + 3, 0 );
//            addChild( proteinLevelColorKey );
//        }
//    }
//}
