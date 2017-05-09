// Copyright 2015, University of Colorado Boulder

/**
 * Generic attachment state machine - just implements basic behavior.
 * This class exists mainly for testing and for quick implementation of biomolecules. The code analyzer may show that it
 * is unused, but it should be kept around anyway for testing and prototyping of changes.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentStateMachine' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericAttachedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericAttachedState' );
  var GenericMovingTowardsAttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericMovingTowardsAttachmentState' );
  var GenericUnattachedAndAvailableState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericUnattachedAndAvailableState' );
  var GenericUnattachedButUnavailableState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericUnattachedButUnavailableState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/WanderInGeneralDirectionMotionStrategy' );

  /**
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function GenericAttachmentStateMachine( biomolecule ) {
    AttachmentStateMachine.call( this, biomolecule );

    // States used by this state machine. These are often set by subclasses to non-default values in order to change the
    // default behavior.
    this.unattachedAndAvailableState = new GenericUnattachedAndAvailableState(); //@public
    this.attachedState = new GenericAttachedState(); //@public
    this.movingTowardsAttachmentState = new GenericMovingTowardsAttachmentState( this ); //@public
    this.unattachedButUnavailableState = new GenericUnattachedButUnavailableState(); //@public
    this.setState( this.unattachedAndAvailableState );
  }

  geneExpressionEssentials.register( 'GenericAttachmentStateMachine', GenericAttachmentStateMachine );

  return inherit( AttachmentStateMachine, GenericAttachmentStateMachine, {

    /**
     * @override
     * @public
     */
    detach: function() {
      assert && assert( this.attachmentSite !== null ); // Verify internal state is consistent
      this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      this.attachmentSite = null;
      this.forceImmediateUnattachedButUnavailable();
    },

    /**
     * @override
     * @public
     */
    forceImmediateUnattachedAndAvailable: function() {
      if ( this.attachmentSite !== null ) {
        this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      }
      this.attachmentSite = null;
      this.setState( this.unattachedAndAvailableState );
    },

    /**
     * @override
     * @public
     */
    forceImmediateUnattachedButUnavailable: function() {
      if ( this.attachmentSite !== null ) {
        this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      }
      this.attachmentSite = null;
      this.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy( this.biomolecule.getDetachDirection(),
        this.biomolecule.motionBoundsProperty ) );
      this.setState( this.unattachedButUnavailableState );
    }
  } );
} );
