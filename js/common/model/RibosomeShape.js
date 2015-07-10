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
  var Matrix3 = require( 'DOT/Matrix3' );


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
    this.arrangeShape();
    this.computeBounds();
  }

  return inherit( Shape, RibosomeShape, {
    computeBounds: function() {
      var topBounds = this.topShape.computeBounds();
      var bottomBounds = this.bottomShape.computeBounds();
      this.bounds = topBounds.union( bottomBounds );
    },

    /**
     * Arranges the top and BottomShape (compensates for the lack of union boolean operation)
     * In Java version this was simply a Add of two areas (shapes)
     */
    arrangeShape: function() {
      var topBounds = this.topShape.bounds;
      var transform = Matrix3.translation( 0, topBounds.height/1.5 );
      this.bottomShape = this.bottomShape.transformed( transform );
    },


    transformed: function( matrix ) {
      this.topShape = this.topShape.transformed( matrix );
      this.bottomShape = this.bottomShape.transformed( matrix );
      this.arrangeShape();

      // create a new Instance of Shape, so the observers can detect change
      return new RibosomeShape( this.topShape, this.bottomShape );
    }


  } );


} );