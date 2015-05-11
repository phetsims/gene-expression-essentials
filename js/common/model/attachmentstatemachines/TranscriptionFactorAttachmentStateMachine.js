//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Attachment state machine for all transcription factor molecules.  This
 * class controls how transcription factors behave with respect to attaching
 * to and detaching from the DNA molecule, which is the only thing to which the
 * transcription factors attach.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RAND = require( 'GENE_EXPRESSION_BASICS/common/util/Random' );
  var Vector2 = require( 'DOT/Vector2' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericAttachmentStateMachine' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MoveDirectlyToDestinationMotionStrategy' );
  var FollowAttachmentSite = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/FollowAttachmentSite' );
  var GenericAttachedState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericAttachedState' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/WanderInGeneralDirectionMotionStrategy' );

  // protected class TODO
  // Subclass of the "attached" state.
  var TranscriptionFactorAttachedState = inherit( GenericAttachedState,

    /**
     * @param {TranscriptionFactorAttachmentStateMachine} transcriptionFactorAttachmentStateMachine
     */
    function( transcriptionFactorAttachmentStateMachine ) {
      this.transcriptionFactorAttachmentStateMachine = transcriptionFactorAttachmentStateMachine;
    },

    {

      /**
       * Calculate the probability of detachment from the current base pair
       * during the provided time interval.  This uses the same mathematics
       * as is used for calculating probabilities of decay for radioactive
       * atomic nuclei.
       *
       * @param {number} affinity
       * @param {number} dt
       * @return {number}
       */
      calculateProbabilityOfDetachment: function( affinity, dt ) {

        // Map affinity to a half life.  Units are in seconds.  This
        // formula can be tweaked as needed in order to make the half life
        // longer or shorter.  However, zero affinity should always map to
        // zero half life, and an affinity of one should always map to an
        // infinite half life.
        var halfLife = HALF_LIFE_FOR_HALF_AFFINITY * ( affinity / ( 1 - affinity ) );

        // Use standard half-life formula to decide on probability of detachment.
        return 1 - Math.exp( -0.693 * dt / halfLife );
      },

      /**
       * @param {AttachmentStateMachine} asm
       */
      detachFromDnaMolecule: function( asm ) {
        var biomolecule = this.transcriptionFactorAttachmentStateMachine.biomolecule;
        asm.attachmentSite.attachedOrAttachingMolecule.set( null );
        asm.attachmentSite = null;
        asm.setState( this.transcriptionFactorAttachmentStateMachine.unattachedButUnavailableState );
        biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy( biomolecule.getDetachDirection(),
          biomolecule.motionBoundsProperty ) );
        this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold = 1; // Reset this threshold.
        asm.biomolecule.attachedToDna.set( false ); // Update externally visible state indication.
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var attachmentSite = this.transcriptionFactorAttachmentStateMachine.attachmentSite;
        var detachFromDnaThreshold = this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold;
        var biomolecule = this.transcriptionFactorAttachmentStateMachine.biomolecule;
        var movingTowardsAttachmentState = this.transcriptionFactorAttachmentStateMachine.movingTowardsAttachmentState;

        // Decide whether or not to detach from the current attachment site.
        if ( RAND.nextDouble() > ( 1 - this.calculateProbabilityOfDetachment( attachmentSite.getAffinity(), dt ) ) ) {

          // The decision has been made to detach.  Next, decide whether
          // to detach completely from the DNA strand or just jump to an
          // adjacent base pair.
          if ( RAND.nextDouble() > detachFromDnaThreshold ) {

            // Detach completely from the DNA.
            this.detachFromDnaMolecule( asm );
          }
          else {

            // Move to an adjacent base pair.  Start by making a list
            // of candidate base pairs.
            var attachmentSites = biomolecule.getModel().getDnaMolecule()
              .getAdjacentAttachmentSites( biomolecule, asm.attachmentSite );

            // Eliminate sites that, if moved to, would put the
            // biomolecule out of bounds.
            _.forEach( _.clone( attachmentSites ), function( site ) {
              if ( !biomolecule.motionBoundsProperty.get()
                  .testIfInMotionBounds( biomolecule.getShape(), site.locationProperty.get() ) ) {

                attachmentSites = _.remove( attachmentSites, function( value ) {
                  return value === site;
                } );

              }
            } );

            // Shuffle in order to produce random-ish behavior.
            _.shuffle( attachmentSites );

            if ( attachmentSites.length === 0 ) {

              // No valid adjacent sites, so detach completely.
              this.detachFromDnaMolecule( asm );
            }
            else {

              // Clear the previous attachment site.
              attachmentSite.attachedOrAttachingMolecule.set( null );

              // Set a new attachment site.
              attachmentSite = attachmentSites[ 0 ];
              attachmentSite.attachedOrAttachingMolecule.set( biomolecule );

              // Set up the state to move to the new attachment site.
              this.transcriptionFactorAttachmentStateMachine.setState( movingTowardsAttachmentState );
              biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy( attachmentSite.locationProperty,
                biomolecule.motionBoundsProperty, new Vector2( 0, 0 ), VELOCITY_ON_DNA ) );

              // Update the detachment threshold.  It gets lower over
              // time to increase the probability of detachment.
              // Tweak as needed.
              this.transcriptionFactorAttachmentStateMachine.detachFromDnaThreshold =
                detachFromDnaThreshold * Math.pow( 0.5, TranscriptionFactorAttachedState.DEFAULT_ATTACH_TIME );
            }
          }
        }
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} enclosingStateMachine
       */
      entered: function( enclosingStateMachine ) {
        enclosingStateMachine.biomolecule.setMotionStrategy( new FollowAttachmentSite( enclosingStateMachine.attachmentSite ) );
        enclosingStateMachine.biomolecule.attachedToDna.set( true ); // Update externally visible state indication.
      }


    },

    {

      DEFAULT_ATTACH_TIME: 0.15 // In seconds.

    } );


  // constants
  var VELOCITY_ON_DNA = 200;// Scalar velocity when moving between attachment points on the DNA.
  var HALF_LIFE_FOR_HALF_AFFINITY = 1.5; // In seconds.// Half-life of attachment to a site with affinity of 0.5.


  /**
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function TranscriptionFactorAttachmentStateMachine( biomolecule ) {
    GenericAttachmentStateMachine.call( this, biomolecule );

    // Set up a new "attached" state, since the behavior is different from
    // the default.
    this.attachedState = new TranscriptionFactorAttachedState( this );

    // Threshold for the detachment algorithm, used in deciding whether or not
    // to detach completely from the DNA at a given time step.
    this.detachFromDnaThreshold = 1;
  }

  return inherit( GenericAttachmentStateMachine, TranscriptionFactorAttachmentStateMachine, {} );

} );
