// Copyright 2015-2017, University of Colorado Boulder

/**
 * One of the states for RnaPolymeraseAttachmentStateMachine. RnaPolymerase enters this state when it is attached to the
 * DNA but is not transcribing. In this state, it is doing a 1D random walk on the DNA strand.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MoveDirectlyToDestinationMotionStrategy' );
  var Vector2 = require( 'DOT/Vector2' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/WanderInGeneralDirectionMotionStrategy' );

  /**
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @constructor
   */
  function AttachedToBasePair( rnaPolymeraseAttachmentStateMachine ) {
    AttachmentState.call( this );

    // @public (read-ony) {RnaPolymeraseAttachmentStateMachine}
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;

    // @private - flag that is set upon entry that determines whether transcription occurs
    this.transcribe = false;
  }

  geneExpressionEssentials.register( 'AttachedToBasePair', AttachedToBasePair );

  return inherit( AttachmentState, AttachedToBasePair, {

    /**
     * Helper function which detaches RnaPolymerase from the DNA
     * @param  {AttachmentStateMachine} asm
     * @private
     */
    detachFromDnaMolecule: function( asm ) {
      asm.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      asm.attachmentSite = null;
      asm.setState( this.rnaPolymeraseAttachmentStateMachine.unattachedButUnavailableState );
      this.rnaPolymeraseAttachmentStateMachine.biomolecule.setMotionStrategy(
        new WanderInGeneralDirectionMotionStrategy( this.rnaPolymeraseAttachmentStateMachine.biomolecule.getDetachDirection(),
          this.rnaPolymeraseAttachmentStateMachine.biomolecule.motionBoundsProperty ) );
      this.rnaPolymeraseAttachmentStateMachine.detachFromDnaThreshold.reset(); // Reset this threshold.
      asm.biomolecule.attachedToDnaProperty.set( false ); // Update externally visible state indication.
    },

    /**
     * @override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt
     * @public
     */
    step: function( asm, dt ) {

      // Verify that state is consistent
      assert && assert( asm.attachmentSite !== null );
      assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === asm.biomolecule );

      var attachedState = this.rnaPolymeraseAttachmentStateMachine.attachedState;
      var attachedAndConformingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndConformingState;
      var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
      var detachFromDnaThreshold = this.rnaPolymeraseAttachmentStateMachine.detachFromDnaThreshold;
      var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;

      // Decide whether to transcribe the DNA. The decision is based on the affinity of the site and the time of
      // attachment.
      if ( this.transcribe ) {
        // Begin transcription.
        attachedState = attachedAndConformingState;
        this.rnaPolymeraseAttachmentStateMachine.setState( attachedState );
        detachFromDnaThreshold.reset(); // Reset this threshold.
      }
      else if ( phet.joist.random.nextDouble() >
                ( 1 -
                  this.rnaPolymeraseAttachmentStateMachine.calculateProbabilityOfDetachment(
                    attachmentSite.getAffinity(), dt ) ) ) {

        // The decision has been made to detach. Next, decide whether to detach completely from the DNA strand or just
        // jump to an adjacent base pair.
        if ( phet.joist.random.nextDouble() > detachFromDnaThreshold.get() ) {

          // Detach completely from the DNA.
          this.detachFromDnaMolecule( asm );
        }
        else {

          // Move to an adjacent base pair. Start by making a list of candidate base pairs.
          var attachmentSites = biomolecule.getModel().getDnaMolecule().getAdjacentAttachmentSitesRnaPolymerase(
            biomolecule, asm.attachmentSite );

          // Eliminate sites that are in use or that, if moved to, would put the biomolecule out of bounds.
          //var clonedAttachmentSites = [].concat( attachmentSites );
          _.remove( attachmentSites, function( site ) {

            return site.isMoleculeAttached() || !biomolecule.motionBoundsProperty.get().testIfInMotionBounds(
                biomolecule.bounds, site.positionProperty.get() );
          } );

          // Shuffle in order to produce random-ish behavior.
          attachmentSites = phet.joist.random.shuffle( attachmentSites );

          if ( attachmentSites.length === 0 ) {

            // No valid adjacent sites, so detach completely.
            this.detachFromDnaMolecule( asm );
          }
          else {

            // Move to an adjacent base pair. Firs, clear the previous attachment site.
            attachmentSite.attachedOrAttachingMoleculeProperty.set( null );

            // Set a new attachment site.
            attachmentSite = attachmentSites[ 0 ];

            // State checking - Make sure site is really available
            assert && assert( attachmentSite.attachedOrAttachingMoleculeProperty.get() === null );
            attachmentSite.attachedOrAttachingMoleculeProperty.set( biomolecule );

            // Set up the state to move to the new attachment site.
            this.rnaPolymeraseAttachmentStateMachine.setState(
              this.rnaPolymeraseAttachmentStateMachine.movingTowardsAttachmentState );
            biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy( attachmentSite.positionProperty,
              biomolecule.motionBoundsProperty, new Vector2( 0, 0 ), GEEConstants.VELOCITY_ON_DNA ) );
            this.rnaPolymeraseAttachmentStateMachine.attachmentSite = attachmentSite;

            // Update the detachment threshold. It gets lower over time to increase the probability of detachment.
            // Tweak as needed.
            detachFromDnaThreshold.set( detachFromDnaThreshold.get() * Math.pow( 0.5, GEEConstants.DEFAULT_ATTACH_TIME ) );
          }
        }
      }
      else {
        // Just stay attached to the current site.
      }
    },

    /**
     * @override
     * @param  { AttachmentStateMachine} asm
     * @public
     */
    entered: function( asm ) {
      var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;
      var randValue = phet.joist.random.nextDouble();

      // Decide right away whether or not to transcribe.
      this.transcribe = attachmentSite.getAffinity() > GEEConstants.DEFAULT_AFFINITY &&
                        randValue < attachmentSite.getAffinity();

      // Allow user interaction.
      asm.biomolecule.movableByUserProperty.set( true );

      // Indicate attachment to DNA.
      asm.biomolecule.attachedToDnaProperty.set( true );
    }
  } );
} );
