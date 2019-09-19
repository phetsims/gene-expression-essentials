// Copyright 2015-2017, University of Colorado Boulder

/**
 * Model element that represents a cell on the "Multiple Cells" screen. The cell has a shape, a protein level, and a
 * number of parameters that control how it synthesizes protein molecules. Only one protein is synthesized.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const BioShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BioShapeUtils' );
  const CellProteinSynthesisSimulator = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/model/CellProteinSynthesisSimulator' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Property = require( 'AXON/Property' );
  const ShapeChangingModelElement = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeChangingModelElement' );

  // Default size for a cell.
  const DEFAULT_CELL_SIZE = new Dimension2( 2E-6, 0.75E-6 ); // In meters.

  // Protein level at which the cell color starts to change. This is meant to make the cell act as though the protein
  // being produced is florescent.
  const PROTEIN_LEVEL_WHERE_COLOR_CHANGE_STARTS = 50;

  // Protein level at which the color change (towards the florescent color) is complete.
  const PROTEIN_LEVEL_WHERE_COLOR_CHANGE_COMPLETES = 150;

  // Default E-Coli like shape for performance improvement and we make copy of it and rotate for different instances
  const E_COLI_LLIKE_SHAPE = BioShapeUtils.createEColiLikeShape( DEFAULT_CELL_SIZE.width, DEFAULT_CELL_SIZE.height );

  /**
   * @param {number} rotationAngle rotation for the cell in model space
   * @constructor
   */
  function Cell( rotationAngle ) {
    ShapeChangingModelElement.call( this, this.createShape( rotationAngle ) );

    // This is a separate object in which the protein synthesis is simulated. The reason that this is broken out into a
    // separate class is that it was supplied by someone outside of the PhET project, and this keeps it encapsulated and
    // thus easier for the original author to help maintain.
    this.proteinSynthesisSimulator = new CellProteinSynthesisSimulator( 100 ); // @private

    // Property that indicates the current protein count in the cell. This should not be set by external users, only
    // monitored.
    this.proteinCount = new Property( 0 ); // @public
  }

  geneExpressionEssentials.register( 'Cell', Cell );

  return inherit( ShapeChangingModelElement, Cell, {

    /**
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      // NOTE: The time step is multiplied in order to get the model to run at the desired rate.
      this.proteinSynthesisSimulator.step( dt * 1000 );
      this.proteinCount.set( this.proteinSynthesisSimulator.getProteinCount() );
    },

    /**
     * Static function for creating the shape of the cell.
     * @param {number} rotationAngle
     * @returns {Shape}
     */
    createShape: function( rotationAngle ) {
      const eColiShape = E_COLI_LLIKE_SHAPE.copy();
      // rotate and return
      return eColiShape.transformed( Matrix3.rotation2( rotationAngle ) );
    },

    /*-----------------------------------------------------------------------------------------------------------------
     * The following methods are essentially "pass through" methods to the protein synthesis simulator. This is done to
     * allow proteinSynthesisSimulator to be a separate type.
     *---------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {number} tfCount
     * @public
     */
    setTranscriptionFactorCount: function( tfCount ) {
      this.proteinSynthesisSimulator.setTranscriptionFactorCount( tfCount );
    },

    /**
     * @param {number} polymeraseCount
     * @public
     */
    setPolymeraseCount: function( polymeraseCount ) {
      this.proteinSynthesisSimulator.setPolymeraseCount( polymeraseCount );
    },

    /**
     * @param {number} newRate
     * @public
     */
    setGeneTranscriptionFactorAssociationRate: function( newRate ) {
      this.proteinSynthesisSimulator.setGeneTranscriptionFactorAssociationRate( newRate );
    },

    /**
     * @param {number} newRate
     * @public
     */
    setPolymeraseAssociationRate: function( newRate ) {
      this.proteinSynthesisSimulator.setPolymeraseAssociationRate( newRate );
    },

    /**
     * @param {number} newRate
     * @public
     */
    setRNARibosomeAssociationRate: function( newRate ) {
      this.proteinSynthesisSimulator.setRNARibosomeAssociationRate( newRate );
    },

    /**
     * @param {number} newRate
     * @public
     */
    setProteinDegradationRate: function( newRate ) {
      this.proteinSynthesisSimulator.setProteinDegradationRate( newRate );
    },

    /**
     * @param {number} mRnaDegradationRate
     * @public
     */
    setMRnaDegradationRate: function( mRnaDegradationRate ) {
      this.proteinSynthesisSimulator.setMrnaDegradationRate( mRnaDegradationRate );
    }
  }, {

    // statics
    DefaultCellSize: DEFAULT_CELL_SIZE,
    ProteinLevelWhereColorChangeStarts: PROTEIN_LEVEL_WHERE_COLOR_CHANGE_STARTS,
    ProteinLevelWhereColorChangeCompletes: PROTEIN_LEVEL_WHERE_COLOR_CHANGE_COMPLETES
  } );
} );
