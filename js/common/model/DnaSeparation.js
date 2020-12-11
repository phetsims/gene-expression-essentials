// Copyright 2015-2020, University of Colorado Boulder

/**
 * Class that defines a separation of the DNA strand. This is used when forcing the DNA strand to separate in certain
 * positions, which happens, for instance, when RNA polymerase is attached and transcribing the DNA.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */


//modules
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class DnaSeparation {

  /**
   * @param {number} xPos  - X Position in model space where this separation should exist.
   * @param {number} targetAmount
   */
  constructor( xPos, targetAmount ) {
    this.xPos = xPos; // @private - x Position in model space
    this.targetAmount = targetAmount; // @private
    this.amount = 0;// @private - Actual amount of separation. Starts at 0 and is generally grown over time toward target.
  }

  /**
   * @returns {number}
   * @public
   */
  getXPosition() {
    return this.xPos;
  }

  /**
   * @param {number} xPos
   * @public
   */
  setXPosition( xPos ) {
    this.xPos = xPos;
  }

  /**
   * @returns {number}
   * @public
   */
  getAmount() {
    return this.amount;
  }

  /**
   * @param {number} proportion
   * @public
   */
  setProportionOfTargetAmount( proportion ) {
    this.amount = this.targetAmount * proportion;
  }
}

geneExpressionEssentials.register( 'DnaSeparation', DnaSeparation );

export default DnaSeparation;
