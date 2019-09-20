// Copyright 2015-2019, University of Colorado Boulder

/**
 * One of the states for MessengerRnaAttachmentStateMachine. In this state mRNA is wandering around the cell's cytoplasm
 * unattached to anything.
 *
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

  function BeingTranslatedState() {
    AttachmentState.call( this );
  }

  geneExpressionEssentials.register( 'BeingTranslatedState', BeingTranslatedState );

  return inherit( AttachmentState, BeingTranslatedState, {

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @public
     */
    entered: function( enclosingStateMachine ) {

      // Set a motion strategy that will not move this molecule, since its position will be defined by the translator(s).
      enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
    }
  } );
} );
