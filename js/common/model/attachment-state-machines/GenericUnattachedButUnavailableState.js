// Copyright 2015, University of Colorado Boulder

/**
 * GenericUnattachedButUnavailableState is a generic state when biomolecule is unattached but unavailable
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

  /**
   * @constructor
   */
  function GenericUnattachedButUnavailableState() {
    AttachmentState.call( this );
    this.detachCountdownTime = DEFAULT_DETACH_TIME; //@private
  }

  geneExpressionEssentials.register( 'GenericUnattachedButUnavailableState', GenericUnattachedButUnavailableState );

  return inherit( AttachmentState, GenericUnattachedButUnavailableState, {

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     * @public
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
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @public
     */
    entered: function( enclosingStateMachine ) {
      this.detachCountdownTime = DEFAULT_DETACH_TIME;

      // Allow user interaction.
      enclosingStateMachine.biomolecule.movableByUserProperty.set( true );
    }
  } );
} );
