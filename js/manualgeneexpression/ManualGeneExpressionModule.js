// Copyright 2015, University of Colorado Boulder
/**
 * Main module for the tab where the user manually performs the steps for
 * expressing proteins within a cell.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ManualGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/ManualGeneExpressionModel' );
  var ManualGeneExpressionCanvas;

  // constants
  var ZOOM_ANIMATION_TIME = 2000; // In milliseconds.

  function ManualGeneExpressionModule( model ) {

    model = model || new ManualGeneExpressionModel();
    //Module.call( this.name, model.getClock() );
    this.model = model;
    this.canvas = new ManualGeneExpressionCanvas( model );
    this.setSimulationPanel( this.canvas );
    this.reset();
    this.setClockControlPanel( null );

  }

  return inherit( Object, ManualGeneExpressionModule, {

    setCanvasZoomedIn: function( isZoomedIn ) {
      if ( isZoomedIn ) {
        this.canvas.zoomIn( ZOOM_ANIMATION_TIME );
      }
      else {
        this.canvas.zoomOut( ZOOM_ANIMATION_TIME );
      }
    },

    reset: function() {
      this.model.reset();
      this.canvas.reset();
    }

  } );


} );
// Copyright 2002-2014, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.manualgeneexpression;
//
//import edu.colorado.phet.common.phetcommon.application.Module;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model.ManualGeneExpressionModel;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.view.ManualGeneExpressionCanvas;
//
///**
// * Main module for the tab where the user manually performs the steps for
// * expressing proteins within a cell.
// *
// * @author John Blanco
// */
//public class ManualGeneExpressionModule extends Module {
//
//    private static final long ZOOM_ANIMATION_TIME = 2000; // In milliseconds.
//
//    private final ManualGeneExpressionModel model;
//    private final ManualGeneExpressionCanvas canvas;
//
//    public ManualGeneExpressionModule( String name ) {
//        this( name, new ManualGeneExpressionModel() );
//        setClockControlPanel( null );
//    }
//
//    private ManualGeneExpressionModule( String name, ManualGeneExpressionModel model ) {
//        super( name, model.getClock() );
//        this.model = model;
//        canvas = new ManualGeneExpressionCanvas( model );
//        setSimulationPanel( canvas );
//        reset();
//    }
//
//    public void setCanvasZoomedIn( boolean isZoomedIn ) {
//        if ( isZoomedIn ) {
//            canvas.zoomIn( ZOOM_ANIMATION_TIME );
//        }
//        else {
//            canvas.zoomOut( ZOOM_ANIMATION_TIME );
//        }
//    }
//
//    public ObservableProperty<Double> getCanvasZoomedInProperty() {
//        return canvas.getZoomedInProperty();
//    }
//
//    @Override public void reset() {
//        model.reset();
//        canvas.reset();
//    }
//}
