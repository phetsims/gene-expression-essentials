//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Attachment state machine for messenger RNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentStateMachine' );
  var BeingSynthesizedState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/BeingSynthesizedState' );
  var UnattachedAndFadingState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/UnattachedAndFadingState' );
  var DetachingFromPolymeraseState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/DetachingFromPolymeraseState' );
  var WanderingAroundCytoplasmState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/WanderingAroundCytoplasmState' );
  var BeingTranslatedState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/BeingTranslatedState' );
  var BeingDestroyedState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/BeingDestroyedState' );

  /**
   * @param {MessengerRna} messengerRna
   * @constructor
   */
  function MessengerRnaAttachmentStateMachine( messengerRna ) {
    AttachmentStateMachine.call( this, messengerRna );

    // Local reference of appropriate type.
    this.messengerRna = messengerRna; //private;
    // Flag to control whether the mRNA continues to exist once fully formed.
    this.fadeAwayWhenFormed = false; //private
    this.setState( new BeingSynthesizedState() );
  }

  return inherit( AttachmentStateMachine, MessengerRnaAttachmentStateMachine, {

    /**
     * @Override
     * Detach from the RNA polymerase.  Note that this should NOT be used to
     * detach the mRNA from ribosomes or any other biomolecules.
     */
    detach: function() {
      if ( this.fadeAwayWhenFormed ) {
        this.setState( new UnattachedAndFadingState( this ) );
      }
      else {
        this.setState( new DetachingFromPolymeraseState( this ) );
      }
    },

    /**
     * @Override
     */
    forceImmediateUnattachedAndAvailable: function() {
      if ( this.attachmentSite !== null ) {
        this.attachmentSite.attachedOrAttachingMolecule = null;
      }
      this.attachmentSite = null;
      this.setState( new WanderingAroundCytoplasmState() );
    },

    /**
     * @param {boolean} fadeAwayWhenFormed
     */
    setFadeAwayWhenFormed: function( fadeAwayWhenFormed ) {
      this.fadeAwayWhenFormed = fadeAwayWhenFormed;
    },

    /**
     * Signals this state machine that at least one ribosome is now attached
     * to the mRNA and is thus translating it.
     */
    attachedToRibosome: function() {
      this.setState( new BeingTranslatedState() );
    },

    /**
     * Signals this state machine that all ribosomes that were translating it
     * have completed the translation process and have detached.
     */
    allRibosomesDetached: function() {
      this.setState( new WanderingAroundCytoplasmState() );
    },

    attachToDestroyer: function() {
      this.setState( new BeingDestroyedState() );
    }

  } );


} );

