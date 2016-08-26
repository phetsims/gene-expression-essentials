// Copyright 2015, University of Colorado Boulder
/**
 * The generic "attached" state isn't very useful, but is included for
 * ompleteness.  The reason it isn't useful is because the different
 * biomolecules all have their own unique behavior with respect to
 * attaching, and thus define their own attached states.
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

  // constants
  var DEFAULT_DETACH_TIME = 3; // In seconds.
  var detachCountdownTime = DEFAULT_DETACH_TIME;

  function GenericUnattachedButUnavailableState() {
    AttachmentState.call( this );
  }

  geneExpressionEssentials.register( 'GenericUnattachedButUnavailableState', GenericUnattachedButUnavailableState );

  return inherit( AttachmentState, GenericUnattachedButUnavailableState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     */
    stepInTime: function( enclosingStateMachine, dt ) {
      var gsm = enclosingStateMachine;

      // See if we've been detached long enough.
      detachCountdownTime -= dt;
      if ( detachCountdownTime <= 0 ) {

        // Move to the unattached-and-available state.
        gsm.setState( gsm.unattachedAndAvailableState );
      }
    },

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {
      detachCountdownTime = DEFAULT_DETACH_TIME;

      // Allow user interaction.
      enclosingStateMachine.biomolecule.movableByUser = true;
    }

  } );


} );
