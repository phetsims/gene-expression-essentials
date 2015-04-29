//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Attachment state machine for all RNA Polymerase molecules.  This uses the
 * generic behavior for all but the "attached" state, and has several
 * sub-states for the attached site.  See the code for details.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericAttachmentStateMachine' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/WanderInGeneralDirectionMotionStrategy' );
  var MoveDirectlyToDestinationMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MoveDirectlyToDestinationMotionStrategy' );
  var DnaMolecule = require( 'GENE_EXPRESSION_BASICS/common/model/DnaMolecule' );
  var DnaSeparation = require( 'GENE_EXPRESSION_BASICS/common/model/DnaSeparation' );
  var AttachmentSite = require( 'GENE_EXPRESSION_BASICS/common/model/AttachmentSite' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_BASICS/common/model/RnaPolymerase' );
  var MessengerRna = require( 'GENE_EXPRESSION_BASICS/common/model/MessengerRna' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/RandomWalkMotionStrategy' );
  var DriftThenTeleportMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/DriftThenTeleportMotionStrategy' );
  var RAND = require( 'GENE_EXPRESSION_BASICS/common/model/util/Random' );

  // constants
  var HALF_LIFE_FOR_HALF_AFFINITY = 1.5; // In seconds.  Half-life of attachment to a site with affinity of 0.5.

  //protected class TODO
  var AttachedToBasePair = inherit( AttachmentState,

    /**
     * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
     */
    function( rnaPolymeraseAttachmentStateMachine ) {
      this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;

      // Flag that is set upon entry that determines whether transcription occurs.
      this.transcribe = false;
    },

    {

      detachFromDnaMolecule: function( asm ) {
        asm.attachmentSite.attachedOrAttachingMolecule.set( null );
        asm.attachmentSite = null;
        asm.setState( this.rnaPolymeraseAttachmentStateMachine.unattachedButUnavailableState );
        this.rnaPolymeraseAttachmentStateMachine.biomolecule.setMotionStrategy(
          new WanderInGeneralDirectionMotionStrategy( this.rnaPolymeraseAttachmentStateMachine.biomolecule.getDetachDirection(),
            this.rnaPolymeraseAttachmentStateMachine.biomolecule.motionBoundsProperty ) );
        this.rnaPolymeraseAttachmentStateMachine.detachFromDnaThreshold.reset(); // Reset this threshold.
        asm.biomolecule.attachedToDna.set( false ); // Update externally visible state indication.
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
          attachedState = attachedAndConformingState;
          this.setState( attachedState );
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
            var attachmentSites = biomolecule.getModel().getDnaMolecule().getAdjacentAttachmentSites(
              biomolecule, asm.attachmentSite );

            // Eliminate sites that are in use or that, if moved to,
            // would put the biomolecule out of bounds.
            _.forEach( _.clone( attachmentSites ), function( site ) {

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
              attachmentSite.attachedOrAttachingMolecule.set( null );

              // Set a new attachment site.
              attachmentSite = attachmentSites[ 0 ];
              attachmentSite.attachedOrAttachingMolecule.set( biomolecule );

              // Set up the state to move to the new attachment site.
              this.rnaPolymeraseAttachmentStateMachine.setState( this.movingTowardsAttachmentState );
              biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy( attachmentSite.locationProperty,
                biomolecule.motionBoundsProperty, new Vector2( 0, 0 ), AttachedToBasePair.VELOCITY_ON_DNA ) );

              // Update the detachment threshold.  It gets lower over
              // time to increase the probability of detachment.
              // Tweak as needed.
              detachFromDnaThreshold.set( detachFromDnaThreshold.get() * Math.pow( 0.5, AttachedToBasePair.DEFAULT_ATTACH_TIME ) );
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

        // Decide right away whether or not to transcribe.
        this.transcribe = attachmentSite.getAffinity() > DnaMolecule.DEFAULT_AFFINITY &&
                          RAND.nextDouble() < attachmentSite.getAffinity();

        // Allow user interaction.
        asm.biomolecule.movableByUser.set( true );

        // Indicate attachment to DNA.
        asm.biomolecule.attachedToDna.set( true );

        // Update externally visible state information.
        asm.biomolecule.attachedToDna.set( true ); // Update externally visible state indication.
      }

    },

    {

      // Scalar velocity when moving between attachment points on the DNA.
      VELOCITY_ON_DNA: 200,

      // Time for attachment to a site on the DNA.
      DEFAULT_ATTACH_TIME: 0.15 // In seconds.

    } );


  var AttachedAndConformingState = inherit( AttachmentState,

    /**
     * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
     */
    function( rnaPolymeraseAttachmentStateMachine ) {
      this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;
      this.conformationalChangeAmount = 0;
    },

    {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
        var attachedState = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
        var attachedAndTranscribingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndTranscribingState;
        this.conformationalChangeAmount = Math.min( this.conformationalChangeAmount +
                                                    AttachedAndConformingState.CONFORMATIONAL_CHANGE_RATE * dt, 1 );
        biomolecule.changeConformation( this.conformationalChangeAmount );
        dnaStrandSeparation.setProportionOfTargetAmount( this.conformationalChangeAmount );
        if ( this.conformationalChangeAmount === 1 ) {

          // Conformational change complete, time to start actual
          // transcription.
          attachedState = attachedAndTranscribingState;
          this.rnaPolymeraseAttachmentStateMachine.setState( attachedState );
        }
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
        var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;

        // Prevent user interaction.
        asm.biomolecule.movableByUser.set( false );

        // Insert the DNA strand separator.
        dnaStrandSeparation.setXPos( rnaPolymerase.getPosition().x );
        rnaPolymerase.getModel().getDnaMolecule().addSeparation( dnaStrandSeparation );
        this.conformationalChangeAmount = 0;
      }


    },

    {

      CONFORMATIONAL_CHANGE_RATE: 1 // Proportion per second

    } );


  var AttachedAndTranscribingState = inherit( AttachmentState,

    /**
     * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
     */
    function( rnaPolymeraseAttachmentStateMachine ) {
      this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;
      this.endOfGene = null;
      this.messengerRna = null;
    },

    {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
        var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var attachedState = this.rnaPolymeraseAttachmentStateMachine.attachedState;
        var attachedAndDeconformingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndDeconformingState;

        // Grow the messenger RNA and position it to be attached to the
        // polymerase.
        this.messengerRna.addLength( AttachedAndTranscribingState.TRANSCRIPTION_VELOCITY * dt );
        this.messengerRna.setLowerRightPosition( rnaPolymerase.getPosition().x + RnaPolymerase.MESSENGER_RNA_GENERATION_OFFSET.x,
          rnaPolymerase.getPosition().y + RnaPolymerase.MESSENGER_RNA_GENERATION_OFFSET.y );

        // Move the DNA strand separator.
        dnaStrandSeparation.setXPos( rnaPolymerase.getPosition().x );

        // Check for molecules that are in the way.
        var molecules = asm.biomolecule.getModel().getOverlappingBiomolecules( asm.biomolecule.getShape() );
        _.forEach( molecules, function( molecule ) {
          if ( molecule.getPosition().x > asm.biomolecule.getPosition().x && molecule.attachedToDna.get() ) {

            // This molecule is blocking transcription, so bump it off
            // of the DNA strand.
            molecule.forceDetach();
          }
        } );

        // If we've reached the end of the gene, detach.
        if ( biomolecule.getPosition().equals( this.endOfGene ) ) {
          attachedState = attachedAndDeconformingState;
          this.rnaPolymeraseAttachmentStateMachine.setState( attachedState );
          this.messengerRna.releaseFromPolymerase();
        }
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var transcribingAttachmentSite = this.rnaPolymeraseAttachmentStateMachine.transcribingAttachmentSite;
        var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;

        // Prevent user interaction.
        asm.biomolecule.movableByUser.set( false );

        // Determine the gene that is being transcribed.
        var geneToTranscribe = biomolecule.getModel().getDnaMolecule().getGeneAtLocation( biomolecule.getPosition() );

        // Set up the motion strategy to move to the end of the transcribed
        // region of the gene.
        var endOfGene = new Vector2( geneToTranscribe.getEndX(), DnaMolecule.Y_POS );
        asm.biomolecule.setMotionStrategy( new MoveDirectlyToDestinationMotionStrategy( new Property( endOfGene.copy() ) ),
          biomolecule.motionBoundsProperty, new Vector2( 0, 0 ), AttachedAndTranscribingState.TRANSCRIPTION_VELOCITY );

        // Create the mRNA that will be grown as a result of this
        // transcription.
        this.messengerRna = new MessengerRna( biomolecule.getModel(), geneToTranscribe.getProteinPrototype(),
          biomolecule.getPosition().plus( RnaPolymerase.MESSENGER_RNA_GENERATION_OFFSET ) );
        biomolecule.spawnMessengerRna( this.messengerRna );

        // Free up the initial attachment site by hooking up to a somewhat
        // fictional attachment site instead.
        attachmentSite.attachedOrAttachingMolecule.set( null );
        transcribingAttachmentSite.attachedOrAttachingMolecule.set( asm.biomolecule );
        attachmentSite = transcribingAttachmentSite;
      }


    },

    {

      TRANSCRIPTION_VELOCITY: 1000// In picometers per second.

    } );


  var BeingRecycledState = inherit( AttachmentState,

    /**
     * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
     * @param {Array<Rectangle>} recycleReturnZones
     */
    function( rnaPolymeraseAttachmentStateMachine, recycleReturnZones ) {
      AttachmentState.call( this );
      this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;
      this.recycleReturnZones = recycleReturnZones;
    },

    {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {

        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var unattachedAndAvailableState = this.rnaPolymeraseAttachmentStateMachine.unattachedAndAvailableState;
        if ( this.pointContainedInBoundsList( asm.biomolecule.getPosition().toPoint2D(),
            RnaPolymeraseAttachmentStateMachine.this.recycleReturnZones ) ) {

          // The motion strategy has returned the biomolecule to the
          // recycle return zone, so this state is complete.
          asm.biomolecule.setMotionStrategy( new RandomWalkMotionStrategy( biomolecule.motionBoundsProperty ) );
          asm.setState( unattachedAndAvailableState );
        }
      },

      /**
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;

        // Prevent user interaction.
        asm.biomolecule.movableByUser.set( false );

        // Set the motion strategy that will move the polymerase clear of
        // the DNA, then teleport it to a location within the specified bounds.
        asm.biomolecule.setMotionStrategy( new DriftThenTeleportMotionStrategy( new Vector2( 0, RAND.nextBoolean() ? 1 : -1 ),
          this.recycleReturnZones, biomolecule.motionBoundsProperty ) );
      }
    } );


  var AttachedAndDeconformingState = inherit( GenericAttachmentStateMachine,

    /**
     * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
     */
    function( rnaPolymeraseAttachmentStateMachine ) {
      this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;
      this.conformationalChangeAmount = 0;
    },

    {

      /**
       * @param  {AttachmentStateMachine} asm
       * @param {number} dt
       */

      stepInTime: function( asm, dt ) {
        var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
        var dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
        var rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
        var attachedState = this.rnaPolymeraseAttachmentStateMachine.attachedState;
        var attachmentSite = this.rnaPolymeraseAttachmentStateMachine.attachmentSite;
        var recycleMode = this.rnaPolymeraseAttachmentStateMachine.recycleMode;
        var recycleReturnZones = this.rnaPolymeraseAttachmentStateMachine.recycleReturnZones;
        var attachedAndWanderingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndWanderingState;
        this.conformationalChangeAmount = Math.max( this.conformationalChangeAmount -
                                                    AttachedAndDeconformingState.CONFORMATIONAL_CHANGE_RATE * dt, 0 );
        biomolecule.changeConformation( this.conformationalChangeAmount );
        dnaStrandSeparation.setProportionOfTargetAmount( this.conformationalChangeAmount );
        if ( this.conformationalChangeAmount === 0 ) {

          // Remove the DNA separator, which makes the DNA close back up.
          rnaPolymerase.getModel().getDnaMolecule().removeSeparation( dnaStrandSeparation );

          // Update externally visible state indication.
          asm.biomolecule.attachedToDna.set( false );

          // Make sure that we enter the correct initial state upon the
          // next attachment.
          attachedState = attachedAndWanderingState;

          // Detach from the DNA.
          attachmentSite.attachedOrAttachingMolecule.set( null );
          attachmentSite = null;
          if ( recycleMode ) {
            this.rnaPolymeraseAttachmentStateMachine.setState(
              new BeingRecycledState( this.rnaPolymeraseAttachmentStateMachine, recycleReturnZones ) );
          }
          else {
            this.rnaPolymeraseAttachmentStateMachine.prototype.forceImmediateUnattachedButUnavailable.call( this );
          }
        }
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {

        // Prevent user interaction.
        asm.biomolecule.movableByUser.set( false );
        this.conformationalChangeAmount = 1;
      }

    },

    {

      CONFORMATIONAL_CHANGE_RATE: 1 // Proportion per second.

    } );


  /**
   * @param {RnaPolymerase} rnaPolymerase
   * @constructor
   */
  function RnaPolymeraseAttachmentStateMachine( rnaPolymerase ) {
    GenericAttachmentStateMachine.call( this, rnaPolymerase );
    this.attachedAndWanderingState = new AttachedToBasePair( this ); // private
    this.attachedAndConformingState = new AttachedAndConformingState( this );
    this.attachedAndTranscribingState = new AttachedAndTranscribingState( this );
    this.attachedAndDeconformingState = new AttachedAndDeconformingState( this );

    // RNA polymerase that is being controlled by this state machine.
    this.rnaPolymerase = rnaPolymerase;

    // Set up a new "attached" state, since the behavior is different from
    // the default.
    this.attachedState = this.attachedAndWanderingState;

    // Separator used to deform the DNA strand when the RNA polymerase is
    // transcribing it. // Create the DNA strand separator.
    this.dnaStrandSeparation = new DnaSeparation( rnaPolymerase.getPosition().x, rnaPolymerase.getShape().bounds.getHeight() * 0.9 );

    // This attachment site is used by the state machine to get the polymerase
    // something to attach to when transcribing.  This is a bit hokey, but was
    // a lot easier than trying to move to each and every base pair in the DNA
    // strand.
    this.transcribingAttachmentSite = new AttachmentSite( new Vector2( 0, 0 ), 1 );

    // Threshold for the detachment algorithm, used in deciding whether or not
    // to detach completely from the DNA at a given time step.
    this.detachFromDnaThreshold = new Property( 1.0 );

    // A flag that tracks whether this state machine should use the "recycle
    // mode", which causes the polymerase to return to some new location once
    // it has completed transcription.
    this.recycleMode = false;

    this.recycleReturnZones = [];

    // Initialize the attachment site used when transcribing.
    this.transcribingAttachmentSite.attachedOrAttachingMolecule.set( rnaPolymerase );

  }

  return inherit( GenericAttachmentStateMachine, RnaPolymeraseAttachmentStateMachine, {

    /**
     * @param {boolean} recycleMode
     */
    setRecycleMode: function( recycleMode ) {
      this.recycleMode = recycleMode;
    },

    /**
     * @param {Rectangle} recycleReturnZone
     */
    addRecycleReturnZone: function( recycleReturnZone ) {
      this.recycleReturnZones.push( recycleReturnZone );
    },

    /**
     * Calculate the probability of detachment from the current base pair
     * during the provided time interval.  This uses the same mathematics
     * as is used for calculating probabilities of decay for radioactive
     * atomic nuclei.
     *
     * @private method
     * @param {number} affinity
     * @param {number} dt
     * @return {number}
     */
    calculateProbabilityOfDetachment: function( affinity, dt ) {

      // Map affinity to a half life.  Units are in seconds.
      // Use standard half-life formula to decide on probability of detachment.
      return 1 - Math.exp( -0.693 * dt / this.calculateHalfLifeFromAffinity( affinity ) );
    },


    /**
     * Map an affinity value to a half life of attachment
     * @param {number} affinity
     * @returns {number}
     */
    calculateHalfLifeFromAffinity: function( affinity ) {
      return HALF_LIFE_FOR_HALF_AFFINITY * ( affinity / ( 1 - affinity ) );
    },

    /**
     * @param p {Vector2}
     * @param boundsList {Array <Rectangle>}
     * @returns {boolean}
     */
    pointContainedInBoundsList: function( p, boundsList ) {
      for ( var i = 0; i < boundsList.length; i++ ) {
        var bounds = boundsList[ i ];
        if ( bounds.contains( p ) ) {
          return true;
        }
      }
      return false;
    }

  } );

} );
