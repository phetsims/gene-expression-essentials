// Copyright 2015-2019, University of Colorado Boulder

/**
 * Attachment state machine for messenger RNA fragments. These fragments start their life as being attached to an mRNA
 * destroyer, and and then released into the cytoplasm to wander and fade.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  const AttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentStateMachine' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/RandomWalkMotionStrategy' );
  const StillnessMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/StillnessMotionStrategy' );

  // constants
  const FADE_OUT_TIME = 3; // In seconds.

  //------------------------------------------
  // States for this attachment state machine
  //------------------------------------------
  const AttachedToDestroyerState = inherit(

    AttachmentState,

    /**
     * @param {MessengerRnaFragmentAttachmentStateMachine} messengerRnaFragmentAttachmentStateMachine
     */
    function( messengerRnaFragmentAttachmentStateMachine ) {
      this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;
    },
    {
      /**
       * @override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
      }
    }
  );

  const UnattachedAndFadingState = inherit(

    AttachmentState,

    /**
     * @param {MessengerRnaFragmentAttachmentStateMachine} messengerRnaFragmentAttachmentStateMachine
     */
    function( messengerRnaFragmentAttachmentStateMachine ) {
      this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;
    },
    {
      /**
       * @override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        assert && assert( biomolecule.existenceStrengthProperty.get() === 1 );
        biomolecule.setMotionStrategy( new RandomWalkMotionStrategy( biomolecule.motionBoundsProperty ) );
      },

      /**
       * @override
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      step: function( asm, dt ) {
        const biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        biomolecule.existenceStrengthProperty.set( Math.max( biomolecule.existenceStrengthProperty.get() - dt / FADE_OUT_TIME, 0 ) );
      }
    } );

  /**
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function MessengerRnaFragmentAttachmentStateMachine( biomolecule ) {
    AttachmentStateMachine.call( this, biomolecule );
    this.setState( new AttachedToDestroyerState( this ) );
  }

  geneExpressionEssentials.register( 'MessengerRnaFragmentAttachmentStateMachine', MessengerRnaFragmentAttachmentStateMachine );

  return inherit( AttachmentStateMachine, MessengerRnaFragmentAttachmentStateMachine, {

    /**
     * @override
     * @public
     */
    detach: function() {
      this.setState( new UnattachedAndFadingState( this ) );
    }
  } );
} );

