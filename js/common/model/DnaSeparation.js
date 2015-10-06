// Copyright 2002-2015, University of Colorado Boulder
/**
 * Class that defines a separation of the DNA strand.  This is used when
 * forcing the DNA strand to separate in certain locations, which happens,
 * for instance, when RNA polymerase is attached and transcribing the DNA.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );


  //private  properties
  var amount = 0;// Actual amount of separation.  Starts at 0 and is generally grown over time toward target.

  /**
   *
   * @param {number} xPos  - X Position in model space where this separation should exist.
   * @param {number} targetAmount
   * @constructor
   */
  function DnaSeparation( xPos, targetAmount ) {
    this.xPos = xPos;// X Position in model space.
    this.targetAmount = targetAmount;
  }

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
      return amount;
    },

    /**
     *
     * @param {number} proportion
     */
    setProportionOfTargetAmount: function( proportion ) {
      amount = this.targetAmount * proportion;
    }

  } );


} );


// Copyright 2002-2014, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
///**
// * Class that defines a separation of the DNA strand.  This is used when
// * forcing the DNA strand to separate in certain locations, which happens,
// * for instance, when RNA polymerase is attached and transcribing the DNA.
// *
// * @author John Blanco
// */
//public class DnaSeparation {
//    private final double targetAmount;
//    private double xPos; // X Position in model space.
//    private double amount = 0; // Actual amount of separation.  Starts at 0 and is generally grown over time toward target.
//
//    /**
//     * Constructor.
//     *
//     * @param xPos         - X Position in model space where this separation should
//     *                     exist.
//     * @param targetAmount
//     */
//    public DnaSeparation( double xPos, double targetAmount ) {
//        this.xPos = xPos;
//        this.targetAmount = targetAmount;
//    }
//
//    public double getXPos() {
//        return xPos;
//    }
//
//    public void setXPos( double xPos ) {
//        this.xPos = xPos;
//    }
//
//    public double getAmount() {
//        return amount;
//    }
//
//    public void setProportionOfTargetAmount( double proportion ) {
//        assert proportion >= 0 && proportion <= 1;
//        amount = targetAmount * proportion;
//    }
//}
