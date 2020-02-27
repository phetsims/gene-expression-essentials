// Copyright 2015-2019, University of Colorado Boulder

/**
 * Class that defines a separation of the DNA strand. This is used when forcing the DNA strand to separate in certain
 * locations, which happens, for instance, when RNA polymerase is attached and transcribing the DNA.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */


//modules
import inherit from '../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

/**
 *
 * @param {number} xPos  - X Position in model space where this separation should exist.
 * @param {number} targetAmount
 * @constructor
 */
function DnaSeparation( xPos, targetAmount ) {
  this.xPos = xPos; // @private - x Position in model space
  this.targetAmount = targetAmount; // @private
  this.amount = 0;// @private - Actual amount of separation. Starts at 0 and is generally grown over time toward target.
}

geneExpressionEssentials.register( 'DnaSeparation', DnaSeparation );
export default inherit( Object, DnaSeparation, {

  /**
   * @returns {number}
   * @public
   */
  getXPosition: function() {
    return this.xPos;
  },

  /**
   * @param {number} xPos
   * @public
   */
  setXPosition: function( xPos ) {
    this.xPos = xPos;
  },

  /**
   * @returns {number}
   * @public
   */
  getAmount: function() {
    return this.amount;
  },

  /**
   * @param {number} proportion
   * @public
   */
  setProportionOfTargetAmount: function( proportion ) {
    this.amount = this.targetAmount * proportion;
  }
} );