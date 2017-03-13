// Copyright 2015, University of Colorado Boulder
/**
 * Base class for the models used in this simulation. All models must extend from a common class so that the same
 * biomolecules can be used within each.
 *
 * @author John Blanco
 * @author Mohamed Safi
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
  }

  geneExpressionEssentials.register( 'GeneExpressionModel', GeneExpressionModel );

  return inherit( Object, GeneExpressionModel, {

    /**
     * Get the DNA molecule.
     *
     * @return {DnaMolecule} - DNA molecule, null if none exists.
     */
    getDnaMolecule: function() {
      assert && assert( false, 'getDnaMolecule should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Add a mobile biomolecule to the model. The model must send out the appropriate notifications.
     *
     * @param {MobileBiomolecule} mobileBiomolecule
     */
    addMobileBiomolecule: function( mobileBiomolecule ) {
      assert && assert( false, 'addMobileBiomolecule should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Add the specified messenger RNA strand to the model. The model must send out the appropriate notifications.
     *
     * @param {MessengerRna} messengerRna
     */
    addMessengerRna: function( messengerRna ) {
      assert && assert( false, 'addMessengerRna should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Remove the specified messenger RNA from the model.
     *
     * @param {MessengerRna} messengerRnaBeingDestroyed
     */
    removeMessengerRna: function( messengerRnaBeingDestroyed ) {
      assert && assert( false, 'removeMessengerRna should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Get a list of all messenger RNA strands that are currently in existence.
     *
     * @return {Array<MessengerRna>}
     */
    getMessengerRnaList: function() {
      assert && assert( false, 'getMessengerRnaList should be implemented in descendant classes of GeneExpressionModel' );
    },

    /**
     * Get a list of all messenger biomolecules that overlap with the provided
     * shape.
     * @param {Bounds2} testShapeBounds
     * @return {Array<MobileBiomolecule>}
     */
    getOverlappingBiomolecules: function( testShapeBounds ) {
      assert && assert( false, 'getOverlappingBiomolecules should be implemented in descendant classes of GeneExpressionModel' );
    }

  } );

} );
