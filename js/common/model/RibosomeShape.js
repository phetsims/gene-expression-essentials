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

    /**
     * @override
     * @returns {Bounds2}
     */
    get bounds(){
      return this.compositeBounds;
    },


    computeBounds: function() {
      var topBounds = this.topShape.computeBounds();
      var bottomBounds = this.bottomShape.computeBounds();
      this.compositeBounds = topBounds.union( bottomBounds );
    },


    transformed: function( matrix ) {
      var newTopShape = this.topShape.transformed( matrix );
      var newBottomShape = this.bottomShape.transformed( matrix );
      // create a new Instance of Shape, so the observers can detect change
      return new RibosomeShape( newTopShape, newBottomShape );
    }

  } );


} );