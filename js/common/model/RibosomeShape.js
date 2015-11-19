// Copyright 2015, University of Colorado Boulder
/**
 *  The current Scenery Implementation doesnt support CAG (constructive Area Operations) so we create a
 *  composite Shape which includes the top and bottom portion of the Shapes as seperate shape instances.
 *
 *
 * @author Sharfudeen Ashraf
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Shape} topShape
   * @param {Shape} bottomShape
   * @constructor
   */
  function RibosomeShape( topShape, bottomShape ) {
    Shape.call( this );
    this.topShape = topShape;
    this.bottomShape = bottomShape;
   }

  return inherit( Shape, RibosomeShape, {

    /**
     * @override
     * @returns {Bounds2}
     */
    getBounds: function() {
      if ( !this.compositeBounds ) {
        this.compositeBounds = this.topShape.bounds.union( this.bottomShape.bounds );
      }
      return this.compositeBounds;
    },

    transformed: function( matrix ) {
      var newTopShape = this.topShape.transformed( matrix );
      var newBottomShape = this.bottomShape.transformed( matrix );
      // create a new Instance of Shape, so the observers can detect change
      return new RibosomeShape( newTopShape, newBottomShape );
    }

  } );


} );