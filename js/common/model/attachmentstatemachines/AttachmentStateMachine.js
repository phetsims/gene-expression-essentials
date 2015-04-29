//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Base class for the attachment state machines that define how the various
 * biomolecules attach to one another, how they detach from one another, how
 * they find other biomolecules to attach to, and so forth.
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

  /**
   * @abstract class
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function AttachmentStateMachine( biomolecule ) {

    // Reference to the biomolecule controlled by this state machine.
    this.biomolecule = biomolecule;

    // Attachment point.  When this is non-null, the biomolecule is either
    // attached to this point or moving towards attachment with it.
    this.attachmentSite = null;

    // Current attachment state.  Changes with each state transition.
    this.attachmentState = null;

    // Offset to use when moving towards attachment sites.  This is used when
    // the molecule attaches to an attachment site at some location other than
    // its geometric center.
    this.destinationOffset = new Vector2( 0, 0 );
  }

  return inherit( Object, AttachmentStateMachine, {

    /**
     * @param {number} dt
     */
    stepInTime: function( dt ) {
      // Step the current state in time.
      this.attachmentState.stepInTime( this, dt );
    },

    /**
     * Find out if the biomolecule using this state machine is currently
     * attached to anything (i.e. another biomolecule).
     *
     * @return {boolean} true if attached to something, false if not.
     */
    isAttached: function() {
      return this.attachmentSite !== null && this.attachmentSite.isMoleculeAttached();
    },

    /**
     * Find out if the biomolecule using this state machine is currently moving
     * towards attachment with another molecule.
     *
     * @return {boolean} true if moving towards attachment, false if already attached or
     *         if no attachment is pending.
     */
    isMovingTowardAttachment: function() {
      return this.attachmentSite !== null && !this.attachmentSite.isMoleculeAttached();
    },

    /**
     * Detach the biomolecule from any current attachments.  This will cause
     * the molecule to go into the unattached-but-unavailable state for some
     * period of time, after which it will become available again.
     */
    detach: function() {
      throw new Error( 'detach should be implemented in descendant classes of AttachmentStateMachine .' );
    },


    /**
     * Move immediately into the unattached-and-available state.  This is
     * generally done only when the user has grabbed the associated molecule.
     * Calling this when already in this state is harmless.
     */
    forceImmediateUnattachedAndAvailable: function() {
      console.log( "AttachmentStateMachine Warning: Unimplemented method called in base class." );
    },

    /**
     * Move immediately into the unattached-but-unavailable state.  This is
     * generally done only when the user has released the associated molecule
     * in a place where it needs to move away.
     */
    forceImmediateUnattachedButUnavailable: function() {
      console.log( "AttachmentStateMachine Warning: Unimplemented method called in base class." );
    },

    /**
     * Set a new attachment state.  This calls the "entered" method, so this
     * should be used instead of directly setting the state.
     *
     * @param {AttachmentState} attachmentState
     */
    setState: function( attachmentState ) {
      this.attachmentState = attachmentState;
      this.attachmentState.entered( this );
    },

    /**
     * @param {number} x
     * @param {number} y
     */
    setDestinationOffset: function( x, y ) {
      this.destinationOffset.setComponents( x, y );
    },


    /**
     * @param {Vector2}  offset
     */
    setDestinationOffsetByVector: function( offset ) {
      this.destinationOffset.setComponents( offset.x, offset.y );
    }

  } );

} );

