// Copyright 2015, University of Colorado Boulder
/**
 * One of sub-states for the attached site
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
  var Vector2 = require( 'DOT/Vector2' );
  var Random = require( 'DOT/Random' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/RandomWalkMotionStrategy' );
  var DriftThenTeleportMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motionstrategies/DriftThenTeleportMotionStrategy' );

  // constants
  var RAND = new Random();

  /**
   *
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @param {Array<Rectangle>} recycleReturnZones
   * @constructor
   */
  function BeingRecycledState( rnaPolymeraseAttachmentStateMachine, recycleReturnZones ) {
    AttachmentState.call( this );
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;
    this.recycleReturnZones = recycleReturnZones;
  }

  return inherit( AttachmentState, BeingRecycledState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt
     */
    stepInTime: function( asm, dt ) {
      // Verify that state is consistent.
      assert && assert(asm.attachmentSite === null);

      var biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
      var unattachedAndAvailableState = this.rnaPolymeraseAttachmentStateMachine.unattachedAndAvailableState;
      if ( this.pointContainedInBoundsList( asm.biomolecule.getPosition(),
          this.recycleReturnZones ) ) {

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
      asm.biomolecule.movableByUser = false;

      // Set the motion strategy that will move the polymerase clear of
      // the DNA, then teleport it to a location within the specified bounds.
      asm.biomolecule.setMotionStrategy( new DriftThenTeleportMotionStrategy( new Vector2( 0, RAND.nextBoolean() ? 1 : -1 ),
        this.recycleReturnZones, biomolecule.motionBoundsProperty ) );
    }

  } );


} );

