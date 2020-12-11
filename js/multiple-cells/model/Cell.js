// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model element that represents a cell on the "Multiple Cells" screen. The cell has a shape, a protein level, and a
 * number of parameters that control how it synthesizes protein molecules. Only one protein is synthesized.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import BioShapeUtils from '../../common/model/BioShapeUtils.js';
import ShapeChangingModelElement from '../../common/model/ShapeChangingModelElement.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import CellProteinSynthesisSimulator from './CellProteinSynthesisSimulator.js';

// Default size for a cell.
const DEFAULT_CELL_SIZE = new Dimension2( 2E-6, 0.75E-6 ); // In meters.

// Protein level at which the cell color starts to change. This is meant to make the cell act as though the protein
// being produced is florescent.
const PROTEIN_LEVEL_WHERE_COLOR_CHANGE_STARTS = 50;

// Protein level at which the color change (towards the florescent color) is complete.
const PROTEIN_LEVEL_WHERE_COLOR_CHANGE_COMPLETES = 150;

// Default E-Coli like shape for performance improvement and we make copy of it and rotate for different instances
const E_COLI_LLIKE_SHAPE = BioShapeUtils.createEColiLikeShape( DEFAULT_CELL_SIZE.width, DEFAULT_CELL_SIZE.height );

class Cell extends ShapeChangingModelElement {

  /**
   * @param {number} rotationAngle rotation for the cell in model space
   */
  constructor( rotationAngle ) {
    super( Cell.createShape( rotationAngle ) );

    // This is a separate object in which the protein synthesis is simulated. The reason that this is broken out into a
    // separate class is that it was supplied by someone outside of the PhET project, and this keeps it encapsulated and
    // thus easier for the original author to help maintain.
    this.proteinSynthesisSimulator = new CellProteinSynthesisSimulator( 100 ); // @private

    // Property that indicates the current protein count in the cell. This should not be set by external users, only
    // monitored.
    this.proteinCount = new Property( 0 ); // @public
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
    // NOTE: The time step is multiplied in order to get the model to run at the desired rate.
    this.proteinSynthesisSimulator.step( dt * 1000 );
    this.proteinCount.set( this.proteinSynthesisSimulator.getProteinCount() );
  }

  /**
   * Static function for creating the shape of the cell.
   * @param {number} rotationAngle
   * @returns {Shape}
   * @private
   */
  static createShape( rotationAngle ) {
    const eColiShape = E_COLI_LLIKE_SHAPE.copy();

    // rotate and return
    return eColiShape.transformed( Matrix3.rotation2( rotationAngle ) );
  }

  /*-----------------------------------------------------------------------------------------------------------------
   * The following methods are essentially "pass through" methods to the protein synthesis simulator. This is done to
   * allow proteinSynthesisSimulator to be a separate type.
   *---------------------------------------------------------------------------------------------------------------*/

  /**
   * @param {number} tfCount
   * @public
   */
  setTranscriptionFactorCount( tfCount ) {
    this.proteinSynthesisSimulator.setTranscriptionFactorCount( tfCount );
  }

  /**
   * @param {number} polymeraseCount
   * @public
   */
  setPolymeraseCount( polymeraseCount ) {
    this.proteinSynthesisSimulator.setPolymeraseCount( polymeraseCount );
  }

  /**
   * @param {number} newRate
   * @public
   */
  setGeneTranscriptionFactorAssociationRate( newRate ) {
    this.proteinSynthesisSimulator.setGeneTranscriptionFactorAssociationRate( newRate );
  }

  /**
   * @param {number} newRate
   * @public
   */
  setPolymeraseAssociationRate( newRate ) {
    this.proteinSynthesisSimulator.setPolymeraseAssociationRate( newRate );
  }

  /**
   * @param {number} newRate
   * @public
   */
  setRNARibosomeAssociationRate( newRate ) {
    this.proteinSynthesisSimulator.setRNARibosomeAssociationRate( newRate );
  }

  /**
   * @param {number} newRate
   * @public
   */
  setProteinDegradationRate( newRate ) {
    this.proteinSynthesisSimulator.setProteinDegradationRate( newRate );
  }

  /**
   * @param {number} mRnaDegradationRate
   * @public
   */
  setMRnaDegradationRate( mRnaDegradationRate ) {
    this.proteinSynthesisSimulator.setMrnaDegradationRate( mRnaDegradationRate );
  }

}


// statics
Cell.DefaultCellSize = DEFAULT_CELL_SIZE;
Cell.ProteinLevelWhereColorChangeStarts = PROTEIN_LEVEL_WHERE_COLOR_CHANGE_STARTS;
Cell.ProteinLevelWhereColorChangeCompletes = PROTEIN_LEVEL_WHERE_COLOR_CHANGE_COMPLETES;

geneExpressionEssentials.register( 'Cell', Cell );

export default Cell;