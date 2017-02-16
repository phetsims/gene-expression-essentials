// Copyright 2015, University of Colorado Boulder
/**
 * Attachment state machine for messenger RNA fragments. These fragments start their life as being attached to an mRNA
 * destroyer, and and then released into the cytoplasm to wander and fade.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var AttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentStateMachine' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/StillnessMotionStrategy' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/RandomWalkMotionStrategy' );

  // constants
  var FADE_OUT_TIME = 3; // In seconds.


  // private classes
  var AttachedToDestroyerState = inherit( AttachmentState,

    /**
     * @param {MessengerRnaFragmentAttachmentStateMachine} messengerRnaFragmentAttachmentStateMachine
     */
    function( messengerRnaFragmentAttachmentStateMachine ) {

      this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;

    },

    {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
      }

    } );


  var UnattachedAndFadingState = inherit( AttachmentState,

    /**
     * @param {MessengerRnaFragmentAttachmentStateMachine} messengerRnaFragmentAttachmentStateMachine
     */
    function( messengerRnaFragmentAttachmentStateMachine ) {
      this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;
    },

    {

      /**
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        assert && assert( biomolecule.existenceStrengthProperty.get() === 1 );
        biomolecule.setMotionStrategy( new RandomWalkMotionStrategy( biomolecule.motionBoundsProperty ) );
      },

      /**
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        biomolecule.existenceStrengthProperty.set( Math.max( biomolecule.existenceStrengthProperty.get() - dt / FADE_OUT_TIME, 0 ) );
      }

    } );


  /**
   * @param biomolecule {MobileBioMolecule}
   * @constructor
   */
  function MessengerRnaFragmentAttachmentStateMachine( biomolecule ) {
    AttachmentStateMachine.call( this, biomolecule );
    this.setState( new AttachedToDestroyerState( this ) );
  }

  geneExpressionEssentials.register( 'MessengerRnaFragmentAttachmentStateMachine', MessengerRnaFragmentAttachmentStateMachine );

  return inherit( AttachmentStateMachine, MessengerRnaFragmentAttachmentStateMachine, {

    /**
     * @Override
     */
    detach: function() {
      this.setState( new UnattachedAndFadingState( this ) );
    }

  } );


} );

