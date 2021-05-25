// Copyright 2015-2021, University of Colorado Boulder

/**
 * One of the states for RnaPolymeraseAttachmentStateMachine. RnaPolymerase enters this stage when it detached from DNA
 * and recycle mode is set to true.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import dotRandom from '../../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import DriftThenTeleportMotionStrategy from '../motion-strategies/DriftThenTeleportMotionStrategy.js';
import RandomWalkMotionStrategy from '../motion-strategies/RandomWalkMotionStrategy.js';
import AttachmentState from './AttachmentState.js';

class BeingRecycledState extends AttachmentState {

  /**
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @param {Array.<Bounds2>} recycleReturnZones
   */
  constructor( rnaPolymeraseAttachmentStateMachine, recycleReturnZones ) {
    super();

    // @public (read-ony) {RnaPolymeraseAttachmentStateMachine}
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;

    // private
    this.recycleReturnZones = recycleReturnZones;
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @param {number} dt
   * @public
   */
  step( asm, dt ) {

    // Verify that state is consistent.
    assert && assert( asm.attachmentSite === null );

    const biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
    const unattachedAndAvailableState = this.rnaPolymeraseAttachmentStateMachine.unattachedAndAvailableState;

    if ( this.rnaPolymeraseAttachmentStateMachine.pointContainedInBoundsList(
      asm.biomolecule.getPosition(), this.recycleReturnZones
    ) ) {

      // The motion strategy has returned the biomolecule to the recycle return zone, so this state is complete.
      asm.biomolecule.setMotionStrategy( new RandomWalkMotionStrategy( biomolecule.motionBoundsProperty ) );
      asm.setState( unattachedAndAvailableState );
    }
  }

  /**
   * @override
   * @param {AttachmentStateMachine} asm
   * @public
   */
  entered( asm ) {
    const biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;

    // Prevent user interaction.
    asm.biomolecule.movableByUserProperty.set( false );

    // Set the motion strategy that will move the polymerase clear of the DNA, then teleport it to a position within
    // the specified bounds.
    asm.biomolecule.setMotionStrategy( new DriftThenTeleportMotionStrategy( new Vector2( 0,
      dotRandom.nextBoolean() ? 1 : -1 ),
      this.recycleReturnZones, biomolecule.motionBoundsProperty ) );
  }
}

geneExpressionEssentials.register( 'BeingRecycledState', BeingRecycledState );

export default BeingRecycledState;