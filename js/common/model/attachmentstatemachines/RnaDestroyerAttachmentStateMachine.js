//  Copyright 2002-2014, University of Colorado Boulder
/**
 /**
 * This class defined the attachment state machine for the biomolecules that
 * destroy the messenger RNA molecules.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericAttachmentStateMachine' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );
  var DoubleRange = require( 'GENE_EXPRESSION_BASICS/common/util/DoubleRange' );
  var MessengerRnaFragment = require( 'GENE_EXPRESSION_BASICS/common/model/MessengerRnaFragment' );
  var DestroyerTrackingRnaMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/DestroyerTrackingRnaMotionStrategy' );
  var RAND = require( 'DOT/Random' );

  // constants
  // Scalar velocity for transcription.
  var RNA_DESTRUCTION_RATE = 750; // Picometers per second.

  // Range of lengths for mRNA fragments.
  var MRNA_FRAGMENT_LENGTH_RANGE = new DoubleRange( 100, 400 ); // In picometers.

  /**
   * protected class //TODO
   * Use generic state except that interaction is turned off.
   */
  var MRnaDestroyerMovingTowardAttachmentState = inherit( AttachmentState,

    /**
     * @param  {RnaDestroyerAttachmentStateMachine} rnaDestroyerAttachmentStateMachine
     */
    function( rnaDestroyerAttachmentStateMachine ) {
      this.rnaDestroyerAttachmentStateMachine = rnaDestroyerAttachmentStateMachine;
    },

    {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        AttachmentState.prototype.entered.call( this );
        asm.biomolecule.movableByUser = false;
      }

    } );


  /*
   * Class that defines what the mRNA destroyer does when attached to mRNA.
   */
  var MRnaDestroyerAttachedState = inherit( AttachmentState,

    /**
     *
     * @param {RnaDestroyerAttachmentStateMachine} rnaDestroyerAttachmentStateMachine
     */
    function( rnaDestroyerAttachmentStateMachine ) {
      this.rnaDestroyerAttachmentStateMachine = rnaDestroyerAttachmentStateMachine;
      this.messengerRnaFragment = null;
      this.targetFragmentLength = 0;
    },

    {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var biomolecule = this.rnaDestroyerAttachmentStateMachine.biomolecule;

        // Grow the mRNA fragment, release it if it is time to do so.
        if ( this.messengerRnaFragment === null ) {
          this.messengerRnaFragment = new MessengerRnaFragment( biomolecule.getModel(), biomolecule.getPosition() );
          biomolecule.getModel().addMobileBiomolecule( this.messengerRnaFragment );
          this.targetFragmentLength = MRNA_FRAGMENT_LENGTH_RANGE.getMin() +
                                      RAND.nextDouble() * MRNA_FRAGMENT_LENGTH_RANGE.getLength();
        }
        this.messengerRnaFragment.addLength( RNA_DESTRUCTION_RATE * dt );
        if ( this.messengerRnaFragment.getLength() >= this.targetFragmentLength ) {

          // Time to release this fragment.
          this.messengerRnaFragment.releaseFromDestroyer();
          this.messengerRnaFragment = null;
        }

        // Advance the destruction of the mRNA.
        var destructionComplete = this.rnaDestroyerAttachmentStateMachine.mRnaDestroyer
          .advanceMessengerRnaDestruction( RNA_DESTRUCTION_RATE * dt );
        if ( destructionComplete ) {

          // Detach the current mRNA fragment.
          if ( this.messengerRnaFragment !== null ) {
            this.messengerRnaFragment.releaseFromDestroyer();
            this.messengerRnaFragment = null;
          }

          // Remove the messenger RNA that is now destroyed from the
          // model.  There should be no visual representation left to it
          // at this point.
          this.rnaDestroyerAttachmentStateMachine.biomolecule.getModel().removeMessengerRna(
            this.rnaDestroyerAttachmentStateMachine.mRnaDestroyer.getMessengerRnaBeingDestroyed() );
          this.rnaDestroyerAttachmentStateMachine.mRnaDestroyer.clearMessengerRnaBeingDestroyed();

          // Release this destroyer to wander in the cytoplasm.
          asm.detach();
        }
      },

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var mRnaDestroyer = this.rnaDestroyerAttachmentStateMachine.mRnaDestroyer;
        mRnaDestroyer.initiateMessengerRnaDestruction();
        mRnaDestroyer.setMotionStrategy( new DestroyerTrackingRnaMotionStrategy( mRnaDestroyer ) );

        // Turn off user interaction while mRNA is being destroyed.
        asm.biomolecule.movableByUser = false;
      }

    } );

  /**
   *
   * @param biomolecule {MobileBiomolecule}
   * @constructor
   */
  function RnaDestroyerAttachmentStateMachine( biomolecule ) {
    GenericAttachmentStateMachine.call( this, biomolecule );

    // Set up a local reference of the needed type.
    this.mRnaDestroyer = biomolecule;

    // Set up a non-default "attached" state, since the behavior is
    // different from the default.
    this.attachedState = new MRnaDestroyerAttachedState( this );

    // Set up a non-default "moving toward attachment" state, since the
    // behavior is slightly different from the default.
    this.movingTowardsAttachmentState = new MRnaDestroyerMovingTowardAttachmentState( this );

  }

  return inherit( GenericAttachmentStateMachine, RnaDestroyerAttachmentStateMachine, {

    /**
     * @Override
     */
    forceImmediateUnattachedAndAvailable: function() {
      if ( this.mRnaDestroyer.getMessengerRnaBeingDestroyed() !== null ) {

        // Abort a pending attachment to mRNA.
        this.mRnaDestroyer.getMessengerRnaBeingDestroyed().abortDestruction();
        this.mRnaDestroyer.clearMessengerRnaBeingDestroyed();
      }
      GenericAttachmentStateMachine.prototype.forceImmediateUnattachedAndAvailable.call( this );
    }

  } );


} );

