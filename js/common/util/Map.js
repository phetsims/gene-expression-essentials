// Copyright 2015, University of Colorado Boulder

/**
 * This "map" utility supports HashMap like  functionality by allowing any object to be used as key. Equality is by
 * reference not by value
 * This class copied from sugar-and-salt-solutions //TODO
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @returns {{put: put, get: get, contains: contains, keySet: keySet}}
   * @constructor
   */
  function Map() {
    //@private
    this.keys = [];
    //@private
    this.values = [];
  }

  geneExpressionEssentials.register( 'Map', Map );

  return inherit( Object, Map, {
    /**
     * Adds the key and value pair to the hash map. If the key already exists it is updated by new value.
     * @param {Object} key
     * @param {Object} value
     * @public
     */
    put: function( key, value ) {
      var index = this.keys.indexOf( key );
      if ( index === -1 ) {
        this.keys.push( key );
        this.values.push( value );
      }
      else {
        this.values[ index ] = value;
      }
    },

    /**
     * Returns the value associated with the key
     * @param {Object} key
     * @returns {Object}
     * @public
     */
    get: function( key ) {
      return this.values[ this.keys.indexOf( key ) ];
    },

    /**
     * Checks if the key exists in the hash map
     * @param {Object} key
     * @returns {boolean}
     * @public
     */
    contains: function( key ) {
      return this.keys.indexOf( key ) !== -1;
    },

    /**
     * Removes the key and associated value from the hash map
     * @param {Object} key
     * @public
     */
    remove: function( key ) {
      var index = this.keys.indexOf( key );
      this.values.splice( index, 1 );
      this.keys.splice( index, 1 );
    },

    /**
     * Return the array of Keys
     * @returns {Array.<Object>}
     * @public
     */
    keySet: function() {
      return this.keys;
    },

    /**
     * Compares map object for equality
     * @param {Map} obj
     * @returns {boolean}
     * @public
     */
    equals: function( obj ) {
      return _.isEqual( this, obj );
    },

    /**
     * Reset the hash map
     * @public
     */
    clear: function() {
      this.keys = [];
      this.values = [];
    },

    /**
     * Check if the hash map is empty or not
     * @returns {boolean}
     * @public
     */
    isEmpty: function() {
      return this.keys.length === 0 && this.values.length === 0;
    }
  } );
} );