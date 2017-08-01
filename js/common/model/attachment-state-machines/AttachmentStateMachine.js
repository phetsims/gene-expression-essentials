// Copyright 2015, University of Colorado Boulder

/**
 * Base class for the attachment state machines that define how the various biomolecules attach to one another, how they
 * detach from one another, how they find other biomolecules to attach to, and so forth.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @abstract class
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function AttachmentStateMachine( biomolecule ) {

    // Reference to the biomolecule controlled by this state machine.
    this.biomolecule = biomolecule; //@public

    // Attachment point. When this is non-null, the biomolecule is either attached to this point or moving towards
    // attachment with it.
    this.attachmentSite = null; //@public

    // Current attachment state. Changes with each state transition.
    this.attachmentState = null; //@public

    // Offset to use when moving towards attachment sites. This is used when the molecule attaches to an attachment site
    // at some location other than its geometric center.
    this.destinationOffset = new Vector2( 0, 0 ); //@public
  }

  geneExpressionEssentials.register( 'AttachmentStateMachine', AttachmentStateMachine );

  return inherit( Object, AttachmentStateMachine, {

    /**
     * Step function for the attachment state machine, which in turn calls the step function of attachment state
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      // Step the current state in time.
      this.attachmentState.step( this, dt );
    },

    /**
     * Find out if the biomolecule using this state machine is currently attached to anything (i.e. another biomolecule).
     * @returns {boolean} true if attached to something, false if not.
     * @public
     */
    isAttached: function() {
      return this.attachmentSite !== null && this.attachmentSite.isMoleculeAttached();
    },

    /**
     * Find out if the biomolecule using this state machine is currently moving towards attachment with another molecule.
     * @returns {boolean} true if moving towards attachment, false if already attached or if no attachment is pending.
     * @public
     */
    isMovingTowardAttachment: function() {
      return this.attachmentSite !== null && !this.attachmentSite.isMoleculeAttached();
    },

    /**
     * Detach the biomolecule from any current attachments. This will cause the molecule to go into the
     * unattached-but-unavailable state for some period of time, after which it will become available again.
     * @public
     */
    detach: function() {
      throw new Error( 'detach should be implemented in descendant classes of AttachmentStateMachine .' );
    },

    /**
     * Move immediately into the unattached-and-available state. This is generally done only when the user has grabbed
     * the associated molecule. Calling this when already in this state is harmless.
     * @public
     */
    forceImmediateUnattachedAndAvailable: function() {
      throw new Error( ' forceImmediateUnattachedAndAvailable should be implemented in descendant classes of AttachmentStateMachine .' );
    },

    /**
     * Move immediately into the unattached-but-unavailable state. This is generally done only when the user has released
     * the associated molecule in a place where it needs to move away.
     * @public
     */
    forceImmediateUnattachedButUnavailable: function() {
      throw new Error( ' forceImmediateUnattachedButUnavailable should be implemented in descendant classes of AttachmentStateMachine .' );
    },

    /**
     * Set a new attachment state. This calls the "entered" method of the attachment state, so this should be used
     * instead of directly setting the state.
     * @param {AttachmentState} attachmentState
     * @public
     */
    setState: function( attachmentState ) {
      this.attachmentState = attachmentState;
      this.attachmentState.entered( this );
    },

    /**
     * Sets the destination offset for the biomolecule
     * @param {Vector2} offset
     * @protected
     */
    setDestinationOffset: function( offset ) {
      this.destinationOffset.setXY( offset.x, offset.y );
    }

  } );

} );

