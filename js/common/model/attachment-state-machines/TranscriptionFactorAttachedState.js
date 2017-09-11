// Copyright 2015, University of Colorado Boulder
/**
 * One of the states for TranscriptionFactorAttachmentStateMachine. Subclass of the "attached" state.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var FollowAttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/FollowAttachmentSite' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericAttachedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericAttachedState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MoveDirectlyToDestinationMotionStrategy' );
  var Vector2 = require( 'DOT/Vector2' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/WanderInGeneralDirectionMotionStrategy' );

  // constants
  var HALF_LIFE_FOR_HALF_AFFINITY = 1.5; // In seconds.

  /**
   * @param {TranscriptionFactorAttachmentStateMachine} transcriptionFactorAttachmentStateMachine
   * @constructor
   */
  function TranscriptionFactorAttachedState( transcriptionFactorAttachmentStateMachine ) {
    GenericAttachedState.call( this );
    this.transcriptionFactorAttachmentStateMachine = transcriptionFactorAttachmentStateMachine; //@public
  }

  geneExpressionEssentials.register( 'TranscriptionFactorAttachedState', TranscriptionFactorAttachedState );

  return inherit( GenericAttachedState, TranscriptionFactorAttachedState, {

    /**
     * Calculate the probability of detachment from the current base pair during the provided time interval. This uses
     * the same mathematics as is used for calculating probabilities of decay for radioactive
     * atomic nuclei.
     *
     * @param {number} affinity
     * @param {number} dt
     * @returns {number}
     * @public
     */
    calculateProbabilityOfDetachment: function( affinity, dt ) {

      // Map affinity to a half life. Units are in seconds. This formula can be tweaked as needed in order to make the
      // half life longer or shorter. However, zero affinity should always map to zero half life, and an affinity of one
      // should always map to an infinite half life.
      var halfLife = HALF_LIFE_FOR_HALF_AFFINITY * ( affinity / ( 1 - affinity ) );

      // Use standard half-life formula to decide on probability of detachment.
      return 1 - Math.exp( -0.693 * dt / halfLife );
    },

    /**
     * @param {AttachmentStateMachine} asm
     * @private
     */
    detachFromDnaMolecule: function( asm ) {
      var biomolecule = this.transcriptionFactorAttachmentStateMachine.biomolecule;
      asm.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      asm.attachmentSite = null;
      asm.setState( this.transcriptionFactorAttachmentStateMachine.unattachedButUnavailableState );
      biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy( biomolecule.getDetachDirection(),
        biomolecule.motionBoundsProperty ) );
      this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold = 1; // Reset this threshold.
      asm.biomolecule.attachedToDnaProperty.set( false ); // Update externally visible state indication.
    },

    /**
     * @override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt
     * @public
     */
    step: function( asm, dt ) {
      var attachmentSite = this.transcriptionFactorAttachmentStateMachine.attachmentSite;
      var detachFromDnaThreshold = this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold;
      var biomolecule = this.transcriptionFactorAttachmentStateMachine.biomolecule;
      var movingTowardsAttachmentState = this.transcriptionFactorAttachmentStateMachine.movingTowardsAttachmentState;

      // Decide whether or not to detach from the current attachment site.
      if ( phet.joist.random.nextDouble() > ( 1 - this.calculateProbabilityOfDetachment( attachmentSite.getAffinity(), dt ) ) ) {

        // The decision has been made to detach. Next, decide whether to detach completely from the DNA strand or just
        // jump to an adjacent base pair.
        if ( phet.joist.random.nextDouble() > detachFromDnaThreshold ) {

          // Detach completely from the DNA.
          this.detachFromDnaMolecule( asm );
        }
        else {

          // Move to an adjacent base pair. Start by making a list of candidate base pairs.
          var attachmentSites = biomolecule.getModel().getDnaMolecule().getAdjacentAttachmentSitesTranscriptionFactor( biomolecule, asm.attachmentSite );

          // Eliminate sites that, if moved to, would put the biomolecule out of bounds.
          //var clonedAttachmentSites = [].concat( attachmentSites );
          _.remove( attachmentSites, function( site ) {
            return !biomolecule.motionBoundsProperty.get().testIfInMotionBounds( biomolecule.bounds,
              site.locationProperty.get() );
          } );

          // Shuffle in order to produce random-ish behavior.
          attachmentSites = phet.joist.random.shuffle( attachmentSites );

          if ( attachmentSites.length === 0 ) {

            // No valid adjacent sites, so detach completely.
            this.detachFromDnaMolecule( asm );
          }
          else {

            // Clear the previous attachment site.
            attachmentSite.attachedOrAttachingMoleculeProperty.set( null );

            // Set a new attachment site.
            attachmentSite = attachmentSites[ 0 ];
            assert && assert( attachmentSite.attachedOrAttachingMoleculeProperty.get() === null );
            attachmentSite.attachedOrAttachingMoleculeProperty.set( biomolecule );

            // Set up the state to move to the new attachment site.
            this.transcriptionFactorAttachmentStateMachine.setState( movingTowardsAttachmentState );
            this.transcriptionFactorAttachmentStateMachine.attachmentSite = attachmentSite;
            biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy( attachmentSite.locationProperty,
              biomolecule.motionBoundsProperty, new Vector2( 0, 0 ), GEEConstants.VELOCITY_ON_DNA ) );

            // Update the detachment threshold. It gets lower over time to increase the probability of detachment.
            // Tweak as needed.
            this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold =
              detachFromDnaThreshold * Math.pow( 0.5, GEEConstants.DEFAULT_ATTACH_TIME );
          }
        }
      }
    },

    /**
     * @override
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @public
     */
    entered: function( enclosingStateMachine ) {
      enclosingStateMachine.biomolecule.setMotionStrategy( new FollowAttachmentSite( enclosingStateMachine.attachmentSite ) );
      enclosingStateMachine.biomolecule.attachedToDnaProperty.set( true ); // Update externally visible state indication.
    }
  } );
} );