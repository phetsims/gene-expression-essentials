// Copyright 2015-2017, University of Colorado Boulder

/**
 * Base class for the models used in this simulation. All models must extend from a common class so that the same
 * biomolecules can be used within each.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @abstract
   * @constructor
   */
  function GeneExpressionModel() {
    // does nothing in base class
  }

  geneExpressionEssentials.register( 'GeneExpressionModel', GeneExpressionModel );

  return inherit( Object, GeneExpressionModel, {

    /**
     * Get the DNA molecule.
     * @returns {DnaMolecule} - DNA molecule, null if none exists.
     * @public
     */
    getDnaMolecule: function() {
      throw new Error( 'getDnaMolecule should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Add a mobile biomolecule to the model. The model must send out the appropriate notifications.
     * @param {MobileBiomolecule} mobileBiomolecule
     * @public
     */
    addMobileBiomolecule: function( mobileBiomolecule ) {
      throw new Error( 'addMobileBiomolecule should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Add the specified messenger RNA strand to the model. The model must send out the appropriate notifications.
     * @param {MessengerRna} messengerRna
     * @public
     */
    addMessengerRna: function( messengerRna ) {
      throw new Error( 'addMessengerRna should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Remove the specified messenger RNA from the model.
     * @param {MessengerRna} messengerRnaBeingDestroyed
     * @public
     */
    removeMessengerRna: function( messengerRnaBeingDestroyed ) {
      throw new Error( 'removeMessengerRna should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Get a list of all messenger RNA strands that are currently in existence.
     * @returns {Array.<MessengerRna>}
     * @public
     */
    getMessengerRnaList: function() {
      throw new Error( 'getMessengerRnaList should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Get a list of all messenger biomolecules that overlap with the providedshape.
     * @param {Bounds2} testShapeBounds
     * @returns {Array.<MobileBiomolecule>}
     * @public
     */
    getOverlappingBiomolecules: function( testShapeBounds ) {
      throw new Error( 'getOverlappingBiomolecules should be implemented in descendant classes of GeneExpressionModel' );
    }
  } );
} );
