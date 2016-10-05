// Copyright 2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Cell = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/model/Cell' );
  var CellProteinSynthesisSimulator = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/model/CellProteinSynthesisSimulator' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'Axon/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Random = require( 'DOT/Random' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var MAX_CELLS = 90;

  // Seeds for the random number generators.  Values chosen empirically.
  var POSITION_RANDOMIZER_SEED = 226;

  var SIZE_AND_ORIENTATION_RANDOMIZER_SEED = 5;

  function MultipleCellsModel() {
    var self = this;
    // List of all cells that are being simulated.  Some of these cells will be
    // visible to the user at any given time, but some may not.  All are
    // clocked and their parameters are kept the same in order to keep them
    // "in sync" with the visible cells.  This prevents large discontinuities
    // in the protein level when the user adds or removes cells.
    this.cellList = [];

    // List of cells in the model that should be visible to the user and that
    // are being used in the average protein level calculation.  It is
    // observable so that the view can track them coming and going.
    this.visibleCellList = new ObservableArray();

    // Property that controls the number of cells that are visible and that are
    // being included in the calculation of the average protein level.  This is
    // intended to be set by clients, such as the view.
    this.numberOfVisibleCells = new Property( 1 );

    // Properties used to control the rate at which protein is synthesized and
    // degraded in the cells.  These are intended to be set by clients, such as
    // the view.
    this.transcriptionFactorLevel = new Property( CellProteinSynthesisSimulator.DefaultTransciptionFactorCount );
    this.proteinDegradationRate = new Property( CellProteinSynthesisSimulator.DefaultProteinDegradationRate );
    this.transcriptionFactorAssociationProbability = new Property( CellProteinSynthesisSimulator.DefaultTFAssociationProbability );
    this.polymeraseAssociationProbability = new Property( CellProteinSynthesisSimulator.DefaultPolymeraseAssociationProbability );
    this.mRnaDegradationRate = new Property( CellProteinSynthesisSimulator.DefaultMRNADegradationRate );

    // Property that tracks the average protein level of all the cells.  This
    // should not be set externally, only internally.  From the external
    // perspective, it is intended for monitoring and displaying by view
    // components.
    this.averageProteinLevel = new Property( 0.0 );

    // Random number generators, used to vary the shape and position of the
    // cells.  Seeds are chosen based on experimentation.
    this.sizeAndRotationRandomizer = new Random( {
      seed: SIZE_AND_ORIENTATION_RANDOMIZER_SEED
    } );
    this.positionRandomizer = new Random( {
      seed: POSITION_RANDOMIZER_SEED
    } );

    // Add the max number of cells to the list of invisible cells.
    while ( this.cellList.length < MAX_CELLS ) {
      var newCell;
      if ( this.cellList.length === 0 ) {
        // The first cell is centered and level.
        newCell = new Cell( Cell.DefaultCellSize, new Vector2( 0, 0 ), 0, 0 );
      }
      else {
        // Do some randomization of the cell's size and rotation angle.
        var cellWidth = Math.max( Cell.DefaultCellSize.getWidth() * ( this.sizeAndRotationRandomizer.nextDouble() / 2 + 0.75 ),
          Cell.DefaultCellSize.getHeight() * 2 );
        // Note that the index is used as the seed for the shape in
        // order to make the cell appearance vary, but be deterministic.
        newCell = new Cell( new Dimension2( cellWidth, Cell.DefaultCellSize.getHeight() ),
          new Vector2( 0, 0 ),
          Math.PI * 2 * this.sizeAndRotationRandomizer.nextDouble(),
          this.cellList.length );
        this.placeCellInOpenLocation( newCell );
      }
      this.cellList.add( newCell );
    }

    // Hook up the property that controls the number of visible cells.
    this.numberOfVisibleCells.link( function( numVisibleCells ){
      assert && assert( numVisibleCells >= 1 && numVisibleCells <= MAX_CELLS );
      self.setNumVisibleCells( numVisibleCells );
    } );

    // Hook up the cell property parameters to the individual cells so that changes are propagated.
    this.transcriptionFactorLevel.link( function( transcriptionFactorLevel ) {
      self.cellList.forEach( function( cell ){
        cell.setTranscriptionFactorCount( transcriptionFactorLevel );
      } );
    } );

    this.polymeraseAssociationProbability.link( function( polymeraseAssociationProbability ){
      self.cellList.forEach( function( cell ) {
        cell.setPolymeraseAssociationRate( polymeraseAssociationProbability );
      } );
    } );

    this.transcriptionFactorAssociationProbability.link( function( transcriptionFactorAssociationProbability ){
      self.cellList.forEach( function( cell ) {
        cell.setGeneTranscriptionFactorAssociationRate( transcriptionFactorAssociationProbability );
      } );
    } );

    this.proteinDegradationRate.link( function( proteinDegradationRate ) {
      self.cellList.forEach( function( cell ) {
        cell.setProteinDegradationRate( proteinDegradationRate );
      } );
    } );

    this.mRnaDegradationRate.link( function( mRnaDegradationRate ) {
      self.cellList.forEach( function( cell ) {
        cell.setMRnaDegradationRate( mRnaDegradationRate );
      } );
    } );
  }

  return inherit( Object, MultipleCellsModel, {

    step: function( dt ) {
      // Step each of the cells.
      // Update the average protein level. Note that only the visible cells are used for this calculation. This helps
      // convey the concept that the more cells there are, the more even the average level is.

      var self = this;
      var totalProteinCount = 0;
      this.cellList.forEach( function( cell ){
        cell.stepInTime( dt );
        if ( self.visibleCellList.contains( cell ) ){
          totalProteinCount += cell.proteinCount.get();
        }
      } );
      this.averageProteinLevel.set( totalProteinCount / this.visibleCellList.length );
    },

    reset: function() {

      // Reset all the cell control parameters.
      this.numberOfVisibleCells.reset();
      this.transcriptionFactorLevel.reset();
      this.proteinDegradationRate.reset();
      this.transcriptionFactorAssociationProbability.reset();
      this.polymeraseAssociationProbability.reset();
      this.mRnaDegradationRate.reset();
      this.setNumVisibleCells( this.numberOfVisibleCells.get() );

      // Step the model a bunch of times in order to allow it to reach a
      // steady state.  The number of times that are needed to reach steady
      // state was empirically determined.
      for ( var i = 0; i < 1000; i++ ) {
        this.step( 0.016 );
      }
    },

    /**
     * Set the number of cells that should be visible to the user and that are
     * included in the calculation of average protein level.
     *
     * @param numCells - target number of cells.
     */
    setNumVisibleCells: function( numCells ) {

      assert && assert( numCells > 0 && numCells <= MAX_CELLS );  // Bounds checking.
      numCells = Util.clamp( numCells, 1,  MAX_CELLS ); // Defensive programming.

      if ( this.visibleCellList.length < numCells ) {
        // Add cells to the visible list.
        while ( this.visibleCellList.length < numCells ) {
          this.visibleCellList.add( this.cellList[ this.visibleCellList.length ] );
        }
      }
      else if ( this.visibleCellList.length > numCells ) {
        // Remove cells from the visible list.  Take them off the end.
        while ( this.visibleCellList.size() > numCells ) {
          this.visibleCellList.pop();
        }
      }
    },

    // Find a location for the given cell that doesn't overlap with other cells on the list.
    placeCellInOpenLocation: function( cell ) {
      // Loop, randomly generating positions of increasing distance from the center, until the cell is positioned in a
      // place that does not overlap with the existing cells. The overall bounding shape of the collection of cells is
      // elliptical, not circular.
      var boundingShapeWidth = Cell.DefaultCellSize.width() * 20;
      var boundingShapeHeight = boundingShapeWidth * 0.35;
      var bounds = new Bounds2( -boundingShapeWidth / 2, -boundingShapeHeight / 2,
        -boundingShapeWidth / 2 + boundingShapeWidth, -boundingShapeHeight / 2 + boundingShapeHeight );
      for ( var i = 0; i < Math.ceil( Math.sqrt( this.cellList.length ) ); i++ ) {
        var radius = ( i + 1 ) * Cell.DefaultCellSize.width * ( this.positionRandomizer.nextDouble() / 2 + .75 );
        for ( var j = 0; j < radius * Math.PI / ( Cell.DefaultCellSize.height * 2 ); j++ ) {
          var angle = this.positionRandomizer.nextDouble() * 2 * Math.PI;
          cell.setPosition( radius * Math.cos( angle ), radius * Math.sin( angle ) );
          if ( !bounds.contains( cell.getPosition() ) ) {
            // Not in bounds.
            continue;
          }
          var overlapDetected = false;
          this.cellList.forEach( function( existingCell ){
            if ( cell.getShape().intersectsBounds( existingCell.getShape().bounds ) ){
              overlapDetected = true;
              break;
            }
          } );

          if ( !overlapDetected ) {
            // Found an open spot.
            return;
          }
        }
      }
      System.out.println( "Warning: Exiting placement loop without having found open location." );
    }



  } );
} );
