// Copyright 2015, University of Colorado Boulder

/**
 * State where the mRNA is being destroyed.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/StillnessMotionStrategy' );

  /**
   * @constructor
   */
  function BeingDestroyedState() {
    AttachmentState.call( this );
  }

  geneExpressionEssentials.register( 'BeingDestroyedState', BeingDestroyedState );

  return inherit( AttachmentState, BeingDestroyedState, {

    /**
     * @Override
     * @param {AttachmentStateMachine}  enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {

      // Set a motion strategy that will not move this molecule, since its position will be defined by the destroyer and
      // translators.
      enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
    }
  } );
} );
