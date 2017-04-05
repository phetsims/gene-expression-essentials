// Copyright 2015, University of Colorado Boulder

/**
 * One of the state for MessengerRnaAttachmentStateMachine. mRna enters this state when it is being synthesized.
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/StillnessMotionStrategy' );

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
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @public
     */
    entered: function( enclosingStateMachine ) {
      // Set the motion strategy to something that doesn't move the molecule, since its position will be controlled by
      // the polymerase that is synthesizing it.
      enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
    }
  } );
} );
