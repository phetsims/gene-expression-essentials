// Copyright 2015, University of Colorado Boulder
/**
 * State where the mRNA is wandering around the cell's cytoplasm unattached
 * to anything.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/RandomWalkMotionStrategy' );

  /**
   * @constructor
   */
  function WanderingAroundCytoplasmState() {
    AttachmentState.call( this );
  }

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