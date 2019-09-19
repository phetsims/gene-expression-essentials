// Copyright 2015-2017, University of Colorado Boulder

/**
 * Generic attachment state machine - implements basic behavior of a biomolecule.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentStateMachine' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const GenericAttachedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericAttachedState' );
  const GenericMovingTowardsAttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericMovingTowardsAttachmentState' );
  const GenericUnattachedAndAvailableState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericUnattachedAndAvailableState' );
  const GenericUnattachedButUnavailableState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericUnattachedButUnavailableState' );
  const inherit = require( 'PHET_CORE/inherit' );
  const WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/WanderInGeneralDirectionMotionStrategy' );

  /**
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function GenericAttachmentStateMachine( biomolecule ) {
    AttachmentStateMachine.call( this, biomolecule );

    // @public - States used by this state machine. These are often set by subclasses to non-default values in order to
    // change the default behavior.
    this.unattachedAndAvailableState = new GenericUnattachedAndAvailableState();
    this.attachedState = new GenericAttachedState();
    this.movingTowardsAttachmentState = new GenericMovingTowardsAttachmentState( this );
    this.unattachedButUnavailableState = new GenericUnattachedButUnavailableState();
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
