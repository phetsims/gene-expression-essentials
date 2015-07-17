//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Subclass of the "attached" state for polymerase when it is attached to
 * the DNA but is not transcribing.  In this state, it is doing a 1D
 * random walk on the DNA strand.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 *
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Random = require( 'DOT/Random' );
  var Vector2 = require( 'DOT/Vector2' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/WanderInGeneralDirectionMotionStrategy' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var CommonConstants = require( 'GENE_EXPRESSION_BASICS/common/model/CommonConstants' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MoveDirectlyToDestinationMotionStrategy' );

  // constants
  var RAND = new Random();

  // Scalar velocity when moving between attachment points on the DNA.
  var VELOCITY_ON_DNA = 200;

  // Time for attachment to a site on the DNA.
  var DEFAULT_ATTACH_TIME= 0.15; // In seconds.

  /**
   *
   * @param {RNAPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @constructor
   */
  function AttachedToBasePair( rnaPolymeraseAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;

    // Flag that is set upon entry that determines whether transcription occurs.
    this.transcribe = false;
  }

  return inherit( AttachmentState, AttachedToBasePair, {
      detachFromDnaMolecule: function( asm ) {
        asm.attachmentSite.attachedOrAttachingMolecule = null;
        asm.attachmentSite = null;
        asm.setState( this.rnaPolymeraseAttachmentStateMachine.unattachedButUnavailableState );
        this.rnaPolymeraseAttachmentStateMachine.biomolecule.setMotionStrategy(
          new WanderInGeneralDirectionMotionStrategy( this.rnaPolymeraseAttachmentStateMachine.biomolecule.getDetachDirection(),
            this.rnaPolymeraseAttachmentStateMachine.biomolecule.motionBoundsProperty ) );
        this.rnaPolymeraseAttachmentStateMachine.detachFromDnaThreshold.reset(); // Reset this threshold.
        asm.biomolecule.attachedToDna = false; // Update externally visible state indication.
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var attachedState = this.rnaPolymeraseAttachmentStateMachine.attachedState;
        var attachedAndConformingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndConformingState;
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var detachFromDnaThreshold = this.rnaPolymeraseAttachmentStateMachine.detachFromDnaThreshold;
        var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;

        // Decide whether to transcribe the DNA.  The decision is based on
        // the affinity of the site and the time of attachment.

        if ( this.transcribe ) {
          // Begin transcription.
          this.rnaPolymeraseAttachmentStateMachine.attachedState = attachedAndConformingState;
          this.rnaPolymeraseAttachmentStateMachine.setState( attachedState );
          detachFromDnaThreshold.reset(); // Reset this threshold.
        }
        else if ( RAND.nextDouble() > ( 1 - this.rnaPolymeraseAttachmentStateMachine.calculateProbabilityOfDetachment( attachmentSite.getAffinity(), dt ) ) ) {

          // The decision has been made to detach.  Next, decide whether
          // to detach completely from the DNA strand or just jump to an
          // adjacent base pair.
          if ( RAND.nextDouble() > detachFromDnaThreshold.get() ) {

            // Detach completely from the DNA.
            this.detachFromDnaMolecule( asm );
          }
          else {

            // Move to an adjacent base pair.  Start by making a list
            // of candidate base pairs.
            var attachmentSites = biomolecule.getModel().getDnaMolecule().getAdjacentAttachmentSitesRnaPolymerase(
              biomolecule, asm.attachmentSite );

            // Eliminate sites that are in use or that, if moved to,
            // would put the biomolecule out of bounds.
            var clonedAttachmentSites = [].concat( attachmentSites );
            _.forEach( clonedAttachmentSites, function( site ) {

              if ( site.isMoleculeAttached() || !biomolecule.motionBoundsProperty.get().testIfInMotionBounds(
                  biomolecule.getShape(), site.locationProperty.get() ) ) {
                _.remove( attachmentSites, function( value ) {
                  return site === value;
                } );
              }

            } );

            // Shuffle in order to produce random-ish behavior.
            attachmentSites = _.shuffle( attachmentSites );

            if ( attachmentSites.length === 0 ) {

              // No valid adjacent sites, so detach completely.
              this.detachFromDnaMolecule( asm );
            }
            else {

              // Move to an adjacent base pair.  Firs, clear the
              // previous attachment site.
              attachmentSite.attachedOrAttachingMolecule = null;

              // Set a new attachment site.
              attachmentSite = attachmentSites[ 0 ];
              attachmentSite.attachedOrAttachingMolecule = biomolecule;

              // Set up the state to move to the new attachment site.
              this.rnaPolymeraseAttachmentStateMachine.setState( this.rnaPolymeraseAttachmentStateMachine.movingTowardsAttachmentState );
              biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy( attachmentSite.locationProperty,
                biomolecule.motionBoundsProperty, new Vector2( 0, 0 ), VELOCITY_ON_DNA ) );

              // Update the detachment threshold.  It gets lower over
              // time to increase the probability of detachment.
              // Tweak as needed.
              detachFromDnaThreshold.set( detachFromDnaThreshold.get() * Math.pow( 0.5, DEFAULT_ATTACH_TIME ) );
            }
          }
        }
        else {
          // Just stay attached to the current site.
        }
      },

      /**
       *
       * @param  { AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;
        var randValue = RAND.nextDouble();

       // Decide right away whether or not to transcribe.
        this.transcribe = attachmentSite.getAffinity() > CommonConstants.DEFAULT_AFFINITY &&
                          randValue < attachmentSite.getAffinity();

        // Allow user interaction.
        asm.biomolecule.movableByUser = true;

        // Indicate attachment to DNA.
        asm.biomolecule.attachedToDna = true;

        // Update externally visible state information.
        asm.biomolecule.attachedToDna = true; // Update externally visible state indication.
      }

    },

    {

      // Scalar velocity when moving between attachment points on the DNA.
      VELOCITY_ON_DNA: VELOCITY_ON_DNA,

      // Time for attachment to a site on the DNA.
      DEFAULT_ATTACH_TIME: DEFAULT_ATTACH_TIME

    } );


} );
