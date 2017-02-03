// Copyright 2015, University of Colorado Boulder

/**
 * Attachment state machine for all RNA Polymerase molecules. This uses the generic behavior for all but the "attached"
 * state, and has several sub-states for the attached site.  See the code for details.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/GenericAttachmentStateMachine' );
  var AttachedToBasePair = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachedToBasePair' );
  var AttachedAndConformingState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachedAndConformingState' );
  var AttachedAndDeconformingState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachedAndDeconformingState' );
  var AttachedAndTranscribingState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachedAndTranscribingState' );
  var DnaSeparation = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaSeparation' );
  var AttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/AttachmentSite' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );


  // constants
  var HALF_LIFE_FOR_HALF_AFFINITY = 1.5; // In seconds.  Half-life of attachment to a site with affinity of 0.5.


  /**
   * @param {RnaPolymerase} rnaPolymerase
   * @constructor
   */
  function RnaPolymeraseAttachmentStateMachine( rnaPolymerase ) {
    GenericAttachmentStateMachine.call( this, rnaPolymerase );
    this.attachedAndWanderingState = new AttachedToBasePair( this ); // private
    this.attachedAndConformingState = new AttachedAndConformingState( this );
    this.attachedAndTranscribingState = new AttachedAndTranscribingState( this );
    this.attachedAndDeconformingState = new AttachedAndDeconformingState( this );

    // RNA polymerase that is being controlled by this state machine.
    this.rnaPolymerase = rnaPolymerase;

    // Set up a new "attached" state, since the behavior is different from
    // the default.
    this.attachedState = this.attachedAndWanderingState;

    // Separator used to deform the DNA strand when the RNA polymerase is
    // transcribing it. // Create the DNA strand separator.
    this.dnaStrandSeparation = new DnaSeparation( rnaPolymerase.getPosition().x, rnaPolymerase.getShape().bounds.getHeight() * 0.9 );

    // This attachment site is used by the state machine to get the polymerase
    // something to attach to when transcribing.  This is a bit hokey, but was
    // a lot easier than trying to move to each and every base pair in the DNA
    // strand.
    this.transcribingAttachmentSite = new AttachmentSite( new Vector2( 0, 0 ), 1 );

    // Threshold for the detachment algorithm, used in deciding whether or not
    // to detach completely from the DNA at a given time step.
    this.detachFromDnaThreshold = new Property( 1.0 );

    // A flag that tracks whether this state machine should use the "recycle
    // mode", which causes the polymerase to return to some new location once
    // it has completed transcription.
    this.recycleMode = false;

    this.recycleReturnZones = [];

    // Initialize the attachment site used when transcribing.
    this.transcribingAttachmentSite.attachedOrAttachingMoleculeProperty.set( rnaPolymerase );

  }

  geneExpressionEssentials.register( 'RnaPolymeraseAttachmentStateMachine', RnaPolymeraseAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, RnaPolymeraseAttachmentStateMachine, {

    /**
     * @param {boolean} recycleMode
     */
    setRecycleMode: function( recycleMode ) {
      this.recycleMode = recycleMode;
    },

    /**
     * @param {Rectangle} recycleReturnZone
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
     * @return {number}
     */
    calculateProbabilityOfDetachment: function( affinity, dt ) {

      // Map affinity to a half life.  Units are in seconds.
      // Use standard half-life formula to decide on probability of detachment.
      return 1 - Math.exp( -0.693 * dt / this.calculateHalfLifeFromAffinity( affinity ) );
    },


    /**
     * Map an affinity value to a half life of attachment
     * @param {number} affinity
     * @returns {number}
     */
    calculateHalfLifeFromAffinity: function( affinity ) {
      return HALF_LIFE_FOR_HALF_AFFINITY * ( affinity / ( 1 - affinity ) );
    },

    /**
     * @param p {Vector2}
     * @param boundsList {Array <Rectangle>}
     * @returns {boolean}
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
