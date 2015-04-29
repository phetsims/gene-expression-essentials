//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Generic attachment state machine - just implements basic behavior.
 * <p/>
 * This class exists mainly for testing and for quick implementation of
 * biomolecules.  The code analyzer may show that it is unused, but it should
 * be kept around anyway for testing and prototyping of changes.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentStateMachine' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/WanderInGeneralDirectionMotionStrategy' );

  /**
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function GenericAttachmentStateMachine( biomolecule ) {
    AttachmentStateMachine.call( this, biomolecule );

    // States used by this state machine.  These are often set by subclasses
    // to non-default values in order to change the default behavior.
    this.unattachedAndAvailableState = AttachmentState.GenericUnattachedAndAvailableState();
    this.attachedState = AttachmentState.GenericAttachedState();
    this.movingTowardsAttachmentState = AttachmentState.GenericMovingTowardsAttachmentState();
    this.unattachedButUnavailableState = AttachmentState.GenericUnattachedButUnavailableState();
    this.setState( this.unattachedAndAvailableState );
  }

  return inherit( AttachmentStateMachine, GenericAttachmentStateMachine, {

    /**
     * @Override
     */
    detach: function() {
      this.attachmentSite.attachedOrAttachingMolecule.set( null );
      this.attachmentSite = null;
      this.forceImmediateUnattachedButUnavailable();
    },

    /**
     * @Override
     */
    forceImmediateUnattachedAndAvailable: function() {
      if ( this.attachmentSite !== null ) {
        this.attachmentSite.attachedOrAttachingMolecule.set( null );
      }
      this.attachmentSite = null;
      this.setState( this.unattachedAndAvailableState );
    },

    /**
     * @Override
     */
    forceImmediateUnattachedButUnavailable: function() {
      if ( this.attachmentSite !== null ) {
        this.attachmentSite.attachedOrAttachingMolecule.set( null );
      }
      this.attachmentSite = null;
      this.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy( this.biomolecule.getDetachDirection(),
        this.biomolecule.motionBoundsProperty ) );
      this.setState( this.unattachedButUnavailableState );
    }

  } );

} );
