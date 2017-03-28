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
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var DriftThenTeleportMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/DriftThenTeleportMotionStrategy' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/RandomWalkMotionStrategy' );
  var Vector2 = require( 'DOT/Vector2' );

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

  geneExpressionEssentials.register( 'BeingRecycledState', BeingRecycledState );

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

      if ( this.rnaPolymeraseAttachmentStateMachine.pointContainedInBoundsList( asm.biomolecule.getPosition(),
          this.recycleReturnZones ) ) {

        // The motion strategy has returned the biomolecule to the recycle return zone, so this state is complete.
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
      asm.biomolecule.movableByUserProperty.set( false );

      // Set the motion strategy that will move the polymerase clear of
      // the DNA, then teleport it to a location within the specified bounds.
      asm.biomolecule.setMotionStrategy( new DriftThenTeleportMotionStrategy( new Vector2( 0,
        phet.joist.random.nextBoolean() ? 1 : -1 ),
        this.recycleReturnZones, biomolecule.motionBoundsProperty ) );
    }
  } );
} );

