//  Copyright 2002-2014, University of Colorado Boulder
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
    this.computeBounds();
  }

  return inherit( Shape, RibosomeShape, {
    computeBounds: function() {
      var topBounds = this.topShape.computeBounds();
      var bottomBounds = this.bottomShape.computeBounds();
      this.bounds = topBounds.union( bottomBounds );
    },


    transformed: function( matrix ) {
      this.topShape = this.topShape.transformed( matrix );
      this.bottomShape = this.bottomShape.transformed( matrix );
      // create a new Instance of Shape, so the observers can detect change
      return new RibosomeShape( this.topShape, this.bottomShape );
    }


  } );


} );