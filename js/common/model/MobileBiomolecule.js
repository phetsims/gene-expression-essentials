// Copyright 2015-2017, University of Colorado Boulder

/**
 * Base class for all biomolecules (i.e. rna polymerase, transcription factors, etc.) that move around within the
 * simulation. This is a very central type within this simulation. This base class provides the basic infrastructure for
 * defining the shape, the movement, and the attachment behavior (i.e. how one biomolecule interacts with others in the
 * simulation). The specific, unique behavior for each biomolecule is implemented in the subclasses of this class.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  //modules
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionBounds = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionBounds' );
  var Property = require( 'AXON/Property' );
  var ShapeChangingModelElement = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeChangingModelElement' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );

  /**
   * @param {GeneExpressionModel} model
   * @param {Shape} initialShape
   * @param {Color} baseColor
   * @constructor
   */
  function MobileBiomolecule( model, initialShape, baseColor ) {
    var self = this;

    // Motion strategy that governs how this biomolecule moves. This changes as the molecule interacts with other portions
    // of the model.
    this.motionStrategy = null; // @private

    ShapeChangingModelElement.call( self, initialShape );

    // Bounds within which this biomolecule is allowed to move.
    this.motionBoundsProperty = new Property( new MotionBounds() ); // @public

    // Position on the Z axis. This is handled much differently than for the x and y axes, which can be set to any
    // value. The Z axis only goes between 0 (all the way to the front) and -1 (all the way to the back).
    this.zPositionProperty = new Property( 0 ); // @public(read-only)

    // Flag that tracks whether motion in Z dimension is enabled.
    this.zMotionEnabled = false; // @property

    // A property that keeps track of this biomolecule's "existence strength", which is used primarily to fade out of
    // existence. The range for this is 1 (full existence) to 0 (non-existent).
    this.existenceStrengthProperty = new Property( 1 ); // @public

    // Property that is used to let the view know whether or not this biomolecule is in a state where it is okay for the
    // user to move it around.
    this.movableByUserProperty = new Property( true ); // @public

    // Property that indicates whether or not this biomolecule is attached to the DNA strand. Some biomolecules never
    // attach to DNA, so it will never become true. This should only be set by subclasses.
    this.attachedToDnaProperty = new Property( false ); // @public

    // Color to use when displaying this biomolecule to the user. This is a bit out of place here, and has nothing to do\
    // with the fact that the molecule moves. This was just a convenient place to put it (so far).
    this.colorProperty = new Property( Color.BLACK ); // @public

    // Property that tracks whether this biomolecule is user controlled. If it is, it shouldn't try to move or interact
    // with anything. Handle changes in user control.
    this.userControlledProperty = new Property( false ); // @public

    // Reference to the model in which this biomolecule exists. This is needed in case the biomolecule needs to locate or
    // create other biomolecules.
    this.model = model;

    // Attachment state machine that controls how the molecule interacts with other model objects (primarily other
    // biomolecules) in terms of attaching, detaching, etc.
    this.attachmentStateMachine = this.createAttachmentStateMachine(); // @protected

    if ( baseColor ) {
      this.colorProperty.set( baseColor );
    }

    function handleUserControlledChanged( isUserControlled, wasUserControlled ) {
      if ( wasUserControlled && !isUserControlled ) {
        self.handleReleasedByUser();
      }
    }

    this.userControlledProperty.link( handleUserControlledChanged );

    this.disposeMobileBiomolecule = function() {
      self.userControlledProperty.unlink( handleUserControlledChanged );
    };
  }

  geneExpressionEssentials.register( 'MobileBiomolecule', MobileBiomolecule );

  return inherit( ShapeChangingModelElement, MobileBiomolecule, {

    /**
     * @public
     */
    dispose: function() {
      this.motionStrategy.dispose();
      this.disposeMobileBiomolecule();
      ShapeChangingModelElement.prototype.dispose.call( this );
    },

    /**
     * Method used to set the attachment state machine during construction. This is overridden in descendant classes in
     * order to supply this base class with different attachment behavior.
     *
     * @returns {AttachmentStateMachine}
     * @public
     */
    createAttachmentStateMachine: function() {
      throw new Error( 'createAttachmentStateMachine should be implemented in descendant classes of MobileBiomolecule' );
    },

    /**
     * Handle the case where the user was controlling this model object (i.e. dragging it with the mouse) and has released
     * it. Override this if unique behavior is needed in a subclass.
     * @protected
     */
    handleReleasedByUser: function() {
      // The user has released this node after moving it. This should cause any existing or pending attachments to be severed.
      this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
    },

    /**
     * @param {number} dt
     * @public
     */
    step: function( dt ) {

      if ( !this.userControlledProperty.get() ) {

        // Set a new position in model space based on the current motion strategy.
        if ( this.zMotionEnabled ) {
          this.setPosition3D( this.motionStrategy.getNextLocation3D( this.getPosition3D(), this.bounds, dt ) );
        }
        else {
          this.setPosition( this.motionStrategy.getNextLocation( this.getPosition(), this.bounds, dt ) );
        }

        // Update the state of the attachment state machine.
        this.attachmentStateMachine.step( dt );
      }
    },

    /**
     * Get the position, including a Z component. True 3D is not fully supported in this simulation, but a limited Z axis
     * is used in some cases to make biomolecules look like they are "off in the distance".
     *
     * @returns {Vector3} Position in 3D space. Z values are limited to be from zero to negative one, inclusive.
     * @private
     */
    getPosition3D: function() {
      return new Vector3( this.getPosition().x, this.getPosition().y, this.zPositionProperty.get() );
    },

    /**
     * @param {Vector3} position
     * @public
     */
    setPosition3D: function( position ) {
      this.setPosition( new Vector2( position.x, position.y ) );
      this.zPositionProperty.set( position.z );
    },

    /**
     * Turn on/off 3D motion. Turning it on means that biomolecules will move in the Z dimension, which is depicted in
     * the view in such a way to make them look closer or further from the viewer.
     *
     * @param {boolean} zMotionEnabled
     * @public
     */
    set3DMotionEnabled: function( zMotionEnabled ) {
      this.zMotionEnabled = zMotionEnabled;
    },

    /**
     * Get the direction to move when detaching from other molecules (including DNA). Can be changed in subclasses,
     * default is to move up.
     *
     * @returns {Vector2} Vector indicated the direction.
     * @public
     */
    getDetachDirection: function() {
      return new Vector2( 0, 1 );
    },

    /**
     * @returns {GeneExpressionModel}
     * @public
     */
    getModel: function() {
      return this.model;
    },

    /**
     * @param  {MotionBounds} motionBounds
     * @public
     */
    setMotionBounds: function( motionBounds ) {
      this.motionBoundsProperty.set( motionBounds );
      this.motionBoundsProperty.notifyListenersStatic();
    },

    /**
     * Add the specified messenger RNA to the model.
     * @param {MessengerRna} messengerRna
     * @public
     */
    spawnMessengerRna: function( messengerRna ) {
      this.model.addMessengerRna( messengerRna );
    },

    /**
     * Force this biomolecule to detach from anything to which it is currently attached or to abort any pending
     * attachments.
     * @public
     */
    forceDetach: function() {
      if ( this.attachmentStateMachine.isAttached() ) {
        this.attachmentStateMachine.detach();
      }
      else if ( this.attachmentStateMachine.isMovingTowardAttachment() ) {
        this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
      }
    },

    /**
     * Force this molecule to abort any pending attachment. This will NOT cause an attachment that is already consummated
     * to be broken.
     * @public
     */
    forceAbortPendingAttachment: function() {
      if ( this.attachmentStateMachine.isMovingTowardAttachment() ) {
        this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
      }
    },

    /**
     * Command the biomolecule to changes its conformation, which, for the purposes of this simulation, means that both
     * the color and the shape may change. This functionality is needed by some of the biomolecules, mostly when they
     * attach to something. The default does nothing, and it is up to the individual molecules to override in order to
     * implement their specific conformation change behavior.
     *
     * @param {number} changeFactor - Value, from 0 to 1, representing the degree of change from the nominal configuration.
     * @public
     */
    changeConformation: function( changeFactor ) {
      // Should never be called if not implemented.
      throw new Error( 'changeConformation should be implemented in descendant classes of MobileBiomolecule' );
    },

    /**
     * @override
     * Search for other biomolecules (and perhaps additional model elements) to which this biomolecule may legitimately
     * attach and, if any are founds, propose an attachment to them.
     *
     * @return Attachment site of accepted attachment, null if no attachments were proposed or if all were rejected.
     * @public
     */
    proposeAttachments: function() {
      return null;
    },

    /**
     * @param {MotionStrategy} motionStrategy
     * @public
     */
    setMotionStrategy: function( motionStrategy ) {
      if ( this.motionStrategy ) {
        this.motionStrategy.dispose();
      }
      this.motionStrategy = motionStrategy;
    }
  } );
} );
