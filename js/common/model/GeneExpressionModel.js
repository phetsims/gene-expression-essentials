//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Base class for the models used in this simulation.  All models must extend
 * from a common class so that the sam biomolecules can be used within each.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );


  /**
   * @abstract
   * @constructor
   */
  function GeneExpressionModel(props) {
    PropertySet.call(this,props);
  }

  return inherit( PropertySet, GeneExpressionModel, {

    /**
     * Get the DNA molecule.
     *
     * @return {DnaMolecule} - DNA molecule, null if none exists.
     */
    getDnaMolecule: function() {
      throw new Error( 'getDnaMolecule should be implemented in descendant classes of GeneExpressionModel ' );
    },

    /**
     * Add a mobile biomolecule to the model.  The model must send out the
     * appropriate notifications.
     *
     * @param {MobileBiomolecule} mobileBiomolecule
     */
    addMobileBiomolecule: function( mobileBiomolecule ) {
      throw new Error( 'addMobileBiomolecule should be implemented in descendant classes of GeneExpressionModel .' );
    },

    /**
     * Add the specified messenger RNA strand to the model.  The model must
     * send out the appropriate notifications.
     *
     * @param {MessengerRna} messengerRna
     */
    addMessengerRna: function( messengerRna ) {
      throw new Error( 'addMessengerRna should be implemented in descendant classes of GeneExpressionModel .' );
    },

    /**
     * Remove the specified messenger RNA from the model.
     *
     * @param {MessengerRna} messengerRnaBeingDestroyed
     */
    removeMessengerRna: function( messengerRnaBeingDestroyed ) {
      throw new Error( 'removeMessengerRna should be implemented in descendant classes of GeneExpressionModel .' );
    },

    /**
     * Get a list of all messenger RNA strands that are currently in
     * existence.
     *
     * @return {Array<MessengerRna>}
     */
    getMessengerRnaList: function() {
      throw new Error( 'getMessengerRnaList should be implemented in descendant classes of GeneExpressionModel .' );
    },

    /**
     * Get a list of all messenger biomolecules that overlap with the provided
     * shape.
     * @param {Shape} testShape
     * @return {Array<MobileBiomolecule>}
     */
    getOverlappingBiomolecules: function( testShape ) {
      throw new Error( 'getOverlappingBiomolecules should be implemented in descendant classes of GeneExpressionModel .' );
    }

  } );

} );
