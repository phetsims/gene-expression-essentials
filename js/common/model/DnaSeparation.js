// Copyright 2015, University of Colorado Boulder
/**
 * Class that defines a separation of the DNA strand. This is used when forcing the DNA strand to separate in certain
 * locations, which happens, for instance, when RNA polymerase is attached and transcribing the DNA.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {number} xPos  - X Position in model space where this separation should exist.
   * @param {number} targetAmount
   * @constructor
   */
  function DnaSeparation( xPos, targetAmount ) {
    this.xPos = xPos;// X Position in model space.
    this.targetAmount = targetAmount;
    this.amount = 0;// @private Actual amount of separation. Starts at 0 and is generally grown over time toward target.
  }

  geneExpressionEssentials.register( 'DnaSeparation', DnaSeparation );
  return inherit( Object, DnaSeparation, {

    /**
     *
     * @returns {number}
     */
    getXPos: function() {
      return this.xPos;
    },

    /**
     *
     * @param {number} xPos
     */
    setXPos: function( xPos ) {
      this.xPos = xPos;
    },

    /**
     *
     * @returns {number}
     */
    getAmount: function() {
      return this.amount;
    },

    /**
     *
     * @param {number} proportion
     */
    setProportionOfTargetAmount: function( proportion ) {
      this.amount = this.targetAmount * proportion;
    }

  } );


} );

