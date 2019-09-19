// Copyright 2015-2017, University of Colorado Boulder

/**
 * One of the states for MessengerRnaAttachmentStateMachine. mRna enters this state when it is being synthesized.
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/StillnessMotionStrategy' );

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
