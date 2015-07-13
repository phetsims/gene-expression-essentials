// Copyright 2002-2014, University of Colorado Boulder

/**
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  return {

    isInt: function( n ) {
      return Number( n ) === n && n % 1 === 0;
    },

    isDouble: function( n ) {
      return n === Number( n ) && n % 1 !== 0;
    }

  };

} );