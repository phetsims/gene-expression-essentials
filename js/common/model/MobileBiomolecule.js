// Copyright 2015-2021, University of Colorado Boulder

/**
 * Base class for all biomolecules (i.e. RNA polymerase, transcription factors, etc.) that move around within the
 * cell. This is a very central type within this simulation. This base class provides the basic infrastructure for
 * defining the shape, the movement, and the attachment behavior (i.e. how one biomolecule interacts with others in the
 * simulation). The specific, unique behavior for each biomolecule is implemented in the sub-types.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

//modules
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import { Color } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import MotionBounds from './motion-strategies/MotionBounds.js';
import ShapeChangingModelElement from './ShapeChangingModelElement.js';

class MobileBiomolecule extends ShapeChangingModelElement {

  /**
   * @param {GeneExpressionModel} model
   * @param {Shape} initialShape
   * @param {Color} baseColor
   */
  constructor( model, initialShape, baseColor ) {

    super( initialShape );

    // @private {MotionStrategy} - Motion strategy that governs how this biomolecule moves. This changes as the molecule
    // interacts with other portions of the model.
    this.motionStrategy = null; // @private

    // @public (read-only) {Property.<Bounds2>} - bounds within which this biomolecule is allowed to move
    this.motionBoundsProperty = new Property( new MotionBounds() );

    // @public (read-only) {Property.<number>} - Position on the Z axis. This is handled much differently than for the x
    // and y axes, which can be set to any value. The Z axis only goes between 0 (all the way to the front) and -1 (all
    // the way to the back).
    this.zPositionProperty = new Property( 0 );

    // @private {boolean} - flag that tracks whether motion in Z dimension is enabled
    this.zMotionEnabled = false;

    // @public (read-only) {Property.<number>} - a value that represents this biomolecule's "existence strength", which
    // is used primarily to fade out of existence. The range for this is 1 (full existence) to 0 (non-existent).
    this.existenceStrengthProperty = new Property( 1 );

    // @public {BooleanProperty} - a flag that is used to let the view know whether or not this biomolecule is in a
    // state where it is okay for the user to move it around
    this.movableByUserProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - a flag that indicates whether or not this biomolecule is attached to the DNA strand.
    // Some biomolecules never attach to DNA, so it may never become true. This should only be set by subclasses.
    this.attachedToDnaProperty = new BooleanProperty( false );

    // @public {Property.<Color>} - Color to use when displaying this biomolecule to the user. This is a bit out of
    // place here, and has nothing to do with the fact that the molecule moves. This was just a convenient place to put
    // it (so far).
    this.colorProperty = new Property( Color.BLACK ); // @public

    // @publich {BooleanProperty} Property that tracks whether this biomolecule is user controlled. If it is, it
    // shouldn't try to move or interact with anything. Handle changes in user control.
    this.userControlledProperty = new BooleanProperty( false ); // @public

    // @private - Reference to the model in which this biomolecule exists. This is needed in case the biomolecule needs
    // to locate or create other biomolecules.
    this.model = model;

    // @protected {AttachmentStateMachine} - state machine that controls how the molecule interacts with other model
    // objects (primarily other biomolecules) in terms of attaching, detaching, etc.
    this.attachmentStateMachine = this.createAttachmentStateMachine();

    if ( baseColor ) {
      this.colorProperty.set( baseColor );
    }

    const handleUserControlledChanged = ( isUserControlled, wasUserControlled ) => {
      if ( isUserControlled && !wasUserControlled ) {
        this.handleGrabbedByUser();
      }
      else if ( wasUserControlled && !isUserControlled ) {
        this.handleReleasedByUser();
      }
    };

    this.userControlledProperty.link( handleUserControlledChanged );

    this.disposeMobileBiomolecule = () => {
      this.userControlledProperty.unlink( handleUserControlledChanged );
    };
  }

  /**
   * @public
   */
  dispose() {
    this.motionStrategy.dispose();
    this.disposeMobileBiomolecule();
    super.dispose();
  }

  /**
   * Method used to set the attachment state machine during construction. This is overridden in descendant classes in
   * order to supply this base class with different attachment behavior.
   *
   * @returns {AttachmentStateMachine}
   * @public
   */
  createAttachmentStateMachine() {
    throw new Error( 'createAttachmentStateMachine should be implemented in descendant classes of MobileBiomolecule' );
  }

  /**
   * handle the case where the user grabs this model object (i.e. starts dragging it with the mouse or a finger)
   * @protected
   */
  handleGrabbedByUser() {
    // The user has grabbed this node. This should cause any existing or pending attachments to be severed.
    this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
  }

  /**
   * Handle the case where the user was controlling this model object (i.e. dragging it with the mouse) and has
   * released it. Override this if unique behavior is needed in a subclass.
   * @protected
   */
  handleReleasedByUser() {
    // The user has released this node after moving it. This does nothing in the base class.
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {

    if ( !this.userControlledProperty.get() ) {

      // Set a new position in model space based on the current motion strategy.
      if ( this.zMotionEnabled ) {
        this.setPosition3D( this.motionStrategy.getNextPosition3D( this.getPosition3D(), this.bounds, dt ) );
      }
      else {
        const currentPosition = this.getPosition();
        this.setPosition( this.motionStrategy.getNextPosition( currentPosition, this.bounds, dt ) );
      }

      // Update the state of the attachment state machine.
      this.attachmentStateMachine.step( dt );
    }
  }

  /**
   * Get the position, including a Z component. True 3D is not fully supported in this simulation, but a limited Z axis
   * is used in some cases to make biomolecules look like they are "off in the distance".
   *
   * @returns {Vector3} Position in 3D space. Z values are limited to be from zero to negative one, inclusive.
   * @private
   */
  getPosition3D() {
    const position = this.positionProperty.get();
    return new Vector3( position.x, position.y, this.zPositionProperty.get() );
  }

  /**
   * @param {Vector3} position
   * @public
   */
  setPosition3D( position ) {
    this.setPositionXY( position.x, position.y );
    this.zPositionProperty.set( position.z );
  }

  /**
   * Turn on/off 3D motion. Turning it on means that biomolecules will move in the Z dimension, which is depicted in
   * the view in such a way to make them look closer or further from the viewer.
   *
   * @param {boolean} zMotionEnabled
   * @public
   */
  set3DMotionEnabled( zMotionEnabled ) {
    this.zMotionEnabled = zMotionEnabled;
  }

  /**
   * Get the direction to move when detaching from other molecules (including DNA). Can be changed in subclasses,
   * default is to move up.
   *
   * @returns {Vector2} Vector indicated the direction.
   * @public
   */
  getDetachDirection() {
    return new Vector2( 0, 1 );
  }

  /**
   * @returns {GeneExpressionModel}
   * @public
   */
  getModel() {
    return this.model;
  }

  /**
   * @param  {MotionBounds} motionBounds
   * @public
   */
  setMotionBounds( motionBounds ) {
    this.motionBoundsProperty.set( motionBounds );
    this.motionBoundsProperty.notifyListenersStatic();
  }

  /**
   * Add the specified messenger RNA to the model.
   * @param {MessengerRna} messengerRna
   * @public
   */
  spawnMessengerRna( messengerRna ) {
    this.model.addMessengerRna( messengerRna );
  }

  /**
   * Force this biomolecule to detach from anything to which it is currently attached or to abort any pending
   * attachments.
   * @public
   */
  forceDetach() {
    if ( this.attachmentStateMachine.isAttached() ) {
      this.attachmentStateMachine.detach();
    }
    else if ( this.attachmentStateMachine.isMovingTowardAttachment() ) {
      this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
    }
  }

  /**
   * Force this molecule to abort any pending attachment. This will NOT cause an attachment that is already consummated
   * to be broken.
   * @public
   */
  forceAbortPendingAttachment() {
    if ( this.attachmentStateMachine.isMovingTowardAttachment() ) {
      this.attachmentStateMachine.forceImmediateUnattachedAndAvailable();
    }
  }

  /**
   * Command the biomolecule to changes its conformation, which, for the purposes of this simulation, means that both
   * the color and the shape may change. This functionality is needed by some of the biomolecules, mostly when they
   * attach to something. The default does nothing, and it is up to the individual molecules to override in order to
   * implement their specific conformation change behavior.
   *
   * @param {number} changeFactor - Value, from 0 to 1, representing the degree of change from the nominal configuration.
   * @public
   */
  changeConformation( changeFactor ) {
    // Should never be called if not implemented.
    throw new Error( 'changeConformation should be implemented in descendant classes of MobileBiomolecule' );
  }

  /**
   * @override
   * Search for other biomolecules (and perhaps additional model elements) to which this biomolecule may legitimately
   * attach and, if any are founds, propose an attachment to them.
   *
   * @returns {} Attachment site of accepted attachment, null if no attachments were proposed or if all were rejected.
   * @public
   */
  proposeAttachments() {
    return null;
  }

  /**
   * @param {MotionStrategy} motionStrategy
   * @public
   */
  setMotionStrategy( motionStrategy ) {
    if ( this.motionStrategy ) {
      this.motionStrategy.dispose();
    }
    this.motionStrategy = motionStrategy;
  }
}

geneExpressionEssentials.register( 'MobileBiomolecule', MobileBiomolecule );

export default MobileBiomolecule;