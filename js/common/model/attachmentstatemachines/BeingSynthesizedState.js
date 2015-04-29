//  Copyright 2002-2014, University of Colorado Boulder
/**
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var StillnessMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/StillnessMotionStrategy' );

  function BeingSynthesizedState() {
    AttachmentState.call( this );
  }

  return inherit( AttachmentState, BeingSynthesizedState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {

      // Set the motion strategy to something that doesn't move the
      // molecule, since its position will be controlled by the polymerase
      // that is synthesizing it.
      enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
    }

  } );

} );
