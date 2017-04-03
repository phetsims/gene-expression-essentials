// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

  // constants
  var DEFAULT_DETACH_TIME = 3; // In seconds.

  function GenericUnattachedButUnavailableState() {
    AttachmentState.call( this );
    this.detachCountdownTime = DEFAULT_DETACH_TIME;
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

      // Verify that state is consistent
      assert && assert( gsm.attachmentSite === null );

      // See if we've been detached long enough.
      this.detachCountdownTime -= dt;
      if ( this.detachCountdownTime <= 0 ) {

        // Move to the unattached-and-available state.
        gsm.setState( gsm.unattachedAndAvailableState );
      }
    },

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {
      this.detachCountdownTime = DEFAULT_DETACH_TIME;

      // Allow user interaction.
      enclosingStateMachine.biomolecule.movableByUserProperty.set( true );
    }
  } );
} );
