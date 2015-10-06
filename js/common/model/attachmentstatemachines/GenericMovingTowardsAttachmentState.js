// Copyright 2002-2015, University of Colorado Boulder
/**
 * @author John Blanco
 * @author Mohamed Safi
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );

  function GenericMovingTowardsAttachmentState() {
    AttachmentState.call( this );

  }

  return inherit( AttachmentState, GenericMovingTowardsAttachmentState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     */
    stepInTime: function( enclosingStateMachine, dt ) {
      var gsm = enclosingStateMachine;

      // Calculate the location where this biomolecule must be in order
      // to attach to the attachment site.
      var destination = new Vector2( gsm.attachmentSite.location.x - gsm.destinationOffset.x,
        gsm.attachmentSite.location.y - gsm.destinationOffset.y );

    //   console.log("Bio Molecule Position " + gsm.biomolecule.getPosition()+" destination " + destination + "offset  "+gsm.destinationOffset);

      // See if the attachment site has been reached.
      if ( gsm.biomolecule.getPosition().distance( destination ) < AttachmentState.ATTACHED_DISTANCE_THRESHOLD ) {

        // This molecule is now at the attachment site, so consider it // attached.
         gsm.setState( gsm.attachedState );
      }

    },


    /**
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {
      // Allow user interaction.
      enclosingStateMachine.biomolecule.movableByUser = true;
    }

  } );


} );