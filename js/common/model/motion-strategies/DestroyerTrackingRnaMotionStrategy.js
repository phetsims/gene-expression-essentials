// Copyright 2015-2017, University of Colorado Boulder

/**
 * This class defines a very specific motion strategy used by an mRNA destroyer to follow the attachment point of a
 * strand of mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @param messengerRnaDestroyer {MessengerRnaDestroyer}
   * @constructor
   */
  function DestroyerTrackingRnaMotionStrategy( messengerRnaDestroyer ) {
    MotionStrategy.call( this );
    this.messengerRna = messengerRnaDestroyer.getMessengerRnaBeingDestroyed(); //@private
  }

  geneExpressionEssentials.register( 'DestroyerTrackingRnaMotionStrategy', DestroyerTrackingRnaMotionStrategy );

  return inherit( MotionStrategy, DestroyerTrackingRnaMotionStrategy, {

    /**
     * @override
     * @param {Vector2} currentPosition
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     * @public
     */
    getNextPosition: function( currentPosition, bounds, dt ) {
      var generateInitialPosition3D = this.messengerRna.getDestroyerGenerateInitialPosition3D();
      return new Vector2( generateInitialPosition3D.x, generateInitialPosition3D.y );
    }
  } );
} );

