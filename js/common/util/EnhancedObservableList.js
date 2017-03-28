// Copyright 2015, University of Colorado Boulder

/**
 * Class that defines an observable list with some additional methods that make it easier to get next and previous items
 * and to insert items before and after existing items.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  function EnhancedObservableList() {
    ObservableArray.call( this );
  }

  geneExpressionEssentials.register( 'EnhancedObservableList', EnhancedObservableList );

  return inherit( ObservableArray, EnhancedObservableList, {

    /**
     *
     * @param {Object} item
     * @returns {Object}
     */
    getNextItem: function( item ) {
      var index = this.indexOf( item );
      if ( index === -1 ) {
        throw new Error( 'Given item not in list' );
      }
      if ( index === this.length - 1 ) {
        // The given segment is the last element on the list, so null is returned.
        return null;
      }
      else {
        return this.get( index + 1 );
      }
    },

    /**
     *
     * @param {Object} item
     * @returns {Object}
     */
    getPreviousItem: function( item ) {
      var index = this.indexOf( item );
      if ( index === -1 ) {
        throw new Error( 'Given item not in list' );
      }
      if ( index === 0 ) {
        // The given segment is the first element on the list, so null is returned.
        return null;
      }
      else {
        return this.get( index - 1 );
      }
    },

    /**
     *
     * @param existingItem
     * @param itemToInsert
     */
    insertAfter: function( existingItem, itemToInsert ) {
      var index = this.indexOf( existingItem );
      if ( index === -1 ) {
        throw new Error( 'Given item not in list' );
      }
      this.splice( index + 1, 0, itemToInsert );
    },

    /**
     *
     * @param existingItem
     * @param itemToInsert
     */
    insertBefore: function( existingItem, itemToInsert ) {
      var index = this.indexOf( existingItem );
      if ( index === -1 ) {
        throw new Error( 'Given item not in list' );
      }
      this.splice( index, 0, itemToInsert );
    }
  } );
} );