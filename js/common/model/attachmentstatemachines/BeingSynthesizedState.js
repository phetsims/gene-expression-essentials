// Copyright 2015, University of Colorado Boulder
/**
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/StillnessMotionStrategy' );

  /**
   *
   * @constructor
   */
  function BeingSynthesizedState() {
    AttachmentState.call( this );
  }

  geneExpressionEssentials.register( 'BeingSynthesizedState', BeingSynthesizedState );

  return inherit( AttachmentState, BeingSynthesizedState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {

      // Set the motion strategy to something that doesn't move the molecule, since its position will be controlled by
      // the polymerase that is synthesizing it.
      enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
    }

  } );

} );
