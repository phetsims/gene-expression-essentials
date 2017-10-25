// Copyright 2015-2017, University of Colorado Boulder

/**
 * Motion strategy that has no motion, i.e. causes the user to be still.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );

  /**
   * @constructor
   */
  function StillnessMotionStrategy() {
    MotionStrategy.call( this );
  }

  geneExpressionEssentials.register( 'StillnessMotionStrategy', StillnessMotionStrategy );

  return inherit( MotionStrategy, StillnessMotionStrategy, {

    /**
     * @override
     * @param {Vector2} currentPosition
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     * @public
     */
    getNextPosition: function( currentPosition, bounds, dt ) {
      return currentPosition;
    }
  } );
} );