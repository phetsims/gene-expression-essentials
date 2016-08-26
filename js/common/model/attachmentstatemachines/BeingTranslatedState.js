// Copyright 2015, University of Colorado Boulder
/**
 * State where the mRNA is wandering around the cell's cytoplasm unattached to anything.
 *
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

  function BeingTranslatedState() {
    AttachmentState.call( this );
  }

  geneExpressionEssentials.register( 'BeingTranslatedState', BeingTranslatedState );

  return inherit( AttachmentState, BeingTranslatedState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {

      // Set a motion strategy that will not move this molecule, since
      // its position will be defined by the translator(s).
      enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
    }

  } );

} );
