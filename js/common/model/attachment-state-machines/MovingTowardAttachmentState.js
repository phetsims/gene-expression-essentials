// Copyright 2017, University of Colorado Boulder

/**
 * One of the statesused in RibosomeAttachmentStateMachine and MRnaDestroyerAttachmentStateMachine. It has a unique
 * behavior as it directly set up to attached state.
 * It is set up like this due to https://github.com/phetsims/gene-expression-essentials/issues/24
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericMovingTowardsAttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericMovingTowardsAttachmentState' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @param  {AttachmentStateMachine} attachmentStateMachine
   */
  function MovingTowardAttachmentState( attachmentStateMachine ) {
    GenericMovingTowardsAttachmentState.call( this, attachmentStateMachine );
    this.attachmentStateMachine = attachmentStateMachine; //@public
  }

  geneExpressionEssentials.register( 'MovingTowardAttachmentState', MovingTowardAttachmentState );

  return inherit( GenericMovingTowardsAttachmentState, MovingTowardAttachmentState, {

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     * @public
     */
    step: function( enclosingStateMachine, dt ) {
      var gsm = enclosingStateMachine;

      // verify that state is consistent
      assert && assert( gsm.attachmentSite !== null );
      assert && assert( gsm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === this.genericAttachmentStateMachine.biomolecule );

      gsm.setState( gsm.attachedState );
    }
  } );
} );