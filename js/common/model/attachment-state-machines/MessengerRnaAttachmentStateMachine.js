// Copyright 2015-2019, University of Colorado Boulder

/**
 * Attachment state machine for messenger RNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentStateMachine' );
  const BeingDestroyedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/BeingDestroyedState' );
  const BeingSynthesizedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/BeingSynthesizedState' );
  const BeingTranslatedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/BeingTranslatedState' );
  const DetachingFromPolymeraseState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/DetachingFromPolymeraseState' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const UnattachedAndFadingState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/UnattachedAndFadingState' );
  const WanderingAroundCytoplasmState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/WanderingAroundCytoplasmState' );

  /**
   * @param {MessengerRna} messengerRna
   * @constructor
   */
  function MessengerRnaAttachmentStateMachine( messengerRna ) {
    AttachmentStateMachine.call( this, messengerRna );

    // Local reference of appropriate type.
    this.messengerRna = messengerRna; //@private;

    // @private - flag to control whether the mRNA continues to exist once fully formed
    this.fadeAwayWhenFormed = false;
    this.setState( new BeingSynthesizedState() );
  }

  geneExpressionEssentials.register( 'MessengerRnaAttachmentStateMachine', MessengerRnaAttachmentStateMachine );

  return inherit( AttachmentStateMachine, MessengerRnaAttachmentStateMachine, {

    /**
     * @override
     * Detach from the RNA polymerase. Note that this should NOT be used to detach the mRNA from ribosomes or any other
     * biomolecules.
     * @public
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
     * @override
     * @public
     */
    forceImmediateUnattachedAndAvailable: function() {
      if ( this.attachmentSite !== null ) {
        const attachedOrAttachingMolecule = this.attachmentSite.attachedOrAttachingMoleculeProperty.get();

        // this is the case for when the incoming molecule is a ribosome
        attachedOrAttachingMolecule.cancelTranslation && attachedOrAttachingMolecule.cancelTranslation();

        // this is the case for when the incoming molecule is an mRNA destroyer
        attachedOrAttachingMolecule.cancelDestruction && attachedOrAttachingMolecule.cancelDestruction();

        this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      }
      this.attachmentSite = null;
      this.setState( new WanderingAroundCytoplasmState() );
    },

    /**
     * Sets whether mRNA fades away or not when formed
     * @param {boolean} fadeAwayWhenFormed
     * @public
     */
    setFadeAwayWhenFormed: function( fadeAwayWhenFormed ) {
      this.fadeAwayWhenFormed = fadeAwayWhenFormed;
    },

    /**
     * Signals this state machine that at least one ribosome is now attached to the mRNA and is thus translating it.
     * @public
     */
    attachedToRibosome: function() {
      this.setState( new BeingTranslatedState() );
    },

    /**
     * Signals this state machine that all ribosomes that were translating it have completed the translation process and
     * have detached.
     * @public
     */
    allRibosomesDetached: function() {
      this.setState( new WanderingAroundCytoplasmState() );
    },

    /**
     * Signals this state machine that destroyer is now attached to the mRNA and is thus being destroyed.
     * @public
     */
    attachToDestroyer: function() {
      this.setState( new BeingDestroyedState() );
    }
  } );
} );

