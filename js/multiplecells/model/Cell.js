// Copyright 2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var BioShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BioShapeUtils' );
  var Dimension2 = require('DOT/Dimension2');
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CellProteinSynthesisSimulator  = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/model/CellProteinSynthesisSimulator' );
  var ShapeChangingModelElement = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeChangingModelElement' );
  var Property = require( 'AXON/Property' );

  // Default size for a cell.
  var DEFAULT_CELL_SIZE = new Dimension2( 2E-6, 0.75E-6 ); // In meters.

  // Protein level at which the cell color starts to change. This is meant to make the cell act as though the protein
  // being produced is florescent.
  var PROTEIN_LEVEL_WHERE_COLOR_CHANGE_STARTS = 50;

  // Protein level at which the color change (towards the florescent color) is complete.
  var PROTEIN_LEVEL_WHERE_COLOR_CHANGE_COMPLETES = 150;

  function Cell( size, initialPosition, rotationAngle, seed ) {
    ShapeChangingModelElement.call( this, this.createShape( size, initialPosition, rotationAngle, seed ) );
    // This is a separate object in which the protein synthesis is simulated.
    // The reason that this is broken out into a separate class is that it was
    // supplied by someone outside of the PhET project, and this keeps it
    // encapsulated and thus easier for the original author to help maintain.
    this.proteinSynthesisSimulator = new CellProteinSynthesisSimulator( 100 );

    // Property that indicates the current protein count in the cell.  This
    // should not be set by external users, only monitored.
    this.proteinCount = new Property( 0 );


  }

  geneExpressionEssentials.register( 'Cell', Cell );

  return inherit( ShapeChangingModelElement, Cell, {

    stepInTime: function( dt ){
      // NOTE: Multiplying time step, because it was necessary to get the model to run at the needed rate.
      this.proteinSynthesisSimulator.stepInTime( dt * 1000 );//TODO Check why 1000
      this.proteinCount.set(this.proteinSynthesisSimulator.getProteinCount() );
    },

    // Static function for creating the shape of the cell.
    createShape: function( size, initialPosition, rotationAngle, seed ) {
      return BioShapeUtils.createEColiLikeShape( initialPosition, size.width, size.height, rotationAngle, seed );
    },

    //-------------------------------------------------------------------------
    // The following methods are essentially "pass through" methods to the
    // protein synthesis simulation.  This is kept separate for now.  At some
    // point, once the protein synthesis stuff is fully debugged, it may make
    // sense to pull the protein synthesis model into this class.
    //-------------------------------------------------------------------------

    setTranscriptionFactorCount: function( tfCount ) {
      this.proteinSynthesisSimulator.setTranscriptionFactorCount( tfCount );
    },

    setPolymeraseCount: function( polymeraseCount ) {
      this.proteinSynthesisSimulator.setPolymeraseCount( polymeraseCount );
    },

    setGeneTranscriptionFactorAssociationRate: function( newRate ) {
      this.proteinSynthesisSimulator.setGeneTranscriptionFactorAssociationRate( newRate );
    },

    setPolymeraseAssociationRate: function( newRate ) {
      this.proteinSynthesisSimulator.setPolymeraseAssociationRate( newRate );
    },

    setRNARibosomeAssociationRate: function( newRate ) {
      this.proteinSynthesisSimulator.setRNARibosomeAssociationRate( newRate );
    },

    setProteinDegradationRate: function( newRate ) {
      this.proteinSynthesisSimulator.setProteinDegradationRate( newRate );
    },

    setMRnaDegradationRate: function( mRnaDegradationRate ) {
      this.proteinSynthesisSimulator.setMrnaDegradationRate( mRnaDegradationRate );
    }

    //----------- End of pass-through methods ---------------------------------
  }, {//Statics
    DefaultCellSize: DEFAULT_CELL_SIZE,
    ProteinLevelWhereColorChangeStarts: PROTEIN_LEVEL_WHERE_COLOR_CHANGE_STARTS,
    ProteinLevelWhereColorChangeCompletes: PROTEIN_LEVEL_WHERE_COLOR_CHANGE_COMPLETES
  } );
} );
