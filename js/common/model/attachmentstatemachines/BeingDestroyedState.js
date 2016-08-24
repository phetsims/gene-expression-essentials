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
    var inherit = require( 'PHET_CORE/inherit' );
    var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
    var StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/StillnessMotionStrategy' );

    /**
     * @constructor
   */
  function BeingDestroyedState() {
    AttachmentState.call( this );
  }

  return inherit( AttachmentState, BeingDestroyedState, {

    /**
     * @Override
     * @param {AttachmentStateMachine}  enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {

      // Set a motion strategy that will not move this molecule, since
      // its position will be defined by the destroyer and translators.
      enclosingStateMachine.biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
    }

  } );


} );
