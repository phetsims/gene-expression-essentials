// Copyright 2015, University of Colorado Boulder
/**
 * A factory class to create DnaMolecules with and without explicitly specifying a model.
 *
 * A separate class is created to accommodate constructor overloading in DnaMolecule class
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var DnaMolecule =  require( 'GENE_EXPRESSION_BASICS/common/model/DnaMolecule' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );

  var DnaMoleculeFactory = {

    /**
     * @param {GeneExpressionModel} model
     * @param {number} numBasePairs
     * @param {number} leftEdgeXOffset
     * @param {boolean} pursueAttachments
     */
    createDnaMoleculeByModel: function( model, numBasePairs, leftEdgeXOffset, pursueAttachments ) {
      return new DnaMolecule( model, numBasePairs, leftEdgeXOffset, pursueAttachments );
    },

    /**
     * Factory method that doesn't specify a model, so a stub model is created.
     * This is primarily for use in creating DNA likenesses on control panels.
     *
     * @param {number} numBasePairs
     * @param {number} leftEdgeXOffset
     * @param {boolean} pursueAttachments
     */
    createDnaMoleculeByStub: function( numBasePairs, leftEdgeXOffset, pursueAttachments ) {
      return this.createDnaMoleculeByModel( new StubGeneExpressionModel(), numBasePairs, leftEdgeXOffset, pursueAttachments );
    }
  };
  return DnaMoleculeFactory;
} );
