// Copyright 2015, University of Colorado Boulder

/**
 * State where the mRNA is wandering around the cell's cytoplasm unattached to anything.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/RandomWalkMotionStrategy' );

  /**
   * @constructor
   */
  function WanderingAroundCytoplasmState() {
    AttachmentState.call( this );
  }

  geneExpressionEssentials.register( 'WanderingAroundCytoplasmState', WanderingAroundCytoplasmState );
  return inherit( AttachmentState, WanderingAroundCytoplasmState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {
      enclosingStateMachine.biomolecule.setMotionStrategy(
        new RandomWalkMotionStrategy( enclosingStateMachine.biomolecule.motionBoundsProperty ) );
    }
  } );
} );