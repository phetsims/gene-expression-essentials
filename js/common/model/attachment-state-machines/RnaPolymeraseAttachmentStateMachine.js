// Copyright 2015-2018, University of Colorado Boulder

/**
 * Attachment state machine for all RNA Polymerase molecules. This uses the generic behavior for all but the "attached"
 * state, and has several sub-states for the attached site.  See the code for details.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachedAndConformingState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachedAndConformingState' );
  var AttachedAndDeconformingState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachedAndDeconformingState' );
  var AttachedAndTranscribingState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachedAndTranscribingState' );
  var AttachedToDnaNotTranscribingState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachedToDnaNotTranscribingState' );
  var AttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/AttachmentSite' );
  var DnaSeparation = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaSeparation' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericAttachmentStateMachine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var HALF_LIFE_FOR_HALF_AFFINITY = 1.5; // In seconds.  Half-life of attachment to a site with affinity of 0.5.

  /**
   * @param {RnaPolymerase} rnaPolymerase
   * @constructor
   */
  function RnaPolymeraseAttachmentStateMachine( rnaPolymerase ) {
    GenericAttachmentStateMachine.call( this, rnaPolymerase );
    this.attachedAndWanderingState = new AttachedToDnaNotTranscribingState( this ); //@public
    this.attachedAndConformingState = new AttachedAndConformingState( this ); //@public
    this.attachedAndTranscribingState = new AttachedAndTranscribingState( this ); //@public
    this.attachedAndDeconformingState = new AttachedAndDeconformingState( this ); //@public

    // RNA polymerase that is being controlled by this state machine.
    this.rnaPolymerase = rnaPolymerase; //@public

    // Set up a new "attached" state, since the behavior is different from the default.
    this.attachedState = this.attachedAndWanderingState; //@public

    // Separator used to deform the DNA strand when the RNA polymerase is transcribing it.
    //@public
    this.dnaStrandSeparation = new DnaSeparation( rnaPolymerase.getPosition().x, rnaPolymerase.bounds.getHeight() * 0.9 );

    // This attachment site is used by the state machine to get the polymerase something to attach to when transcribing.
    // This is a bit hokey, but was a lot easier than trying to move to each and every base pair in the DNA strand.
    //@public
    this.transcribingAttachmentSite = new AttachmentSite( rnaPolymerase, new Vector2( 0, 0 ), 1 );

    // Threshold for the detachment algorithm, used in deciding whether or not to detach completely from the DNA at a
    // given time step.
    //@public
    this.detachFromDnaThreshold = new Property( 1.0 );

    // A flag that tracks whether this state machine should use the "recycle mode", which causes the polymerase to
    // return to some new location once it has completed transcription.
    //@public
    this.recycleMode = false;

    //@public
    this.recycleReturnZones = [];

    // Initialize the attachment site used when transcribing.
    this.transcribingAttachmentSite.attachedOrAttachingMoleculeProperty.set( rnaPolymerase );

  }

  geneExpressionEssentials.register( 'RnaPolymeraseAttachmentStateMachine', RnaPolymeraseAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, RnaPolymeraseAttachmentStateMachine, {

    /**
     * this override makes sure that the polymerase has returned to its normal shape before detaching from DNA
     * @override
     */
    forceImmediateUnattachedAndAvailable: function(){
      if ( this.attachmentState === this.attachedAndDeconformingState ){
        this.attachmentState.detachFromDna();
      }
      GenericAttachmentStateMachine.prototype.forceImmediateUnattachedAndAvailable.call( this );
    },

    /**
     * @param {boolean} recycleMode
     * @public
     */
    setRecycleMode: function( recycleMode ) {
      this.recycleMode = recycleMode;
    },

    /**
     * @param {Bounds2} recycleReturnZone
     * @public
     */
    addRecycleReturnZone: function( recycleReturnZone ) {
      this.recycleReturnZones.push( recycleReturnZone );
    },

    /**
     * Calculate the probability of detachment from the current base pair during the provided time interval. This uses
     * the same mathematics as is used for calculating probabilities of decay for radioactive atomic nuclei.
     *
     * @param {number} affinity
     * @param {number} dt
     * @returns {number}
     * @public
     */
    calculateProbabilityOfDetachment: function( affinity, dt ) {
      return 1 - Math.exp( -0.693 * dt / this.calculateHalfLifeFromAffinity( affinity ) );
    },

    /**
     * Map an affinity value to a half life of attachment
     * @param {number} affinity
     * @returns {number}
     * @public
     */
    calculateHalfLifeFromAffinity: function( affinity ) {
      return HALF_LIFE_FOR_HALF_AFFINITY * ( affinity / ( 1 - affinity ) );
    },

    /**
     * @param p {Vector2}
     * @param boundsList {Array <Rectangle>}
     * @returns {boolean}
     * @public
     */
    pointContainedInBoundsList: function( p, boundsList ) {
      for ( var i = 0; i < boundsList.length; i++ ) {
        var bounds = boundsList[ i ];
        if ( bounds.containsPoint( p ) ) {
          return true;
        }
      }
      return false;
    }
  } );
} );
